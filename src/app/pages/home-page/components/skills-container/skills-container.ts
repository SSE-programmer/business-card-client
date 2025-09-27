import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    ElementRef,
    inject,
    Injector,
    OnInit,
    viewChild,
    viewChildren
} from '@angular/core';
import { LevelIndicatorComponent } from '@components/level-indicator/level-indicator.component';
import { TagComponent } from '@components/tag/tag.component';
import { SKILLS_LIST } from '@pages/home-page/constants/skills-list.constant';
import * as THREE from 'three';
import { CSS3DObject, CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, first, tap } from 'rxjs';

const CONFIG = {
    MIN_ROTATION_SPEED: 0.0003,
    MAX_ROTATION_SPEED: 0.0500,
    INITIAL_ROTATION_SPEED: 0.003,
    MAX_CONTAINER_WIDTH: 500,
    INERTIA: 0.995,
    CAMERA_Z: 700,
    SPHERE_RADIUS: 250,
    OPACITY_RANGE: { min: 0.3, max: 1 },
    SCALE_RANGE: { min: 0.5, max: 1 }
};

@Component({
    selector: 'bc-skills-container',
    imports: [LevelIndicatorComponent, TagComponent],
    templateUrl: './skills-container.html',
    styleUrl: './skills-container.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillsContainer implements OnInit {
    protected readonly skillsList = SKILLS_LIST;

    private destroyRef = inject(DestroyRef);
    private injector = inject(Injector);

    private _skillsContainer = viewChild.required<ElementRef>('skillsContainer');
    private _skillElementsList = viewChildren<string, ElementRef>('skill', { read: ElementRef });

    private _scene: THREE.Scene | null = null;
    private _camera: THREE.PerspectiveCamera | null = null;
    private _renderer: CSS3DRenderer | null = null;
    private _objects: CSS3DObject[] = [];

    private _rotationQuaternion = new THREE.Quaternion();
    private _angularVelocity = new THREE.Vector2(CONFIG.INITIAL_ROTATION_SPEED, CONFIG.INITIAL_ROTATION_SPEED);
    private _dragQuaternion = new THREE.Quaternion();

    private _isDragging = false;
    private _previousPosition = { x: 0, y: 0 };
    private _animationId: number | null = null;

    private _reusable = {
        center: new THREE.Vector3(0, 0, 0),
        cameraPosition: new THREE.Vector3(),
        worldPosition: new THREE.Vector3(),
        worldNormal: new THREE.Vector3(),
        elementToCamera: new THREE.Vector3()
    };

    public ngOnInit(): void {
        toObservable(this._skillElementsList, { injector: this.injector })
            .pipe(
                filter(skills => Boolean(skills.length)),
                first(),
                tap(() => this._initScene())
            )
        .subscribe();
    }

    private _initScene(): void {
        const container = this._skillsContainer().nativeElement;
        const { width, height } = container.getBoundingClientRect();
        const size = Math.min(width, height, CONFIG.MAX_CONTAINER_WIDTH);

        this._setupThreeJS(container, size);
        this._createDomSphere();
        this._setupEventListeners(container);
        this._animate();

        this.destroyRef.onDestroy(() => this._cleanup());
    }

    private _setupThreeJS(container: HTMLElement, size: number): void {
        this._scene = new THREE.Scene();
        this._camera = new THREE.PerspectiveCamera(50, 1, 1, 5000);
        this._camera.position.z = CONFIG.CAMERA_Z;

        this._renderer = new CSS3DRenderer();
        this._renderer.setSize(size, size);

        const domElement = this._renderer.domElement;

        domElement.style.cssText = `
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        `;

        container.appendChild(domElement);
    }

    private _createDomSphere(): void {
        if (!this._scene) {
            return;
        }

        const elements = this._skillElementsList().map(el => el.nativeElement);

        elements.forEach((element: HTMLElement, index: number) => {
            element.classList.add('dom-element');

            const object = new CSS3DObject(element);

            this._setSpherePosition(object, index, elements.length);

            object.userData = { element, index };
            // tslint:disable-next-line:no-non-null-assertion
            this._scene!.add(object);
            this._objects.push(object);
        });
    }

    private _setSpherePosition(object: CSS3DObject, index: number, total: number): void {
        const phi = Math.acos(-1 + (2 * index) / total);
        const theta = Math.sqrt(total * Math.PI) * phi;
        const radius = CONFIG.SPHERE_RADIUS;

        object.position.set(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta),
            radius * Math.cos(phi)
        );
    }

    private _animate = (): void => {
        if (!this._scene || !this._camera || !this._renderer) {
            return;
        }

        this._animationId = requestAnimationFrame(this._animate);
        this._applyRotation();
        this._updateElementsStyle();
        this._renderer.render(this._scene, this._camera);
    }

    private _applyRotation(): void {
        if (!this._scene) {
            return;
        }

        const delta = this._calculateRotationDelta();

        this._rotationQuaternion.premultiply(delta);
        this._scene.setRotationFromQuaternion(this._rotationQuaternion);

        if (!this._isDragging) {
            this._angularVelocity.multiplyScalar(CONFIG.INERTIA);
            this._clampAngularVelocity();
        }
    }

    private _calculateRotationDelta(): THREE.Quaternion {
        const quaternionX = new THREE.Quaternion();
        const quaternionY = new THREE.Quaternion();

        quaternionY.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this._angularVelocity.y);
        quaternionX.setFromAxisAngle(new THREE.Vector3(1, 0, 0), this._angularVelocity.x);

        return quaternionY.multiply(quaternionX);
    }

    private _clampAngularVelocity(): void {
        this._angularVelocity.set(
            this._clampValue(this._angularVelocity.x, CONFIG.MIN_ROTATION_SPEED, CONFIG.MAX_ROTATION_SPEED),
            this._clampValue(this._angularVelocity.y, CONFIG.MIN_ROTATION_SPEED, CONFIG.MAX_ROTATION_SPEED)
        );
    }

    private _clampValue(value: number, min: number, max: number): number {
        return Math.min(Math.max(min, Math.abs(value)), max) * (Math.sign(value) || 1);
    }

    private _updateElementsStyle(): void {
        if (!this._camera) {
            return;
        }

        const { center, cameraPosition, worldPosition, worldNormal, elementToCamera } = this._reusable;

        this._camera.getWorldPosition(cameraPosition);

        this._objects.forEach(object => {
            const element = object.userData['element'] as HTMLElement;

            if (!element) {
                return;
            }

            object.getWorldPosition(worldPosition);
            worldNormal.copy(worldPosition).sub(center).normalize();
            elementToCamera.subVectors(cameraPosition, worldPosition).normalize();

            const facingRatio = worldNormal.dot(elementToCamera);
            const opacity = this._calculateOpacity(facingRatio);
            const scale = this._calculateScale(facingRatio);

            element.style.opacity = opacity.toString();
            element.style.transform = `scale(${scale})`;
            // tslint:disable-next-line:no-non-null-assertion
            object.lookAt(this._camera!.position);
        });
    }

    private _calculateOpacity(facingRatio: number): number {
        const range = CONFIG.OPACITY_RANGE.max - CONFIG.OPACITY_RANGE.min;

        return CONFIG.OPACITY_RANGE.min + (facingRatio + 1) * 0.5 * range;
    }

    private _calculateScale(facingRatio: number): number {
        const range = CONFIG.SCALE_RANGE.max - CONFIG.SCALE_RANGE.min;

        return CONFIG.SCALE_RANGE.min + (facingRatio + 1) * 0.5 * range;
    }

    private _setupEventListeners(container: HTMLElement): void {
        const events = {
            mousedown: this._onDragStart.bind(this),
            mousemove: this._onDragMove.bind(this),
            mouseup: this._onDragEnd.bind(this),
            mouseleave: this._onDragEnd.bind(this),
            touchstart: this._onTouchStart.bind(this),
            touchmove: this._onDragMove.bind(this),
            touchend: this._onDragEnd.bind(this),
            touchcancel: this._onDragEnd.bind(this),
            resize: this._onResize.bind(this)
        };

        Object.entries(events).forEach(([event, handler]) => {
            const options = event.startsWith('touch') ? { passive: false } : undefined;
            const target = event === 'resize' ? window : container;
            target.addEventListener(event, handler as EventListener, options);
        });
    }

    private _onDragStart(event: MouseEvent | TouchEvent): void {
        event.preventDefault();
        this._isDragging = true;
        this._previousPosition = this._getEventPosition(event);
    }

    private _onDragMove(event: MouseEvent | TouchEvent): void {
        if (!this._isDragging || !this._scene) {
            return;
        }

        const position = this._getEventPosition(event);
        const deltaX = position.x - this._previousPosition.x;
        const deltaY = position.y - this._previousPosition.y;

        this._applyDragRotation(deltaX, deltaY);
        this._previousPosition = position;
    }

    private _onDragEnd(): void {
        this._isDragging = false;
    }

    private _onTouchStart(event: TouchEvent): void {
        if (event.touches.length === 1) {
            this._onDragStart(event);
        }
    }

    private _onResize = (): void => {
        const container = this._skillsContainer().nativeElement;

        if (!container || !this._camera || !this._renderer) {
            return;
        }

        const { width, height } = container.getBoundingClientRect();
        const size = Math.min(width, height);

        this._renderer.setSize(size, size);
        this._camera.aspect = 1;
        this._camera.updateProjectionMatrix();
    }

    private _getEventPosition(event: MouseEvent | TouchEvent): { x: number; y: number } {
        const source = 'touches' in event ? event.touches[0] : event;
        return { x: source.clientX, y: source.clientY };
    }

    private _applyDragRotation(deltaX: number, deltaY: number): void {
        if (!this._scene) {
            return;
        }

        const sensitivity = 'ontouchstart' in window ? 0.002 : 0.001;
        const quaternionX = new THREE.Quaternion();
        const quaternionY = new THREE.Quaternion();

        quaternionY.setFromAxisAngle(new THREE.Vector3(0, 1, 0), deltaX * sensitivity);
        quaternionX.setFromAxisAngle(new THREE.Vector3(1, 0, 0), deltaY * sensitivity);

        this._dragQuaternion.copy(quaternionY).multiply(quaternionX);
        this._rotationQuaternion.premultiply(this._dragQuaternion);
        this._scene.setRotationFromQuaternion(this._rotationQuaternion);

        this._angularVelocity.set(deltaY * sensitivity, deltaX * sensitivity);
        this._clampAngularVelocity();
    }

    private _cleanup(): void {
        if (this._animationId) {
            cancelAnimationFrame(this._animationId);
            this._animationId = null;
        }

        if (this._renderer) {
            this._renderer.domElement.remove();
            this._renderer = null;
        }

        this._objects = [];
        this._scene = null;
        this._camera = null;
    }
}
