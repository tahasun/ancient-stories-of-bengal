import DeckGL from "@deck.gl/react/typed";
import { MapView } from "@deck.gl/core/typed";
import { TileLayer } from "@deck.gl/geo-layers/typed";
import { BitmapLayer, IconLayer } from "@deck.gl/layers/typed";
import styled from "styled-components";
import type { PickingInfo } from "@deck.gl/core/typed";
import * as landmarkData from "./landmarks.json";
import { useMemo, useState } from "react";
import Profile from "./components/profile";
import { getLandmarksById } from "./utils";
import {
  ExclamationCircleFilled,
  HomeFilled,
  MinusCircleFilled,
  PlayCircleFilled,
  PlusCircleFilled,
} from "@ant-design/icons";
import ProfilePreview from "./components/preview";
import { Modal, Select } from "antd";
import { ILandmark } from "./types";

// todo:
// X select landmark pin
// X camera controlls: zoom in out buttons
// add location data to all landmarks obj
// on clicking home, remove the search bar term
// allow searching with lower letters
// X transition toggle

const MIN_ZOOM_LEVEL = 5;
const MAX_ZOOM_LEVEL = 12;

const contentStyle: React.CSSProperties = {
  height: "40vh",
  color: "#fff",
  lineHeight: "40vh",
  textAlign: "center",
  background: "#364d79",
};

const ICON_MAPPING = {
  marker: { x: 0, y: 0, width: 260, height: 280, anchor: 260, mask: true },
};

const CopyrightLicense = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  backgroundcolor: hsla(0, 0%, 100%, 0.5);
  padding: 0 5px;
  font: 12px/20px Helvetica Neue, Arial, Helvetica, sans-serif;
`;

const Link = styled.a`
  textdecoration: none;
  color: rgba(0, 0, 0, 0.75);
  cursor: grab;
`;

const HoverInfo = styled.div`
  cursor: pointer;
`;

const Disclaimer = styled.div`
  position: absolute;
  right: 2vw;
  bottom: 5vh;
  cursor: pointer;
  font-size: 26px;
  font-style: bolder;
  color: #0096ff;
`;

const ZoomPlus = styled.div`
  position: absolute;
  right: 2vw;
  bottom: 16vh;
  cursor: pointer;
  font-size: 26px;
  font-style: bolder;
  color: #0096ff;
`;

const ZoomMinus = styled.div`
  position: absolute;
  right: 2vw;
  bottom: 10.5vh;
  cursor: pointer;
  font-size: 26px;
  font-style: bolder;
  color: #0096ff;
`;

const PlayAnimation = styled.div<{ $active: boolean }>`
  position: absolute;
  right: 2vw;
  bottom: 21.5vh;
  cursor: pointer;
  font-size: 26px;
  font-style: bolder;
  color: ${(props) => (props.$active ? "#0096ff" : "rgba(0,0,0,0.3)")};
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

// Viewport settings
const INITIAL_VIEW_STATE = {
  latitude: 23.961111,
  longitude: 90.342778,
  zoom: 6,
  minZoom: 4,
  maxZoom: 12,
  maxPitch: 89,
  bearing: 0,
};

const TopBar = styled.div`
  position: absolute;
  left: 26vw;
  top: 4vh;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const CircularWrapper = styled.div`
  border-radius: 50%;
  width: 20px;
  height: 20px;
  background-color: #0096ff;
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px;
  margin: 0 10px;
`;
// DeckGL react component
export const Map = () => {
  const [hoverInfo, setHoverInfo] = useState<PickingInfo>();
  const [openProfile, setOpenProfile] = useState(false);
  const [selectedLandmarkId, setSelectedLandmarkId] = useState<string>("0");
  const [animationOn, setAnimation] = useState<boolean>(false);
  const [data, setData] = useState<ILandmark[]>(landmarkData.landmarks);

  const onClose = () => {
    setOpenProfile(false);

    const newLandmark = landmarksById[selectedLandmarkId];
    newLandmark.selected = false;
    setData((data) => [...data, newLandmark]);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleZoomPlus = () => {
    setViewState((prevViewState) => ({
      ...prevViewState,
      zoom:
        prevViewState.zoom + 1 > MAX_ZOOM_LEVEL
          ? MAX_ZOOM_LEVEL
          : prevViewState.zoom + 1,
    }));
  };

  const handleZoomMinus = () => {
    setViewState((prevViewState) => ({
      ...prevViewState,
      zoom:
        prevViewState.zoom - 1 < MIN_ZOOM_LEVEL
          ? MIN_ZOOM_LEVEL
          : prevViewState.zoom - 1,
    }));
  };

  const tileLayer = new TileLayer({
    data: [
      "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
      "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
      "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
    ],
    maxRequests: 20,
    pickable: true,
    onViewportLoad: null,
    autoHighlight: false,
    highlightColor: [60, 60, 60, 40],
    minZoom: 0,
    maxZoom: 19,
    tileSize: 256,
    zoomOffset: devicePixelRatio === 1 ? -1 : 0,
    renderSubLayers: (props) => {
      const west = props.tile.boundingBox[0][0];
      const south = props.tile.boundingBox[0][1];
      const east = props.tile.boundingBox[1][0];
      const north = props.tile.boundingBox[1][1];

      return [
        new BitmapLayer(props, {
          data: undefined,
          image: props.data,
          bounds: [west, south, east, north],
        }),
      ];
    },
  });

  const handleOnClick = (info: PickingInfo) => {
    setSelectedLandmarkId(info.object.id);
    setOpenProfile(!openProfile);

    const newLandmark = landmarksById[info.object.id];
    newLandmark.selected = true;
    setData((data) => [...data, newLandmark]);
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
    return landmarksById[selectedLandmarkId] ?? {};
  }, [selectedLandmarkId]);

  const landmarkOptions = landmarkData.landmarks.map((landmark) => {
    return { value: landmark.id, label: landmark.name };
  });

  const handleSelectLandmark = (id: string) => {
    setSelectedLandmarkId(id);

    const newLandmark = landmarksById[id];
    newLandmark.selected = true;
    setData((data) => [...data, newLandmark]);
    // setOpenProfile(true);
    // focus on map at that coordinate
    const coords = landmarksById[id].coordinates;

    if (animationOn) {
      setViewState({
        transitionDuration: 2000,
        latitude: coords[1],
        longitude: coords[0],
        zoom: 10,
        minZoom: 4,
        maxZoom: 12,
        maxPitch: 89,
        bearing: 0,
      });
    }
  };

  const resetCamera = () => {
    const newLandmark = landmarksById[selectedLandmarkId];
    newLandmark.selected = false;
    setData((data) => [...data, newLandmark]);

    setViewState(() => ({
      ...INITIAL_VIEW_STATE,
      transitionDuration: animationOn ? 1600 : 1000,
    }));
  };

  type ViewState = {
    transitionDuration?: number;
    latitude: number;
    longitude: number;
    zoom: number;
    minZoom: number;
    maxZoom: number;
    maxPitch: number;
    bearing: number;
  };
  const [viewState, setViewState] = useState<ViewState>(INITIAL_VIEW_STATE);

  const handleViewStateChange = (viewState: ViewState) => {
    if (viewState.zoom > MIN_ZOOM_LEVEL && viewState.zoom < MAX_ZOOM_LEVEL) {
      setViewState(viewState);
    }
  };

  return (
    <Wrapper>
      <DeckGL
        layers={[tileLayer, iconLayer]}
        views={new MapView({ repeat: true })}
        initialViewState={viewState}
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
              (option?.label ?? "").includes(input)
            }
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            options={landmarkOptions}
            onSelect={(val) => handleSelectLandmark(val)}
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

        <Disclaimer>
          <ExclamationCircleFilled onClick={() => setIsModalOpen(true)} />
        </Disclaimer>

        <ZoomPlus title="zoom in">
          <PlusCircleFilled onClick={() => handleZoomPlus()} />
        </ZoomPlus>

        <ZoomMinus title="zoom out">
          <MinusCircleFilled onClick={() => handleZoomMinus()} />
        </ZoomMinus>

        <PlayAnimation
          $active={animationOn}
          onClick={() => setAnimation(!animationOn)}
        >
          <PlayCircleFilled
            title="toggle animation"
            onClick={() => handleZoomMinus()}
          />
        </PlayAnimation>

        <CopyrightLicense>
          {"© "}
          <Link href="http://www.openstreetmap.org/copyright" target="blank">
            OpenStreetMap contributors
          </Link>
        </CopyrightLicense>
        <Modal
          title="Disclaimer"
          open={isModalOpen}
          footer={null}
          onCancel={handleCancel}
        >
          <p>
            The text content on this website is generated by AI, and users
            should be mindful of its limitations. Articles and papers used for
            the text content are provided with links for further readings.
            Images are credited with links to their owners. This site is a work
            in progress, seeking contributors.
          </p>
          <p> Author: Tahasun Tarannum</p>
        </Modal>
      </DeckGL>
    </Wrapper>
  );
};
