import {
  PlayCircleFilled,
  PlusCircleFilled,
  MinusCircleFilled,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { Modal } from "antd";
import { useState } from "react";
import { MAX_ZOOM_LEVEL, MIN_ZOOM_LEVEL } from "../utils/constants";
import { ControlWrapper, PlayAnimation } from "./map.style";
import { useContext } from "react";
import { MapActions, MapContext } from "../utils/mapContext";
import { useTranslation } from "react-i18next";

export const MapController = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const context = useContext(MapContext);
  const { t } = useTranslation();

  if (!context) {
    throw new Error("MapController must be used within a MapContext.Provider");
  }

  const { state, dispatch } = context;

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleZoomMinus = () => {
    const prevViewState = state.viewState;
    const newZoomVal =
      prevViewState.zoom - 1 < MIN_ZOOM_LEVEL
        ? MIN_ZOOM_LEVEL
        : prevViewState.zoom - 1;

    dispatch({
      type: MapActions.UPDATE_VIEWSTATE,
      viewState: { ...prevViewState, zoom: newZoomVal },
    });
  };

  const handleZoomPlus = () => {
    const prevViewState = state.viewState;
    const newZoomVal =
      prevViewState.zoom + 1 > MAX_ZOOM_LEVEL
        ? MAX_ZOOM_LEVEL
        : prevViewState.zoom + 1;

    dispatch({
      type: MapActions.UPDATE_VIEWSTATE,
      viewState: { ...prevViewState, zoom: newZoomVal },
    });
  };

  const handleAnimationToggle = () => {
    dispatch({
      type: MapActions.TOGGLE_ANIMATION,
      viewState: { ...state.viewState },
    });
  };

  return (
    <ControlWrapper>
      <PlayAnimation
        $active={state.animationOn}
        onClick={() => handleAnimationToggle()}
      >
        <PlayCircleFilled
          title="toggle animation"
          onClick={() => handleZoomMinus()}
        />
      </PlayAnimation>

      <PlusCircleFilled title="zoom in" onClick={() => handleZoomPlus()} />

      <MinusCircleFilled title="zoom out" onClick={() => handleZoomMinus()} />

      <ExclamationCircleFilled onClick={() => setIsModalOpen(true)} />
      <Modal
        title="Disclaimer"
        open={isModalOpen}
        footer={null}
        onCancel={handleCancel}
      >
        <p>{t("disclaimer.content")}</p>
        <p>{t("disclaimer.credits")}</p>
      </Modal>
    </ControlWrapper>
  );
};
