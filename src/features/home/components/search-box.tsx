"use client";
import { MAPBOX_TOKEN } from "@/constants";
import { SearchBox as MapboxSearchBox } from "@mapbox/search-js-react";

function SearchBox() {
  return (
    <MapboxSearchBox
      options={{
        country: "NG",
        proximity: [7.0219, 4.8156], // Port Harcourt coordinates
        language: "en",
      }}
      accessToken={MAPBOX_TOKEN!}
      onRetrieve={(result) => {
        // console.log(result.features[0].properties);
        console.log(result);
      }}
      placeholder="Enter address..."
    />
  );
}
export default SearchBox;
