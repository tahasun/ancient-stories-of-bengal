import DeckGL from "@deck.gl/react/typed";
import { MapView } from "@deck.gl/core/typed";
import { IconLayer } from "@deck.gl/layers/typed";
import type { PickingInfo } from "@deck.gl/core/typed";
import * as landmarkData from "./landmarks.json";
import { useMemo, useReducer, useState } from "react";
import Profile from "./components/profile";
import { getLandmarksById } from "./utils";
import ProfilePreview from "./components/preview";
import { ILandmark, ViewState } from "./types";
import {
  Wrapper,
  HoverInfo,
  CopyrightLicense,
  Link,
  CircularWrapper,
  TopBar,
} from "./map.style";
import { MapController } from "./components/mapController";
import { tileLayer } from "./TileLayer";
import { INITIAL_VIEW_STATE } from "./constants";
import { HomeFilled } from "@ant-design/icons";
import { Select } from "antd";
import { MapState, mapReducer, MapActions, MapContext } from "./mapContext";

const ICON_MAPPING = {
  marker: { x: 0, y: 0, width: 260, height: 280, anchor: 260, mask: true },
};

const INITIAL_MAP_STATE = {
  viewState: INITIAL_VIEW_STATE,
  animationOn: false,
} as MapState;

// DeckGL react component
export const Map = () => {
  const [hoverInfo, setHoverInfo] = useState<PickingInfo>();
  const [openProfile, setOpenProfile] = useState(false);
  const [selectedLandmarkId, setSelectedLandmarkId] = useState<string | null>(
    null
  );
  const [data, setData] = useState<ILandmark[]>(landmarkData.landmarks);
  const [searchVal, setSearchVal] = useState<string>(""); //track id selected
  const [mapState, dispatch] = useReducer(mapReducer, INITIAL_MAP_STATE);

  const onClose = () => {
    setOpenProfile(false);

    if (selectedLandmarkId) {
      const newLandmark = landmarksById[selectedLandmarkId];
      newLandmark.selected = false;
      setData((data) => [...data, newLandmark]);
    }
  };

  const handleViewStateChange = (newViewState: ViewState) => {
    dispatch({ type: MapActions.UPDATE_VIEWSTATE, viewState: newViewState });
  };

  const handleOnClick = (info: PickingInfo) => {
    if (selectedLandmarkId) {
      const oldLandmark = landmarksById[selectedLandmarkId];
      oldLandmark.selected = false;
      setData((data) => [...data, oldLandmark]);
    }

    setSelectedLandmarkId(info.object.id);
    setOpenProfile(!openProfile);

    const newLandmark = landmarksById[info.object.id];
    newLandmark.selected = true;

    setData((data) => [...data, newLandmark]);
  };

  const handleSelectLandmark = (id: string) => {
    setSearchVal(id);

    if (selectedLandmarkId) {
      const oldLandmark = landmarksById[selectedLandmarkId];
      oldLandmark.selected = false;
      setData((data) => [...data, oldLandmark]);
    }

    setSelectedLandmarkId(id);

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

  const iconLayer = new IconLayer({
    id: "icon-layer",
    data: data,
    pickable: true,
    iconAtlas: "/icons/pin.png",
    iconMapping: ICON_MAPPING,
    getIcon: (d) => "marker",
    sizeScale: 10,
    getPosition: (d) => d.coordinates,
    getSize: (d) => 5,
    getColor: (d) => (d.selected ? [210, 77, 87] : [90, 34, 139]),
    onHover: (info) => setHoverInfo(info),
    highlightColor: [210, 77, 87],
    onClick: (info) => handleOnClick(info),
  });

  const landmarksById = getLandmarksById(landmarkData.landmarks);

  const selectedLandmark = useMemo(() => {
    return landmarksById[selectedLandmarkId ?? 0] ?? {};
  }, [selectedLandmarkId]);

  const landmarkOptions = landmarkData.landmarks.map((landmark) => {
    return { value: landmark.id, label: landmark.name };
  });

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
        <TopBar>
          <CircularWrapper>
            <HomeFilled onClick={() => resetCamera()} />
          </CircularWrapper>

          <Select
            showSearch
            style={{ width: 600 }}
            placeholder="Search for a landmark..."
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            options={landmarkOptions}
            onSelect={(val) => handleSelectLandmark(val)}
            value={searchVal}
          />
        </TopBar>
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
