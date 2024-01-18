
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
    "historic-location"?: string;
    description?: string;
    attribution?: string;
    images: IImage[];
    coordinates: number[];
    timeStart: string;
    timeEnd: string;
    selected: boolean;
}

export type ViewState = {
    transitionDuration?: number;
    latitude: number;
    longitude: number;
    zoom: number;
    minZoom: number;
    maxZoom: number;
    maxPitch: number;
    bearing: number;
  };``