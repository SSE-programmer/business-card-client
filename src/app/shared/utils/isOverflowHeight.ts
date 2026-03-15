export function isOverflowHeight(elementSign: string | HTMLElement): boolean {
    let elem: HTMLElement | null = null;

    if (typeof elementSign === 'string') {
        elem = document.querySelector(elementSign);
    }

    if (typeof elementSign === 'object') {
        elem = elementSign;
    }


    return elem ? (elem.offsetHeight < elem.scrollHeight) : false;
}
