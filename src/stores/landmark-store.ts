import { makeObservable, observable } from "mobx";
import * as EngLandmarks from '../data/landmarks-en.json';
import * as BangLandmarks from '../data/langmarks-bn.json';
import { Landmark } from '../types';
import { getLandmarksById } from "../utils/utils";

class LandmarkStore {
    landmarks: Record<string, Landmark[]> = {};
    
    constructor(landmarks: Record<string, Landmark[]>) {
        this.landmarks = landmarks;
        makeObservable(this, {
            landmarks: observable,
        })
    }

    getLandmarks(langCode: string) {
        return this.landmarks[langCode];
    }

    getLandmarksById(langCode: string) {
        return getLandmarksById(this.landmarks[langCode])
    }
}

export const landmarkStore = new LandmarkStore({'en': EngLandmarks.landmarks, 'bn': BangLandmarks.landmarks});