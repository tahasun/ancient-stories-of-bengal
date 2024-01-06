import DeckGL from "@deck.gl/react/typed";
import { MapView } from "@deck.gl/core/typed";
import { TileLayer } from "@deck.gl/geo-layers/typed";
import { BitmapLayer, IconLayer } from "@deck.gl/layers/typed";
import styled from "styled-components";
import type { PickingInfo } from "@deck.gl/core/typed";
import * as landmarkData from "./landmarks.json";
import { useState } from "react";
import { Drawer } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Carousel } from "antd";
import Gallery from "./components/gallery";

const contentStyle: React.CSSProperties = {
  height: "40vh",
  color: "#fff",
  lineHeight: "40vh",
  textAlign: "center",
  background: "#364d79",
};

const ICON_MAPPING = {
  marker: { x: 0, y: 0, width: 128, height: 500, anchor: 128, mask: true },
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

const HoverInfo = styled.div<{ $position: { x: number; y: number } }>`
  position: absolute,
  z-index: 1,
  pointerEvents: none,
  left: ${(props) => props.$position.x};
  top: ${(props) => props.$position.y};
`;

// Viewport settings
const INITIAL_VIEW_STATE = {
  latitude: 24.961111,
  longitude: 92.342778,
  zoom: 6,
  maxZoom: 20,
  maxPitch: 89,
  bearing: 0,
};

interface ILandmark {
  id: string;
  name: string;
  bengaliName?: string;
  alternateName?: string;
  period?: string;
  location?: string;
  description?: string;
  images?: string[];
  cordinates: number[];
  timeStart: string;
  timeEnd: string;
}

const CustomerDrawer = styled(Drawer)`
  .customer-drawer-header {
    // width: 70vw;
    // background: yellow;
    // border-radius: 20px;
    padding: 2vh 1vw;
  }
`;

// given an array of objects, create an obj id: landmark obj
const getLandmarksById = (data: ILandmark[]): { [id: string]: ILandmark } => {
  return data.reduce((acc, cur) => {
    acc[cur.id] = cur;
    return acc;
  }, {} as { [id: string]: ILandmark });
};

// DeckGL react component
export const Map = () => {
  const [hoverInfo, setHoverInfo] = useState<PickingInfo>();
  const [open, setOpen] = useState(false);
  //track selected landmark Id
  const [selectedLandmardId, setSelectedLandmarkId] = useState<string>("0");

  const onChange = (currentSlide: number) => {
    console.log(currentSlide);
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const tileLayer = new TileLayer({
    // https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Tile_servers
    data: [
      "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
      "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
      "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
    ],
    maxRequests: 20,

    pickable: true,
    onViewportLoad: null,
    autoHighlight: false,
    highlightColor: [60, 60, 60, 40],
    // https://wiki.openstreetmap.org/wiki/Zoom_levels
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

  const handleOnClick = (info: PickingInfo, event: Event) => {
    setSelectedLandmarkId(info.object.id);
    setOpen(!open);
  };

  const iconLayer = new IconLayer({
    id: "icon-layer",
    // data: "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-stations.json",

    data: landmarkData.landmarks,
    pickable: true,
    // icon styling
    iconAtlas:
      "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png",
    iconMapping: ICON_MAPPING,
    // icon data
    getIcon: (d) => "marker",
    sizeScale: 30,
    // sizeMinPixels: 100,
    // sizeUnits: "meters",
    getPosition: (d) => d.coordinates,
    getSize: (d) => 5,
    getColor: (d) => [120, 140, 0],
    onHover: (info) => setHoverInfo(info),
    onClick: (info, event) => handleOnClick(info, event),
  });

  const landmarksById = getLandmarksById(landmarkData.landmarks);

  return (
    <DeckGL
      layers={[tileLayer, iconLayer]}
      views={new MapView({ repeat: true })}
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
    >
      <CopyrightLicense>
        {"© "}
        <Link href="http://www.openstreetmap.org/copyright" target="blank">
          OpenStreetMap contributors
        </Link>
      </CopyrightLicense>
      <CustomerDrawer
        title={landmarksById[selectedLandmardId]?.name}
        placement="right"
        onClose={onClose}
        open={open}
        className="custom-drawer-content"
        closeIcon={
          <ArrowLeftOutlined style={{ padding: "0px", fontSize: "22px" }} />
        }
        classNames={{ header: "customer-drawer-header" }}
      >
        {/* <p>{landmarksById[selectedLandmardId]?.name}</p> */}
        <Gallery
          images={landmarksById[selectedLandmardId]?.images ?? ["", "", "", ""]}
        />
        <p>Some contents...</p>
        <p>Some contents...</p>
      </CustomerDrawer>
      {hoverInfo?.object && (
        <HoverInfo $position={{ x: hoverInfo.x, y: hoverInfo.y }}>
          {hoverInfo.object.name}
        </HoverInfo>
      )}
    </DeckGL>
  );
};
