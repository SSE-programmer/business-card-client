import { IIconsLinks } from '../models/IIconsLinks';
import { IconMailComponent } from '@components/icons/icon-mail/icon-mail.component';
import { IconTelegramComponent } from '@components/icons/icon-telegram/icon-telegram.component';
import { IconGithubComponent } from '@components/icons/icon-github/icon-github.component';
import { IconInstagramComponent } from '@components/icons/icon-instagram/icon-instagram.component';

export const CONTACTS_LIST: IIconsLinks[] = [
    {
        alt: 'Email',
        link: 'mailto:sstolbennikov@gmail.com',
        icon: IconMailComponent,
    },
    {
        alt: 'Telegram',
        link: 'https://t.me/sse_programmer',
        icon: IconTelegramComponent,
    },
    {
        alt: 'Github',
        link: 'https://github.com/SSE-programmer',
        icon: IconGithubComponent,
    },
    {
        alt: 'Instagram',
        link: 'https://www.instagram.com/sse.public/',
        icon: IconInstagramComponent,
    },
] as const;
