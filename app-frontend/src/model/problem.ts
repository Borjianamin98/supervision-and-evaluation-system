export interface Problem {
    education: string,

    title: string,
    englishTitle: string,
    keywords: string[],

    supervisor?: string,

    definition: string,
    history?: string,
    considerations?: string
}