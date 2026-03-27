import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import hljs from 'highlight.js';

const renderer = new marked.Renderer();

renderer.code = ({ text, lang }) => {
    const language = lang && hljs.getLanguage(lang) ? lang : '';
    const highlighted = language
        ? hljs.highlight(text, { language, ignoreIllegals: true }).value
        : hljs.highlightAuto(text).value;

    return `<pre><code class="hljs language-${language || 'plaintext'} bc-scroll">${highlighted}</code></pre>`;
};

marked.setOptions({ renderer });

@Pipe({
    name: 'markdown',
})
export class MarkdownPipe implements PipeTransform {
    private readonly sanitizer = inject(DomSanitizer);

    transform(value: string | null): SafeHtml {
        if (!value) {
            return '';
        }

        const html = marked.parse(value, { async: false }) as string;
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }
}
