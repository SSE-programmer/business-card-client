import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, OnDestroy, signal, viewChild, viewChildren } from '@angular/core';
import { LevelIndicatorComponent } from '@components/level-indicator/level-indicator.component';
import { TagComponent } from '@components/tag/tag.component';
import { SKILLS_LIST } from '@pages/home-page/constants/skills-list.constant';
import * as THREE from 'three';
import { CSS3DObject, CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';

const MIN_ROTATION_SPEED = 0.0002;
const INITIAL_ROTATION_SPEED = 0.002;

type SpeedVector = [number, number];

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
    rotationSpeedVec = signal<SpeedVector>([INITIAL_ROTATION_SPEED, INITIAL_ROTATION_SPEED]);
    inertia = signal(0.995);

    private scene: THREE.Scene | null = null;
    private camera: THREE.PerspectiveCamera | null = null;
    private renderer: CSS3DRenderer | null = null;
    private objects: CSS3DObject[] = [];
    private animationId: number | null = null;

    skillsContainer = viewChild<ElementRef>('skillsContainer');
    skillElementsList = viewChildren<string, ElementRef>('skill', {read: ElementRef});

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

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 1, 5000);
        this.camera.position.z = 1500;

        this.renderer = new CSS3DRenderer();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
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

        Array.from(sourceElements).forEach((element: HTMLElement, index: number) => {
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

        // Вращение с инерцией
        const [rotationSpeedX, rotationSpeedY] = this.rotationSpeedVec();

        this.scene.rotation.x += rotationSpeedX;
        this.scene.rotation.y += rotationSpeedY;
        this._updateRotationSpeed(rotationSpeedX * this.inertia(), rotationSpeedY * this.inertia());

        // Обновление прозрачности и масштаба
        this.updateElementsStyle();

        this.renderer.render(this.scene, this.camera);
    }

    private _updateRotationSpeed(x: number, y: number) {
        this.rotationSpeedVec.set([
            this._enforceMinAbs(x, MIN_ROTATION_SPEED),
            this._enforceMinAbs(y, MIN_ROTATION_SPEED),
        ]);
    }

    private _enforceMinAbs(value: number, MIN: number) {
        if (Math.abs(value) < MIN) {
            return Math.sign(value) === -1 ? -MIN : MIN;
        }

        return value;
    }

    private updateElementsStyle() {
        if (!this.camera) {
            return;
        }

        this.objects.forEach(object => {
            const element = object.userData['element'] as HTMLElement;

            if (!element) {
                return;
            }

            // tslint:disable-next-line:no-non-null-assertion
            const distance = object.position.distanceTo(this.camera!.position);
            const maxDistance = 12000;

            // Динамическая прозрачность и масштаб
            const opacity = Math.max(0.3, 1 - (distance / maxDistance));
            const scale = Math.max(0.5, 1 - (distance / maxDistance));

            // Применяем стили
            element.style.opacity = opacity.toString();
            element.style.transform = `scale(${scale})`;

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            object.lookAt(this.camera.position);
        });
    }

    private setupEventListeners(container: HTMLElement) {
        this.mouseEventListeners = {
            mousedown: this.onMouseDown.bind(this),
            mousemove: this.onMouseMove.bind(this),
            mouseup: this.onMouseUp.bind(this),
            wheel: this.onMouseWheel.bind(this),
            resize: this.onWindowResize.bind(this)
        };

        container.addEventListener('mousedown', this.mouseEventListeners['mousedown']);
        container.addEventListener('mousemove', this.mouseEventListeners['mousemove']);
        container.addEventListener('mouseup', this.mouseEventListeners['mouseup']);
        container.addEventListener('wheel', this.mouseEventListeners['wheel']);
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

        this._updateRotationSpeed(deltaY * 0.0005, deltaX * 0.0005);

        this.previousMousePosition = { x: event.clientX, y: event.clientY };
    }

    private onMouseUp() {
        this.isDragging = false;
    }

    private onMouseWheel(event: WheelEvent) {
        if (!this.camera) {
            return;
        }

        event.preventDefault();
        this.camera.position.z += event.deltaY * 0.5;
        this.camera.position.z = Math.max(500, Math.min(2500, this.camera.position.z));
    }

    private onWindowResize() {
        const container = this.skillsContainer()?.nativeElement;

        if (!container || !this.camera || !this.renderer) {
            return;
        }

        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
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
