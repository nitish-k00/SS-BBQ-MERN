import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getAdressMapApi } from "../middleware/API";

// Fixing marker icons issue in leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png",
});

function Account() {
  const [selectedPlace, setSelectedPlace] = useState({});
  const [userLocation, setUserLocation] = useState(null);
  const [manualLocation, setManualLocation] = useState(null);
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [addressDetails, setAddressDetails] = useState("");
  const mapRef = useRef(null);

  const targetLocation = { lat: 11.074786226196956, lng: 78.00728674295594 };

  const calculateDistance = (loc1, loc2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (loc2.lat - loc1.lat) * (Math.PI / 180);
    const dLng = (loc2.lng - loc1.lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(loc1.lat * (Math.PI / 180)) *
        Math.cos(loc2.lat * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const checkDeliveryAvailability = (location) => {
    const distance = calculateDistance(targetLocation, location);
    if (distance <= 7) {
      setDeliveryMessage("Delivery is available to your location");
    } else {
      setDeliveryMessage("We can't deliver to your location");
    }
  };

  const getGeocode = async (location) => {
    try {
      const response = await getAdressMapApi(location.lat, location.lng);
      console.log(response, "w");
      if (response) {
        setAddressDetails(response.display_name);
      }
    } catch (error) {
      console.error("Error fetching geocode data: ", error);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(location);
        checkDeliveryAvailability(location);
        getGeocode(location);
      });
    }
  }, []);

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const location = {
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        };
        setManualLocation(location);
        setUserLocation(null);
        checkDeliveryAvailability(location);
        getGeocode(location);
      },
    });

    return null;
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(location);
        setManualLocation(null);
        checkDeliveryAvailability(location);
        getGeocode(location);
        if (mapRef.current) {
          mapRef.current.flyTo(location, 15);
        }
      });
    }
  };

  return (
    <div style={{ width: "80vw", height: "80vh", margin: "0 auto" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Delivery Address
      </Typography>
      {userLocation || manualLocation ? (
        <div style={{ width: "100%", height: "60vh", marginBottom: "20px" }}>
          <MapContainer
            center={userLocation || manualLocation || targetLocation}
            zoom={15}
            style={{ width: "100%", height: "100%" }}
            ref={mapRef}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {userLocation && (
              <Marker position={userLocation}>
                <Popup>Your current location</Popup>
              </Marker>
            )}
            {manualLocation && (
              <Marker position={manualLocation}>
                <Popup>Selected location</Popup>
              </Marker>
            )}
            <LocationMarker />
          </MapContainer>
        </div>
      ) : (
        <Box textAlign="center">
          <Typography variant="h6">
            Please allow location access to get your exact location
          </Typography>
        </Box>
      )}

      <Typography variant="h6" style={{ margin: "20px 0" }} align="center">
        {deliveryMessage}
      </Typography>

      <Box display="flex" justifyContent="center">
        <Button
          variant="contained"
          color="primary"
          onClick={handleCurrentLocation}
          style={{ marginBottom: "20px" }}
        >
          Use Current Location
        </Button>
      </Box>

      {addressDetails && (
        <Card style={{ maxWidth: 500, margin: "0 auto" }}>
          <CardContent>
            <Typography variant="body1">
              <strong>Address: </strong>
              {addressDetails}
            </Typography>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default Account;
