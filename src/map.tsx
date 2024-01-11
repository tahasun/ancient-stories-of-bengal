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

// DeckGL react component
export const Map = () => {
  const [hoverInfo, setHoverInfo] = useState<PickingInfo>();
  const [open, setOpen] = useState(false);
  //track selected landmark Id
  const [selectedLandmarkId, setSelectedLandmarkId] = useState<string>("0");

  const onClose = () => {
    setOpen(false);
  };

  const tileLayer = new TileLayer({
    data: [
      "https://a.tile.openstreetmap.org/osm-bright/{z}/{x}/{y}.png",
      "https://b.tile.openstreetmap.org/osm-bright/{z}/{x}/{y}.png",
      "https://c.tile.openstreetmap.org/osm-bright/{z}/{x}/{y}.png",
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
    data: landmarkData.landmarks,
    pickable: true,
    // ittcon styling
    // iconAtlas:
    //   "hps://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png",
    iconAtlas: "/icons/pin.png",
    iconMapping: ICON_MAPPING,
    // icon data
    getIcon: (d) => "marker",
    sizeScale: 10,
    // sizeMinPixels: 100,
    // sizeUnits: "meters",
    getPosition: (d) => d.coordinates,
    getSize: (d) => 5,
    getColor: (d) => [90, 34, 139],
    onHover: (info) => setHoverInfo(info),
    onClick: (info, event) => handleOnClick(info, event),
  });

  const landmarksById = getLandmarksById(landmarkData.landmarks);

  const selectedLandmark = useMemo(() => {
    return landmarksById[selectedLandmarkId] ?? {};
  }, [selectedLandmarkId]);

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
      <Profile landmark={selectedLandmark} active={open} onClose={onClose} />
      {hoverInfo?.object && (
        <HoverInfo $position={{ x: hoverInfo.x, y: hoverInfo.y }}>
          {hoverInfo.object.name}
        </HoverInfo>
      )}
    </DeckGL>
  );
};
