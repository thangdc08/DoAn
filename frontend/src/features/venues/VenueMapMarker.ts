import { divIcon } from 'leaflet';
import type { DivIcon } from 'leaflet';

/**
 * createMarkerIcon — tạo Leaflet DivIcon cho marker sân cầu lông.
 * Tách riêng để VenueList.tsx không chứa logic DOM.
 */
export const createMarkerIcon = (active?: boolean, badge?: number): DivIcon =>
  divIcon({
    className: '',
    iconSize: [36, 44],
    iconAnchor: [18, 38],
    popupAnchor: [0, -38],
    html: `<div class="venue-marker ${active ? 'is-active' : ''}">${
      badge ? `<span class="venue-marker-badge">${badge}</span>` : ''
    }</div>`,
  });
