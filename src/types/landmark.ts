import {Image} from './image';

export interface Landmark {
    id: string;
    name: string;
    alternateName?: string;
    period?: string;
    location?: string;
    historicLocation?: string;
    description?: string;
    attribution?: string;
    images: Image[];
    coordinates: number[];
    timeStart: string;
    timeEnd: string;
    selected: boolean;
}
