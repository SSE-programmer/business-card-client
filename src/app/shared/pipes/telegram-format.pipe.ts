import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import hljs from 'highlight.js';

@Pipe({
    name: 'telegramFormat'
})
export class TelegramFormatPipe implements PipeTransform {
    private readonly sanitizer = inject(DomSanitizer);

    transform(
        value: string | null,
        options?: {
            decode?: boolean;
            highlight?: boolean;
            truncate?: number;
        }
    ): SafeHtml {
        if (!value) {
            return '';
        }

        let processed = value;

        if (options?.decode !== false) {
            processed = this.decodeEntities(processed);
        }

        if (options?.highlight !== false) {
            processed = this.highlightCode(processed);
        }

        if (options?.truncate) {
            processed = this.truncateHtml(processed, options.truncate);
        }

        return this.sanitizer.bypassSecurityTrustHtml(processed);
    }

    private decodeEntities(html: string): string {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = html;
        return textarea.value;
    }

    private highlightCode(html: string): string {
        const div = document.createElement('div');
        div.innerHTML = html;

        const codeBlocks = div.querySelectorAll('pre code');

        codeBlocks.forEach((block) => {
            const code = block.textContent || '';

            try {
                const classNames = block.className.split(' ');
                const languageClass = classNames.find(cls => cls.startsWith('language-'));
                const language = languageClass ? languageClass.replace('language-', '') : '';

                let result: { value: string };

                if (language && hljs.getLanguage(language)) {
                    result = hljs.highlight(code, { language, ignoreIllegals: true });
                } else {
                    result = hljs.highlightAuto(code);
                }

                block.innerHTML = result.value;
                block.classList.add('hljs', 'bc-scroll');
            } catch (e) {
                console.error('Error highlighting code:', e);
            }
        });

        return div.innerHTML;
    }

    private truncateHtml(html: string, maxLength: number): string {
        if (html.length <= maxLength) {
            return html;
        }

        const div = document.createElement('div');
        div.innerHTML = html;

        let currentLength = 0;
        const walker = document.createTreeWalker(
            div,
            NodeFilter.SHOW_TEXT,
            null
        );

        const textNodes: Node[] = [];
        while (walker.nextNode()) {
            textNodes.push(walker.currentNode);
        }

        for (const node of textNodes) {
            const text = node.textContent || '';
            const textLen = text.length;

            if (currentLength + textLen > maxLength) {
                const remaining = maxLength - currentLength;
                node.textContent = text.substring(0, remaining) + '...';

                let nextNode = node.nextSibling;

                while (nextNode) {
                    const toRemove = nextNode;
                    nextNode = nextNode.nextSibling;
                    toRemove.parentNode?.removeChild(toRemove);
                }
                break;
            }

            currentLength += textLen;
        }

        return div.innerHTML;
    }
}
