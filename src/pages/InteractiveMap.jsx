import React from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";

const InteractiveMap = () => {
  const mapContainerStyle = {
    width: "100%",
    height: "300px",
  };

  const center = {
    lat: 16.990583,
    lng: 73.293598, 
  };

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={15}
      />
    </LoadScript>
  );
};

export default InteractiveMap;
