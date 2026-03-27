export enum EProjectCategory {
    Commercial = 'commercial',
    Pet = 'pet',
    Challenge = 'challenge',
}

export interface IProjectCategory {
    type: EProjectCategory;
    title: string;
}

export interface IProjectPeriod {
    from: string;
    to?: string;
}

export interface IProject {
    id: string;
    title: string;
    category: EProjectCategory;
    description: string;
    stack: string[];
    period?: IProjectPeriod;
    previewImage?: string;
    images?: string[];
    contentPath: string;
}
