// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NaverMap = any;

declare global {
  interface Window {
    naver?: {
      maps: {
        Map: new (mapDiv: HTMLElement | null, options: object) => NaverMap;
        LatLng: new (lat: number, lng: number) => NaverMap;
        Marker: new (options: object) => NaverMap;
        Point: new (x: number, y: number) => NaverMap;
        Event: {
          addListener: (marker: NaverMap, event: string, callback: () => void) => void;
        };
      };
    };
  }
}

// This export statement is needed to make the file a module, which is required for 'declare global'.
export {};
