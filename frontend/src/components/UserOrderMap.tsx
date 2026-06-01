import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

import * as L from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";

import { useEffect } from "react";
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
      map.removeControl(control);
    };
  }, [from, to, map]);

  return null;
};

interface Props {
  riderLocation: [number, number];
  deliveryLocation: [number, number];
}

const UserOrderMap = ({ riderLocation, deliveryLocation }: Props) => {
  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">
      <div className="flex flex-col gap-4 border-b border-gray-100 bg-gradient-to-r from-blue-500 to-indigo-500 p-5 text-white md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Live Order Tracking</h2>

          <p className="mt-1 text-sm text-white/80">
            Track your rider in real-time
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
          <div className="h-2.5 w-2.5 rounded-full bg-green-300 animate-pulse" />
          Live
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
              Your delivery partner is on the way
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

            <p className="mt-1 text-sm font-semibold text-gray-700">
              Delivery address selected
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

export default UserOrderMap;
