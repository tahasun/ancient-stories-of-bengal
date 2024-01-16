import DeckGL from "@deck.gl/react/typed";
import { MapView } from "@deck.gl/core/typed";
import { TileLayer } from "@deck.gl/geo-layers/typed";
import { BitmapLayer, IconLayer } from "@deck.gl/layers/typed";
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
import {
  Wrapper,
  HoverInfo,
  ControlWrapper,
  PlayAnimation,
  CopyrightLicense,
  Link,
  CircularWrapper,
  TopBar,
} from "./map.style";

const MIN_ZOOM_LEVEL = 5;
const MAX_ZOOM_LEVEL = 12;

const ICON_MAPPING = {
  marker: { x: 0, y: 0, width: 260, height: 280, anchor: 260, mask: true },
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

// DeckGL react component
export const Map = () => {
  const [hoverInfo, setHoverInfo] = useState<PickingInfo>();
  const [openProfile, setOpenProfile] = useState(false);
  const [selectedLandmarkId, setSelectedLandmarkId] = useState<string | null>(
    null
  );
  const [animationOn, setAnimation] = useState<boolean>(false);
  const [data, setData] = useState<ILandmark[]>(landmarkData.landmarks);
  const [searchVal, setSearchVal] = useState<string>(""); //track id selected
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewState, setViewState] = useState<ViewState>(INITIAL_VIEW_STATE);

  const onClose = () => {
    setOpenProfile(false);

    if (selectedLandmarkId) {
      const newLandmark = landmarksById[selectedLandmarkId];
      newLandmark.selected = false;
      setData((data) => [...data, newLandmark]);
    }
  };

  const handleViewStateChange = (viewState: ViewState) => {
    if (viewState.zoom > MIN_ZOOM_LEVEL && viewState.zoom < MAX_ZOOM_LEVEL) {
      setViewState(viewState);
    }
  };

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

    if (animationOn) {
      // focus on map at that coordinate
      const coords = landmarksById[id].coordinates;

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
    setSearchVal("");

    if (selectedLandmarkId) {
      const newLandmark = landmarksById[selectedLandmarkId];
      newLandmark.selected = false;
      setData((data) => [...data, newLandmark]);
    }

    setViewState(() => ({
      ...INITIAL_VIEW_STATE,
      transitionDuration: animationOn ? 1600 : 1000,
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

        <ControlWrapper>
          <PlayAnimation
            $active={animationOn}
            onClick={() => setAnimation(!animationOn)}
          >
            <PlayCircleFilled
              title="toggle animation"
              onClick={() => handleZoomMinus()}
            />
          </PlayAnimation>

          <PlusCircleFilled title="zoom in" onClick={() => handleZoomPlus()} />

          <MinusCircleFilled
            title="zoom out"
            onClick={() => handleZoomMinus()}
          />

          <ExclamationCircleFilled onClick={() => setIsModalOpen(true)} />
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
              Images are credited with links to their owners. This site is a
              work in progress, seeking contributors.
            </p>
            <p> Author: Tahasun Tarannum</p>
          </Modal>
        </ControlWrapper>

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
