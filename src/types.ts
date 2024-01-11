
export interface IImage {
    src: string;
    attribution: string;
    link: string;
}
  
export interface ILandmark {
    id: string;
    name: string;
    bengaliName?: string;
    alternateName?: string;
    period?: string;
    location?: string;
    description?: string;
    attribution?: string;
    images?: IImage[];
    coordinates: number[];
    timeStart: string;
    timeEnd: string;
}