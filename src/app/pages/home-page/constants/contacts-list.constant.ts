import { IIconsLinks } from '../models/IIconsLinks';
import { IconMailComponent } from '@icons/icon-mail/icon-mail.component';
import { IconTelegramComponent } from '@icons/icon-telegram/icon-telegram.component';
import { IconGithubComponent } from '@icons/icon-github/icon-github.component';
import { IconInstagramComponent } from '@icons/icon-instagram/icon-instagram.component';
import { IconLinkedinComponent } from '@icons/icon-linkedin/icon-linkedin.component';

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
        alt: 'LinkedIn',
        link: 'https://www.linkedin.com/in/stanislav-stolbennikov-a95226228',
        icon: IconLinkedinComponent,
    },
    {
        alt: 'Instagram',
        link: 'https://www.instagram.com/sse.public/',
        icon: IconInstagramComponent,
    },
] as const;
