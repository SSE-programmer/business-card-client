import { ApplicationRef, ComponentRef, EmbeddedViewRef, inject, Injectable, Injector, Type, ViewContainerRef } from '@angular/core';
import { createPopper, VirtualElement } from '@popperjs/core';
import { TooltipComponent } from './tooltip.component';
import { TooltipConfig } from './tooltip.config';
import { TooltipInjector } from './tooltip.injector';
import { TooltipRef } from './tooltip.ref';
import { from, Observable } from 'rxjs';

export interface ITooltipEntity {
    reference: ComponentRef<TooltipComponent>;
    config: TooltipConfig;
}

@Injectable({
    providedIn: 'root',
})
export class TooltipService {
    private readonly applicationRef = inject(ApplicationRef);
    private readonly injector = inject(Injector);

    private _viewContainerRef: ViewContainerRef | null = null;

    public setViewContainerRef(vcr: ViewContainerRef) {
        this._viewContainerRef = vcr;
    }

    public appendTooltipComponentToBody(event: Event | MouseEvent, componentType: Type<any>, config: TooltipConfig) {
        const map = new WeakMap();
        map.set(TooltipConfig, config);

        const tooltipRef = new TooltipRef();
        map.set(TooltipRef, tooltipRef);

        if (!this._viewContainerRef) {
            return;
        }

        const componentRef = this._viewContainerRef.createComponent<TooltipComponent>(
            TooltipComponent,
            {
                injector: new TooltipInjector(this.injector, map),
            },
        );

        tooltipRef.reference = componentRef;

        const tooltipDOMElement = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        const stickingElement = config.stickingElement;

        if (!(stickingElement && tooltipDOMElement)) {
            return;
        }

        const boundariesElement = config.boundariesElement;

        document.body.appendChild(tooltipDOMElement);
        componentRef.instance.childComponentType = componentType;

        function generateGetBoundingClientRect(x1 = 0, y1 = 0, x2?: number, y2?: number): () => ClientRect | DOMRect {
            return (() => ({
                width: 0,
                height: 0,
                top: y1,
                right: x1,
                bottom: y2 ?? y1,
                left: x2 ?? x1,
            })) as () => ClientRect | DOMRect;
        }

        const virtualElement: VirtualElement = {
            getBoundingClientRect: boundariesElement ? generateGetBoundingClientRect(
                boundariesElement.clientLeft,
                boundariesElement.clientTop,
                boundariesElement.clientLeft + boundariesElement.clientWidth,
                boundariesElement.clientTop + boundariesElement.clientHeight,
            ) : generateGetBoundingClientRect(),
            contextElement: config.boundariesElement,
        };

        const popperDefaultOptions = {
            strategy: 'fixed',
            modifiers: [
                {
                    name: 'flip',
                    options: {
                        rootBoundary: 'document',
                    },
                },
                config.offset && {
                    name: 'offset',
                    options: {
                        offset: config.offset
                    }
                },
                {
                    name: 'preventOverflow',
                    options: {
                        mainAxis: true,
                        altAxis: true,
                        rootBoundary: 'document',
                    },
                },
                {
                    name: 'arrow'
                },
            ],
        };

        const contextInstance = createPopper(
            config.isStatic ? stickingElement : virtualElement,
            tooltipDOMElement,
            config.popperOptions || popperDefaultOptions,
        );

        if (!config.isStatic && event instanceof MouseEvent) {
            virtualElement.getBoundingClientRect = generateGetBoundingClientRect(event.clientX, event.clientY);
        }

        setTimeout(() => {
            contextInstance.update();
        });

        componentRef.onDestroy(() => {
            contextInstance.destroy();
        });

        componentRef.instance.componentRef = componentRef;

        return tooltipRef;
    }

    public open<D>(event: Event, componentType: Type<any>, config: TooltipConfig<D>): Observable<TooltipRef | undefined> {
        this._checkConfigRequiredParameters(config);

        const tooltipRefPromise = new Promise<TooltipRef | undefined>(resolve => {
            setTimeout(() => {
                const result = this.appendTooltipComponentToBody(event, componentType, config);

                resolve(result);
            });
        });

        return from(tooltipRefPromise);
    }

    public close(tooltipRef: ComponentRef<TooltipComponent> | null | undefined) {
        this._removeTooltipComponentFromBody(tooltipRef);

        const onCloseCallback = tooltipRef?.instance.tooltipConfig.onCloseCallback;

        if (onCloseCallback) {
            onCloseCallback();
        }
    }

    private _removeTooltipComponentFromBody(tooltipRef: ComponentRef<TooltipComponent> | null | undefined) {
        if (!tooltipRef) {
            return;
        }

        const tooltipDomElement = tooltipRef.location.nativeElement;

        tooltipDomElement.addEventListener('animationend', () => {
            this.applicationRef.detachView(tooltipRef.hostView);
            tooltipRef.destroy();
        }, { once: true });

        tooltipDomElement.classList.add('closed');
    }

    private _checkConfigRequiredParameters(config: TooltipConfig) {
        if (!config.stickingElement) {
            throw new Error('Sticking HTML element is required!');
        }

        if (!config.data) {
            throw new Error('Data is required!');
        }
    }
}
