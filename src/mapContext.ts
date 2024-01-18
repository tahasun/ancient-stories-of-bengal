import { createContext } from "react";
import { ViewState } from "./types";

export enum MapActions {
    TOGGLE_ANIMATION = "toggleAnimation",
    HOME_PRESSED = "homePressed",
    UPDATE_VIEWSTATE = "updateViewState",
  }

export interface MapState {
    viewState: ViewState;
    animationOn: boolean;
}

export type UpdateMapAction = { type: MapActions; viewState: ViewState };

export type ContextType = {
    state: MapState;
    dispatch: React.Dispatch<Action>;
  };

export const mapReducer = (mapState: MapState, action: UpdateMapAction): MapState => {
  switch (action.type) {
    case MapActions.TOGGLE_ANIMATION:
      const prevAnimationState = mapState.animationOn;
      return { ...mapState, animationOn: !prevAnimationState };
    case MapActions.UPDATE_VIEWSTATE:
      return {
        ...mapState,
        viewState: action.viewState,
      };
    case MapActions.HOME_PRESSED:
      // throw Error("Unimplemented action: " + action.type);
      return mapState;
    default:
      // throw Error("Unknown action: " + action.type);
      return mapState;
  }
};

export const MapContext = createContext<ContextType | undefined>(undefined);
