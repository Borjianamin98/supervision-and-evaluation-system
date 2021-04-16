export interface Problem {
    education: string,

    title: string,
    englishTitle: string,
    keywords: string[],

    definition: string,
    history?: string,
    considerations?: string

    supervisor?: string,
}