import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

@Injectable()
export class AppDateAdapter extends NativeDateAdapter {
    override parse(value: unknown): Date | null {
        if ((typeof value === 'string')) {
            let separator = '';
            if (value.indexOf('/') > -1) separator = '/';
            if (value.indexOf('.') > -1) separator = '.';

            if (separator) {
                const str = value.split(separator);
                const date = Number(str[0]);
                const month = Number(str[1]) - 1;
                const year = Number(str[2]);

                return new Date(year, month, date);
            }
        }

        const timestamp = typeof value === 'number' ? value : Date.parse(value as string);

        return isNaN(timestamp) ? null : new Date();
    }

    override format(date: Date, displayFormat: string): string {
        if (displayFormat === 'input') {
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            return this._to2digit(day) + '.' + this._to2digit(month) + '.' + year;
        } else if (displayFormat === 'inputMonth') {
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            return this._to2digit(month) + '.' + year;
        } else {
            return date.toDateString();
        }
    }

    override getFirstDayOfWeek(): number {
        return 1;
    }

    private _to2digit(n: number): string {
        return ('00' + n).slice(-2);
    }
}

export const APP_DATE_FORMATS = {
    parse: {
        dateInput: {
            month: 'short', year: 'numeric', day: 'numeric'
        }
    },
    display: {
        dateInput: 'input',
        monthYearLabel: 'inputMonth',
        dateAllyLabel: {
            year: 'numeric',
            month: 'long',
            date: 'numeric',
            monthYearAllyLabel: { year: 'numeric', month: 'long' }
        }
    }
};
