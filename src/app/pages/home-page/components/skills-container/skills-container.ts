import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, OnDestroy, signal, viewChild, viewChildren } from '@angular/core';
import { LevelIndicatorComponent } from '@components/level-indicator/level-indicator.component';
import { TagComponent } from '@components/tag/tag.component';
import { SKILLS_LIST } from '@pages/home-page/constants/skills-list.constant';
import * as THREE from 'three';
import { CSS3DObject, CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';

const MIN_ROTATION_SPEED = 0.0003;
const MAX_ROTATION_SPEED = 0.0500;
const INITIAL_ROTATION_SPEED = 0.003;

@Component({
  selector: 'bc-skills-container',
  imports: [
      LevelIndicatorComponent,
      TagComponent
  ],
  templateUrl: './skills-container.html',
  styleUrl: './skills-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillsContainer implements OnDestroy {
    protected readonly skillsList = SKILLS_LIST;

    private elementRef = inject(ElementRef);

    protected isSphere = signal(false);
    inertia = signal(0.995);

    private scene: THREE.Scene | null = null;
    private camera: THREE.PerspectiveCamera | null = null;
    private renderer: CSS3DRenderer | null = null;
    private objects: CSS3DObject[] = [];
    private animationId: number | null = null;

    skillsContainer = viewChild<ElementRef>('skillsContainer');
    skillElementsList = viewChildren<string, ElementRef>('skill', {read: ElementRef});

    private rotationQuaternion = new THREE.Quaternion();
    private angularVelocity = new THREE.Vector2(INITIAL_ROTATION_SPEED, INITIAL_ROTATION_SPEED);
    private dragQuaternion = new THREE.Quaternion();
    private tempQuaternion = new THREE.Quaternion();

    private isDragging = false;
    private previousMousePosition = { x: 0, y: 0 };
    private mouseEventListeners: { [key: string]: (event: any) => void } = {};

    constructor() {
        effect((onCleanup) => {
            if (this.isSphere()) {
                setTimeout(() => this._initScene(), 0);

                onCleanup(() => {
                    this.cleanup();
                });
            }
        });
    }

    protected toggleSphere() {
        this.isSphere.set(!this.isSphere());
    }

    private _initScene() {
        const container = this.skillsContainer()?.nativeElement;

        if (!container) {
            return;
        }

        this.cleanup();

        const { width, height } = container.getBoundingClientRect();
        const size = Math.min(width, height);

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(50, 1, 1, 5000); // aspect = 1
        this.camera.position.z = 900;

        this.renderer = new CSS3DRenderer();
        this.renderer.setSize(size, size);

        this.renderer.domElement.style.position = 'absolute';
        this.renderer.domElement.style.left = '50%';
        this.renderer.domElement.style.top = '50%';
        this.renderer.domElement.style.transform = 'translate(-50%, -50%)';

        container.appendChild(this.renderer.domElement);

        this.createDomSphere();
        this.setupEventListeners(container);
        this.animate();
    }

    private createDomSphere() {
        if (!this.scene) {
            return;
        }

        const sourceElements = Array
            .from(this.skillElementsList())
            .map(elementRef => elementRef.nativeElement);

        const radius = 300;

        Array
            .from(sourceElements)
            .forEach((element: HTMLElement, index: number) => {
                element.classList.add('dom-element');

                // Создаем CSS3D объект
                const object = new CSS3DObject(element);

                // Располагаем на сфере (фибоначчиево распределение)
                const phi = Math.acos(-1 + (2 * index) / sourceElements.length);
                const theta = Math.sqrt(sourceElements.length * Math.PI) * phi;

                object.position.set(
                    radius * Math.sin(phi) * Math.cos(theta),
                    radius * Math.sin(phi) * Math.sin(theta),
                    radius * Math.cos(phi)
                );

                object.userData = {
                    originalPosition: object.position.clone(),
                    index,
                    element: element
                };

                // tslint:disable-next-line:no-non-null-assertion
                this.scene!.add(object);
                this.objects.push(object);
            });
    }

    private animate = () => {
        if (!this.scene || !this.camera || !this.renderer) {
            return;
        }

        this.animationId = requestAnimationFrame(this.animate);

        // Всегда применяем вращение на основе angularVelocity
        this.applyRotation();

        // Обновление прозрачности и масштаба
        this.updateElementsStyle();

        this.renderer.render(this.scene, this.camera);
    }

    private applyRotation() {
        // Применяем вращение через кватернионы
        const quaternionX = new THREE.Quaternion();
        const quaternionY = new THREE.Quaternion();

        quaternionY.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.angularVelocity.y);
        quaternionX.setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.angularVelocity.x);

        this.tempQuaternion.copy(quaternionY).multiply(quaternionX);
        this.rotationQuaternion.premultiply(this.tempQuaternion);
        // tslint:disable-next-line:no-non-null-assertion
        this.scene!.setRotationFromQuaternion(this.rotationQuaternion);

        // Замедление только когда не dragging
        if (!this.isDragging) {
            this.angularVelocity.multiplyScalar(this.inertia());
            this._updateRotationSpeed(this.angularVelocity.x, this.angularVelocity.y);
        }
    }

    private _updateRotationSpeed(x: number, y: number) {
        this.angularVelocity.set(
            this._enforceMinMaxAbs(x, MIN_ROTATION_SPEED, MAX_ROTATION_SPEED),
            this._enforceMinMaxAbs(y, MIN_ROTATION_SPEED, MAX_ROTATION_SPEED)
        );
    }

    private _enforceMinMaxAbs(value: number, MIN: number, MAX: number) {
        return Math.min(Math.max(MIN, Math.abs(value)), MAX) * (Math.sign(value) || 1);
    }

    private updateElementsStyle() {
        if (!this.camera || !this.scene) {
            return;
        }

        const center = new THREE.Vector3(0, 0, 0);

        // Получаем мировую позицию камеры (уже учитывает вращение сцены)
        const cameraPosition = this.camera.getWorldPosition(new THREE.Vector3());

        // Создаем временный объект для мировых координат
        const worldPosition = new THREE.Vector3();
        const worldNormal = new THREE.Vector3();

        this.objects.forEach(object => {
            const element = object.userData['element'] as HTMLElement;

            if (!element) {
                return;
            }

            // 1. Получаем мировую позицию элемента (с учетом вращения сцены)
            object.getWorldPosition(worldPosition);

            // 2. Вычисляем нормаль от центра к элементу в мировых координатах
            worldNormal.copy(worldPosition).sub(center).normalize();

            // 3. Направление от элемента к камере в мировых координатах
            const elementToCamera = new THREE.Vector3()
                .subVectors(cameraPosition, worldPosition)
                .normalize();

            // 4. Косинус угла между нормалью и направлением к камере
            const facingRatio = worldNormal.dot(elementToCamera);

            // 5. Прозрачность зависит только от ориентации
            const opacity = 0.3 + (facingRatio + 1) * 0.35;
            const scale = 0.5 + (facingRatio + 1) * 0.25;

            element.style.opacity = Math.max(0.3, Math.min(1, opacity)).toString();
            element.style.transform = `scale(${Math.max(0.5, Math.min(1, scale))})`;

            // Поворачиваем элемент лицом к камере
            // tslint:disable-next-line:no-non-null-assertion
            object.lookAt(this.camera!.position);
        });
    }


    private setupEventListeners(container: HTMLElement) {
        this.mouseEventListeners = {
            mousedown: this.onMouseDown.bind(this),
            mousemove: this.onMouseMove.bind(this),
            mouseup: this.onMouseUp.bind(this),
            resize: this.onWindowResize.bind(this)
        };

        container.addEventListener('mousedown', this.mouseEventListeners['mousedown']);
        container.addEventListener('mousemove', this.mouseEventListeners['mousemove']);
        container.addEventListener('mouseup', this.mouseEventListeners['mouseup']);
        window.addEventListener('resize', this.mouseEventListeners['resize']);
    }

    private onMouseDown(event: MouseEvent) {
        this.isDragging = true;
        this.previousMousePosition = { x: event.clientX, y: event.clientY };
    }

    private onMouseMove(event: MouseEvent) {
        if (!this.isDragging || !this.scene) {
            return;
        }

        const deltaX = event.clientX - this.previousMousePosition.x;
        const deltaY = event.clientY - this.previousMousePosition.y;

        // Непосредственно применяем вращение во время drag
        const sensitivity = 0.001;

        const quaternionX = new THREE.Quaternion();
        const quaternionY = new THREE.Quaternion();

        quaternionY.setFromAxisAngle(new THREE.Vector3(0, 1, 0), deltaX * sensitivity);
        quaternionX.setFromAxisAngle(new THREE.Vector3(1, 0, 0), deltaY * sensitivity);

        this.dragQuaternion.copy(quaternionY).multiply(quaternionX);
        this.rotationQuaternion.premultiply(this.dragQuaternion);
        this.scene.setRotationFromQuaternion(this.rotationQuaternion);

        // Сохраняем скорость для инерции после отпускания
        this._updateRotationSpeed(deltaY * sensitivity, deltaX * sensitivity);

        this.previousMousePosition = { x: event.clientX, y: event.clientY };
    }

    private onMouseUp() {
        this.isDragging = false;
    }

    private onWindowResize() {
        const container = this.skillsContainer()?.nativeElement;

        if (!container || !this.camera || !this.renderer) {
            return;
        }

        const { width, height } = container.getBoundingClientRect();
        const size = Math.min(width, height);

        this.renderer.setSize(size, size);
        this.camera.aspect = 1;
        this.camera.updateProjectionMatrix();
    }

    private cleanup() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }

        if (this.renderer) {
            const container = this.skillsContainer()?.nativeElement;
            if (container && container.contains(this.renderer.domElement)) {
                container.removeChild(this.renderer.domElement);
            }
            this.renderer = null;
        }

        this.objects = [];
        this.scene = null;
        this.camera = null;

        // Удаляем обработчики событий
        Object.entries(this.mouseEventListeners).forEach(([event, listener]) => {
            if (event === 'resize') {
                window.removeEventListener(event, listener);
            } else {
                const container = this.skillsContainer()?.nativeElement;
                if (container) {
                    container.removeEventListener(event, listener);
                }
            }
        });
        this.mouseEventListeners = {};
    }

    public ngOnDestroy() {
        this.cleanup();
    }
}
