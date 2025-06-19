export interface IJobExperience {
    company: string;
    positions: IPosition[];
}

export interface IPosition {
    title: string;
    startDate: Date;
    endDate?: Date;
    isFullTime: boolean;
    projects: string[];
    techStack: string[];
    achievements?: string[];
    description: string;
}
