import DeckGL from "@deck.gl/react/typed";
import { MapView } from "@deck.gl/core/typed";
import { TileLayer } from "@deck.gl/geo-layers/typed";
import { BitmapLayer } from "@deck.gl/layers/typed";
import styled from "styled-components";

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
  latitude: 24.961111,
  longitude: 89.342778,
  zoom: 8,
  maxZoom: 20,
  maxPitch: 89,
  bearing: 0,
};

// DeckGL react component
export const Map = () => {
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

      console.log(props.tile.boundingBox);

      return [
        new BitmapLayer(props, {
          data: undefined,
          image: props.data,
          bounds: [west, south, east, north],
        }),
      ];
    },
  });

  return (
    <DeckGL
      layers={[tileLayer]}
      views={new MapView({ repeat: true })}
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      //   getTooltip={getTooltip}
    >
      <CopyrightLicense>
        {"© "}
        <Link href="http://www.openstreetmap.org/copyright" target="blank">
          OpenStreetMap contributors
        </Link>
      </CopyrightLicense>
    </DeckGL>
  );
};
