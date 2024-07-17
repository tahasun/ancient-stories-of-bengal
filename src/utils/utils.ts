import { Landmark } from "../types";

// given an array of objects, create an obj id: landmark obj
export const getLandmarksById = (data: Landmark[]): { [id: string]: Landmark } => {
    return data.reduce((acc, cur) => {
      acc[cur.id] = cur;
      return acc;
    }, {} as { [id: string]: Landmark });
  };
  
export const getYear = (year: string): string => {
    if (Number(year) < 0) {
      return `${year} BCE`;
    } else {
      return `${year} CE`;
    }
  };
  