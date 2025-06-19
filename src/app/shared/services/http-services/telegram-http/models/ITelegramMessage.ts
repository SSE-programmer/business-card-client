import { Api } from 'telegram';

export interface ITelegramMessage {
    className: 'TelegramMessage';
    id: number;
    groupedId: BigInteger | undefined;
    date: number;
    text: string | null;
    media: IMedia[] | null;
    views: number | null;
    forwards: number | null;
    replies: {
        count: number;
        recentRepliers: Api.TypePeer[] | null;
    } | null;
    reactions: Api.TypeReactionCount[] | undefined;
    isServiceMessage: boolean;
    serviceAction?: string;
    mainMessage?: boolean;
}

export interface ITelegramMessageGroup {
    className: 'TelegramMessageGroup';
    groupedId: string;
    date: number;
    messages: ITelegramMessage[];
}

export interface IMedia {
    type: string;
    photoUrl?: string | null;
    message?: string;
}

export function isTelegramMessage(value: unknown): value is ITelegramMessage {
    return Boolean(typeof value === 'object' && value && 'className' in value && value.className === 'TelegramMessage');
}

export function isTelegramMessageGroup(value: unknown): value is ITelegramMessageGroup {
    return Boolean(typeof value === 'object' && value && 'className' in value && value.className === 'TelegramMessageGroup');
}
