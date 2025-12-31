import MapComponent from "./map-component";
interface DynamicMapProp {
  isLoading: boolean;
  error: string;
  requestLocation: () => void;
}
function DynamicMap({ isLoading, error, requestLocation }: DynamicMapProp) {
  return (
    <div>
      {isLoading && (
        <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded bg-white px-4 py-2 shadow">
          Getting your location...
        </div>
      )}
      {error && !isLoading && (
        <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded bg-red-100 px-4 py-2 text-red-700 shadow">
          {error}
          <button onClick={requestLocation} className="ml-2 underline">
            Retry
          </button>
        </div>
      )}
      <div className="fixed top-4 z-10">HELLO MAP</div>
      <MapComponent />
    </div>
  );
}

export default DynamicMap;
