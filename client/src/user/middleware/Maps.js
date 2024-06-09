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

import { FullscreenControl } from "react-leaflet-fullscreen";
import "leaflet.fullscreen/Control.FullScreen.css";
import { Spinner } from "react-bootstrap";

import { selectUserInfo } from "../../redux/slices/userInfo";
import { useSelector } from "react-redux";

// Fixing marker icons issue in leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png",
});

function Maps({ setEditData, editData }) {
  const [loading, setLoading] = useState(false);
  const [mapLoading, setMapLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [manualLocation, setManualLocation] = useState(null);
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [addressDetails, setAddressDetails] = useState("");
  const [locationError, setLocationError] = useState("");
  const mapRef = useRef(null);

  const existingLocationRedux = useSelector(selectUserInfo);

  // console.log(existingLocationRedux?.latitude, addressDetails);
  // console.log(editData, "edit");

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

  const checkDeliveryAvailability = () => {
    const location = userLocation || manualLocation;

    console.log(location);
    if (!location) return;

    const distance = calculateDistance(targetLocation, location);
    if (distance <= 7) {
      setDeliveryMessage("Delivery is available to your location");
      console.log(addressDetails, "detail");
      const address = {
        MapAddress: addressDetails || "",
        latitude: location.lat,
        longitude: location.lng,
      };
      setEditData({ ...editData, ...address });
    } else {
      setDeliveryMessage("We can't deliver to your location");
      const address = { MapAddress: "", latitude: "", longitude: "" };
      setEditData({ ...editData, ...address });
    }
  };

  const getGeocode = async (location) => {
    setLoading(true);
    try {
      const response = await getAdressMapApi(location.lat, location.lng);
      //   console.log(response);
      if (response.detail) {
        setAddressDetails(response.detail);
        console.log(response, "res");
      } else {
        setAddressDetails("Error in getting details");
      }
    } catch (error) {
      console.error("Error fetching geocode data: ", error);
    }
    setLoading(false);
  };

  const updateLocation = (location) => {
    if (!location) return;

    if (manualLocation) {
      setManualLocation(location);
    } else {
      setUserLocation(location);
    }
    getGeocode(location);
  };

  useEffect(() => {
    if (userLocation || manualLocation) {
      checkDeliveryAvailability();
    }
  }, [userLocation, manualLocation, addressDetails]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: existingLocationRedux?.latitude || position.coords.latitude,
            lng: existingLocationRedux?.longitude || position.coords.longitude,
          };
          setUserLocation(location);
          getGeocode(location);
          setMapLoading(false);
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationError(
                " Please allow location access from your settings to get your exact location"
              );
              setMapLoading(false);
              break;
            case error.POSITION_UNAVAILABLE:
              console.error("Location information is unavailable.");
              // Handle position unavailable error
              setLocationError("Location information is unavailable.");
              setMapLoading(false);
              break;
            case error.TIMEOUT:
              console.error("The request to get user location timed out.");

              // Handle timeout error
              setLocationError(
                " The request to get user location timed out , please refresh the page and try again."
              );
              setMapLoading(false);

              break;
            case error.UNKNOWN_ERROR:
              console.error(
                "An unknown error occurred ,please refresh the page and try again."
              );
              // Handle unknown error
              setLocationError(" An unknown error occurred.");
              setMapLoading(false);
              break;
            default:
              console.error(
                "An error occurred:please refresh the page and try again",
                error
              );
              // Handle other errors
              setLocationError(" An error occurred:");
              setMapLoading(false);
          }
        }
      );
    }
  }, []);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setMapLoading(false);
  //   }, 2000);
  // }, []);

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const location = {
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        };
        setManualLocation(location);
        setUserLocation(null);
        updateLocation(location);
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
        updateLocation(location);
        if (mapRef.current) {
          mapRef.current.flyTo(location, 15);
        }
      });
    }
  };

  return (
    <div>
      {mapLoading ? (
        <div className="my-3 d-flex justify-content-center">
          <span style={{ fontSize: "30px" }}>
            <Spinner size="lg" variant="primary" animation="border" /> Map
            Loading....
          </span>
        </div>
      ) : userLocation || manualLocation ? (
        <div style={{ width: "100%", height: "60vh", marginBottom: "20px" }}>
          <MapContainer
            center={manualLocation || userLocation}
            zoom={15}
            style={{ width: "100%", height: "100%" }}
            ref={mapRef}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <FullscreenControl position="topleft" />
            {userLocation && (
              <Marker position={userLocation}>
                <Popup>Your current location</Popup>
              </Marker>
            )}
            {manualLocation && (
              <Marker
                position={manualLocation}
                eventHandlers={{
                  click: () => {
                    if (mapRef.current) {
                      mapRef.current.flyTo(manualLocation, 15);
                    }
                  },
                }}
              >
                <Popup>Selected location</Popup>
              </Marker>
            )}
            <LocationMarker />
          </MapContainer>
        </div>
      ) : (
        <Box textAlign="center">
          <Typography variant="h6" style={{ color: "red" }}>
            {locationError}
          </Typography>
        </Box>
      )}

      {(userLocation || manualLocation) && (
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
      )}
      <Typography
        variant="h6"
        style={{
          margin: "10px 0",
          color:
            deliveryMessage === "We can't deliver to your location"
              ? "red"
              : "green",
        }}
        align="center"
      >
        {deliveryMessage}
      </Typography>

      {addressDetails && (
        <Card className="mb-3" style={{ maxWidth: 500, margin: "0 auto" }}>
          <CardContent>
            <Typography variant="body1">
              <strong>Address: </strong>
              {loading ? (
                <Spinner animation="border" variant="primary" size="sm" />
              ) : (
                <div
                  style={{
                    margin: "10px 0",
                    color:
                      addressDetails === "Error in getting details" && "red",
                  }}
                >
                  {addressDetails}
                </div>
              )}
            </Typography>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default Maps;
