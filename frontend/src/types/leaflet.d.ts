declare module 'leaflet' {
  export type LatLngTuple = [number, number];
  export type LatLngExpression = LatLngTuple;
  export type LatLngBoundsExpression = LatLngTuple[];

  export interface FitBoundsOptions {
    padding?: [number, number];
    maxZoom?: number;
  }

  export interface MapOptions {
    center?: LatLngExpression;
    zoom?: number;
    zoomControl?: boolean;
    minZoom?: number;
    maxZoom?: number;
  }

  export interface LayerOptions {
    pane?: string;
    attribution?: string;
  }

  export interface TileLayerOptions extends LayerOptions {
    minZoom?: number;
    maxZoom?: number;
  }

  export interface IconOptions {
    iconSize?: [number, number];
    iconAnchor?: [number, number];
    popupAnchor?: [number, number];
    className?: string;
  }

  export interface DivIconOptions extends IconOptions {
    html?: string;
  }

  export class Icon<TOptions extends IconOptions = IconOptions> {
    options: TOptions;
  }

  export class DivIcon extends Icon<DivIconOptions> {}

  export interface MarkerOptions {
    icon?: Icon | DivIcon;
    title?: string;
  }

  export interface PopupOptions {
    className?: string;
    maxWidth?: number;
    minWidth?: number;
  }

  export class Map {}
  export class TileLayer {}
  export class Marker<T = unknown> {
    readonly __markerType?: T;
  }
  export class Popup {}

  export function divIcon(options?: DivIconOptions): DivIcon;

  const L: {
    divIcon: typeof divIcon;
  };

  export default L;
}
