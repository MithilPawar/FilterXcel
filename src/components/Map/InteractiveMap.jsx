import React from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { mapContainerStyle, center } from "./mapConfig";

const InteractiveMap = () => {
  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={15} />
    </LoadScript>
  );
};

export default InteractiveMap;
