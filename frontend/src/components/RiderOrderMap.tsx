import type { IOrder } from "../types";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

import * as L from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";

import axios from "axios";
import { realtimeService } from "../main";
import { BiCurrentLocation, BiMapPin } from "react-icons/bi";

declare module "leaflet" {
  namespace Routing {
    function control(options: any): any;
    function osrmv1(options?: any): any;
  }
}

const riderIcon = new L.DivIcon({
  html: `
    <div class="flex items-center justify-center h-12 w-12 rounded-full bg-blue-500 text-white text-2xl shadow-xl border-4 border-white">
      🛵
    </div>
  `,
  iconSize: [48, 48],
  className: "",
});

const deliveryIcon = new L.DivIcon({
  html: `
    <div class="flex items-center justify-center h-12 w-12 rounded-full bg-red-500 text-white text-2xl shadow-xl border-4 border-white">
      📦
    </div>
  `,
  iconSize: [48, 48],
  className: "",
});

interface Props {
  order: IOrder;
}

const Routing = ({
  from,
  to,
}: {
  from: [number, number];
  to: [number, number];
}) => {
  const map = useMap();

  useEffect(() => {
    const control = L.Routing.control({
      waypoints: [L.latLng(from), L.latLng(to)],

      lineOptions: {
        styles: [{ color: "#ef4444", weight: 6 }],
      },

      addWaypoints: false,
      draggableWaypoints: false,
      show: false,

      createMarker: () => null,

      router: L.Routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
      }),
    }).addTo(map);

    return () => {
  if (control && map) {
    try {
      map.removeControl(control);
    } catch (err) {
      console.log("Routing cleanup skipped");
    }
  }
};
  }, [from, to, map]);

  return null;
};

const RiderOrderMap = ({ order }: Props) => {
  const [riderLocation, setRiderLocation] = useState<[number, number] | null>(
    null
  );

  if (
    order.deliveryAddress.latitude == null ||
    order.deliveryAddress.longitude == null
  ) {
    return null;
  }

  const deliveryLocation: [number, number] = [
    order.deliveryAddress.latitude,
    order.deliveryAddress.longitude,
  ];

  useEffect(() => {
    const fetchLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const latitude = pos.coords.latitude;
          const longitude = pos.coords.longitude;

          setRiderLocation([latitude, longitude]);

          axios.post(
            `${realtimeService}/api/v1/internal/emit`,
            {
              event: "rider:location",
              room: `user:${order.userId}`,
              payload: { latitude, longitude },
            },
            {
              headers: {
                "x-internal-key": import.meta.env.VITE_INTERNAL_SERVICE_KEY,
              },
            }
          );
        },
        (err) => console.log("Location Error:", err),
        {
          enableHighAccuracy: true,
          maximumAge: 5000,
          timeout: 10000,
        }
      );
    };

    fetchLocation();

    const interval = setInterval(fetchLocation, 10000);

    return () => clearInterval(interval);
  }, [order.userId]);

  if (!riderLocation) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow-lg">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-500">
          <BiCurrentLocation className="text-3xl animate-pulse" />
        </div>

        <h3 className="text-lg font-bold text-gray-800">
          Fetching Live Location
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          Please allow location access to continue delivery tracking
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">
      <div className="flex flex-col gap-4 border-b border-gray-100 bg-gradient-to-r from-red-500 to-orange-500 p-5 text-white md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Live Delivery Tracking</h2>

          <p className="mt-1 text-sm text-white/80">
            Real-time rider navigation and delivery route
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
          <div className="h-2.5 w-2.5 rounded-full bg-green-300 animate-pulse" />
          Live Tracking
        </div>
      </div>

      <div className="flex flex-col gap-4 border-b border-gray-100 bg-gray-50 p-5 lg:flex-row">
        <div className="flex flex-1 items-start gap-3 rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-500">
            <BiCurrentLocation className="text-2xl" />
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Rider Location
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-700">
              Tracking rider in real-time
            </p>
          </div>
        </div>

        <div className="flex flex-1 items-start gap-3 rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-500">
            <BiMapPin className="text-2xl" />
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Delivery Destination
            </p>

            <p className="mt-1 text-sm leading-relaxed text-gray-700">
              {order.deliveryAddress.formattedAddress}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <MapContainer
          center={riderLocation}
          zoom={14}
          className="h-[550px] w-full rounded-3xl shadow-inner"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={riderLocation} icon={riderIcon}>
            <Popup>
              <div className="text-sm font-semibold">
                Rider Current Location
              </div>
            </Popup>
          </Marker>

          <Marker position={deliveryLocation} icon={deliveryIcon}>
            <Popup>
              <div className="text-sm font-semibold">Delivery Destination</div>
            </Popup>
          </Marker>

          <Routing from={riderLocation} to={deliveryLocation} />
        </MapContainer>
      </div>
    </div>
  );
};

export default RiderOrderMap;
