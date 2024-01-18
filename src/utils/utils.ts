import { ILandmark } from "./types";

// given an array of objects, create an obj id: landmark obj
export const getLandmarksById = (data: ILandmark[]): { [id: string]: ILandmark } => {
    return data.reduce((acc, cur) => {
      acc[cur.id] = cur;
      return acc;
    }, {} as { [id: string]: ILandmark });
  };
  
export const getYear = (year: string): string => {
    if (Number(year) < 0) {
      return `${year} BCE`;
    } else {
      return `${year} CE`;
    }
  };
  