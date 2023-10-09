import DeckGL from "@deck.gl/react/typed";
import { MapView } from "@deck.gl/core/typed";
import { TileLayer } from "@deck.gl/geo-layers/typed";
import { BitmapLayer, IconLayer } from "@deck.gl/layers/typed";
import styled from "styled-components";
import type { PickingInfo } from "@deck.gl/core/typed";
import * as landmarkData from "./landmarks.json";
import { useState } from "react";

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

// Viewport settings
const INITIAL_VIEW_STATE = {
  //   latitude: 24.961111,
  //   longitude: 89.342778,
  //   zoom: 8,
  //   maxZoom: 20,
  //   maxPitch: 89,
  //   bearing: 0,
  longitude: -122.4,
  latitude: 37.74,
  zoom: 11,
  maxZoom: 20,
  pitch: 30,
  bearing: 0,
};

// DeckGL react component
export const Map = () => {
  const [hoverInfo, setHoverInfo] = useState<PickingInfo>();

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

  const iconLayer = new IconLayer({
    id: "icon-layer",
    // landmarkData,
    data: "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-stations.json",
    pickable: true,
    iconAtlas:
      "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png",
    iconMapping: ICON_MAPPING,
    getIcon: (d) => "marker",
    sizeScale: 26,
    getPosition: (d) => d.coordinates,
    getSize: (d) => 5,
    getColor: (d) => [120, 140, 0],
    onHover: (info) => setHoverInfo(info),
  });
  console.log(hoverInfo, "hovering....");
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
      {hoverInfo?.object && (
        <div
          style={{
            position: "absolute",
            zIndex: 1,
            pointerEvents: "none",
            left: hoverInfo.x,
            top: hoverInfo.y,
          }}
        >
          {hoverInfo.object.address}
        </div>
      )}
    </DeckGL>
  );
};
