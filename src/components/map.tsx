import DeckGL from "@deck.gl/react/typed";
import { MapView } from "@deck.gl/core/typed";
import { IconLayer } from "@deck.gl/layers/typed";
import type { PickingInfo } from "@deck.gl/core/typed";
import * as landmarkData from "../data/landmarks.json";
import { useMemo, useReducer, useState } from "react";
import Profile from "./profile";
import { getLandmarksById } from "../utils/utils";
import ProfilePreview from "./preview";
import { ILandmark, ViewState } from "../utils/types";
import { Wrapper, HoverInfo, CopyrightLicense, Link } from "./map.style";
import { MapController } from "./mapController";
import { tileLayer } from "./TileLayer";
import { INITIAL_VIEW_STATE } from "../utils/constants";

import {
  MapState,
  mapReducer,
  MapActions,
  MapContext,
} from "../utils/mapContext";
import { TopBar } from "./topBar";

const ICON_MAPPING = {
  marker: { x: 0, y: 0, width: 260, height: 280, anchor: 260, mask: true },
};

const INITIAL_MAP_STATE = {
  viewState: INITIAL_VIEW_STATE,
  animationOn: false,
} as MapState;

export const Map = () => {
  const [hoverInfo, setHoverInfo] = useState<PickingInfo>();
  const [openProfile, setOpenProfile] = useState(false);
  const [data, setData] = useState<ILandmark[]>(landmarkData.landmarks);
  const [searchVal, setSearchVal] = useState<string>(""); //track id selected
  const [mapState, dispatch] = useReducer(mapReducer, INITIAL_MAP_STATE);

  const selectedLandmarkId = useMemo(() => {
    const selectedId = landmarkData.landmarks
      .filter((landmark) => landmark.selected)
      .map((l) => l.id);

    return selectedId.length < 1 ? null : selectedId[0];
  }, [data]);

  const handlePinClick = (info: PickingInfo) => {
    if (selectedLandmarkId) {
      const oldLandmark = landmarksById[selectedLandmarkId];
      oldLandmark.selected = false;
      setData((data) => [...data, oldLandmark]);
    }

    setOpenProfile(!openProfile);

    const newLandmark = landmarksById[info.object.id];
    newLandmark.selected = true;

    setData((data) => [...data, newLandmark]);
  };

  // selecting landmark from search bar/dropdown
  const handleSelectLandmark = (id: string) => {
    setSearchVal(id);

    if (selectedLandmarkId) {
      const oldLandmark = landmarksById[selectedLandmarkId];
      oldLandmark.selected = false;
      setData((data) => [...data, oldLandmark]);
    }

    const newLandmark = landmarksById[id];
    newLandmark.selected = true;
    setData((data) => [...data, newLandmark]);

    if (mapState.animationOn) {
      // focus on map at that coordinate
      const coords = landmarksById[id].coordinates;

      dispatch({
        type: MapActions.UPDATE_VIEWSTATE,
        viewState: {
          transitionDuration: 2000,
          latitude: coords[1],
          longitude: coords[0],
          zoom: 10,
          minZoom: 4,
          maxZoom: 12,
          maxPitch: 89,
          bearing: 0,
        },
      });
    }
  };

  const resetCamera = () => {
    setSearchVal("");

    if (selectedLandmarkId) {
      const newLandmark = landmarksById[selectedLandmarkId];
      newLandmark.selected = false;
      setData((data) => [...data, newLandmark]);
    }

    dispatch({
      type: MapActions.UPDATE_VIEWSTATE,
      viewState: {
        ...INITIAL_VIEW_STATE,
        transitionDuration: mapState.animationOn ? 1600 : 1000,
      },
    });
  };

  const handleViewStateChange = (newViewState: ViewState) => {
    dispatch({ type: MapActions.UPDATE_VIEWSTATE, viewState: newViewState });
  };

  const onClose = () => {
    setOpenProfile(false);

    if (selectedLandmarkId) {
      const newLandmark = landmarksById[selectedLandmarkId];
      newLandmark.selected = false;
      setData((data) => [...data, newLandmark]);
    }
  };

  const iconLayer = new IconLayer({
    id: "icon-layer",
    data: data,
    pickable: true,
    iconAtlas: "/StoriesOfOurLand/icons/pin.png",
    iconMapping: ICON_MAPPING,
    getIcon: () => "marker",
    sizeScale: 10,
    getPosition: (d) => d.coordinates,
    getSize: () => 5,
    getColor: (d) => (d.selected ? [210, 77, 87] : [90, 34, 139]),
    onHover: (info) => setHoverInfo(info),
    highlightColor: [210, 77, 87],
    onClick: (info) => handlePinClick(info),
  });

  const landmarksById = getLandmarksById(landmarkData.landmarks);

  const selectedLandmark = useMemo(() => {
    return landmarksById[selectedLandmarkId ?? 0] ?? {};
  }, [selectedLandmarkId]);

  return (
    <Wrapper>
      <DeckGL
        layers={[tileLayer, iconLayer]}
        views={new MapView({ repeat: true })}
        initialViewState={mapState.viewState}
        controller={true}
        onViewStateChange={({ viewState }) =>
          handleViewStateChange(viewState as ViewState)
        }
      >
        <TopBar
          resetCameraHandler={resetCamera}
          selectLandmarkHandler={handleSelectLandmark}
          searchVal={searchVal}
        />
        <Profile
          landmark={selectedLandmark}
          active={openProfile}
          onClose={onClose}
        />

        {hoverInfo?.object && (
          <HoverInfo
            style={{
              position: "absolute",
              left: hoverInfo.x,
              top: hoverInfo.y,
            }}
          >
            <ProfilePreview landmark={hoverInfo.object} />
          </HoverInfo>
        )}

        <MapContext.Provider value={{ state: mapState, dispatch: dispatch }}>
          <MapController />
        </MapContext.Provider>

        <CopyrightLicense>
          {"© "}
          <Link href="http://www.openstreetmap.org/copyright" target="blank">
            OpenStreetMap contributors
          </Link>
        </CopyrightLicense>
      </DeckGL>
    </Wrapper>
  );
};
