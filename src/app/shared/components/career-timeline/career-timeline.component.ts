import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    effect,
    ElementRef,
    inject,
    input,
    OnInit,
    signal,
    untracked,
} from '@angular/core';
import { IJobExperience, IPosition } from './models/IJobExperience';
import { PositionItemComponent } from './components/position-item/position-item.component';
import { ViewportService } from '@services/viewport.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap, throttleTime } from 'rxjs';
import { TooltipService } from '../tooltip/tooltip.service';
import { IPositionTooltipData, PositionTooltipComponent } from './components/position-tooltip/position-tooltip.component';
import { TooltipRef } from '../tooltip/tooltip.ref';
import { DynamicModalService } from '../dynamic-modal/dynamic-modal.service';
import { PositionModalComponent } from './components/position-modal/position-modal.component';

@Component({
    selector: 'bc-career-timeline',
    templateUrl: './career-timeline.component.html',
    styleUrl: './career-timeline.component.scss',
    imports: [
        PositionItemComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CareerTimelineComponent implements OnInit, AfterViewInit {
    private viewportService = inject(ViewportService);
    private elementRef = inject(ElementRef<HTMLElement>);
    private tooltipService = inject(TooltipService);
    private dynamicModalService = inject(DynamicModalService);
    private destroyRef = inject(DestroyRef);

    private _tooltipRef: TooltipRef | null | undefined;

    public jobExperience = input<IJobExperience[], IJobExperience[]>([], {
        transform(value: IJobExperience[]): IJobExperience[] {
            return value.map(job => {
                return ({
                    ...job,
                    positions: job.positions.sort((a, b) => a.startDate.getTime() - b.startDate.getTime()),
                });
            });
        },
    });
    public minYear = signal<number>(new Date().getFullYear());
    public maxYear = signal<number>(new Date().getFullYear());
    public yearsList = signal<number[]>([]);
    public yearCellAnchorWidth = signal<number>(0);
    public yearCellLeftMarginWidth = signal<number>(0);

    protected YEAR_CELL_MIN_WIDTH = 75;
    protected YEAR_CELL_VERTICAL_PADDING = 8;
    protected FIRST_YEAR_LEFT_MARGIN_PADDING = 20;

    public ngOnInit(): void {
        this.viewportService.dimensions$.pipe(
            takeUntilDestroyed(this.destroyRef),
            throttleTime(25),
            tap(() => {
                this._calculateYearCellLeftMarginWidth();
                this._calculateYearCellAnchorWidth();
            }),
        )
            .subscribe();
    }

    public ngAfterViewInit() {
        requestAnimationFrame(() => {
            this._calculateYearCellLeftMarginWidth();
            this._calculateYearCellAnchorWidth();
        });
    }

    public showPositionTooltip(event: Event, position: IPosition): void {
        if (event instanceof PointerEvent && event.pointerType === 'touch') {
            return;
        }

        if (position === this._tooltipRef?.getInstance()?.tooltipConfig.data.position) {
            return;
        }

        this.hidePositionTooltip();

        this.tooltipService.open<IPositionTooltipData>(event, PositionTooltipComponent, {
            stickingElement: event.target as HTMLElement,
            isStatic: true,
            offset: [0, 8],
            preventOutsideClick: true,
            data: {
                position,
            },
        })
            .subscribe(tooltipRef => {
                this._tooltipRef = tooltipRef;
            });
    }

    public hidePositionTooltip() {
        if (this._tooltipRef) {
            setTimeout(() => {
                this.tooltipService.close(this._tooltipRef?.reference);
                this._tooltipRef = null;
            });
        }
    }

    public openPositionModal(company: string, position: IPosition): void {
        this.dynamicModalService.open(PositionModalComponent, {
            modalName: 'Job Position',
            data: {
                company,
                position,
            },
            width: '1200px',
            mediaQueries: [
                {
                    query: '(max-width: 720px)',
                    width: '100%',
                },
            ],
        });
    }

    private _jobExperienceEffect = effect(() => {
        this.jobExperience().forEach(job => {
            job.positions.forEach(position => {
                const currentMinYear = untracked(() => this.minYear());
                const currentMaxYear = untracked(() => this.maxYear());
                const minPositionYear = position.startDate.getFullYear();
                const maxPositionYear = position.endDate?.getFullYear();

                if (minPositionYear < currentMinYear) {
                    untracked(() => this.minYear.set(position.startDate.getFullYear()));
                }

                if (maxPositionYear && maxPositionYear > currentMaxYear) {
                    untracked(() => this.maxYear.set(maxPositionYear));
                }
            });
        });

        const yearsList = Array.from(
            { length: this.maxYear() - this.minYear() + 1 },
            (_, i) => this.minYear() + i,
        );

        untracked(() => {
            yearsList.unshift(this.minYear() - 1);
            this.yearsList.set(yearsList);
        });
    });

    private _calculateYearCellAnchorWidth() {
        const yearCellAnchorElement = this.elementRef.nativeElement.querySelector('.year-cell-anchor');

        if (!yearCellAnchorElement) {
            this.yearCellAnchorWidth.set(0);

            return;
        }

        this.yearCellAnchorWidth.set(yearCellAnchorElement.offsetWidth);
    }

    private _calculateYearCellLeftMarginWidth() {
        const yearCellLeftMarginElement = this.elementRef.nativeElement.querySelector('.year-cell-left-margin');

        if (!yearCellLeftMarginElement) {
            this.yearCellLeftMarginWidth.set(0);

            return;
        }

        this.yearCellLeftMarginWidth.set(yearCellLeftMarginElement.offsetWidth);
    }
}
