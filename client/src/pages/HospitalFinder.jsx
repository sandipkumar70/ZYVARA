
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";


// Fix Leaflet marker
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const hospitalIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapController({ center, target }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, 15);
    }
  }, [center]);

  useEffect(() => {
    if (target) {
      map.flyTo(target, 17, {
        duration: 1,
      });
    }
  }, [target]);

  return null;
}

function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  return (
    R *
    2 *
    Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  );
}

function Spinner() {
  return (
    <div className="flex justify-center py-6">
      <div className="w-7 h-7 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin"></div>
    </div>
  );
}

const RADIUS_OPTIONS = [2, 5, 10, 20];

export default function HospitalFinder() {
  const navigate = useNavigate();
  const [position, setPosition] = useState(null);
  const [locationLabel, setLocationLabel] = useState("");
  const [radiusKm, setRadiusKm] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHospital, setSelectedHospital] =
    useState(null);
    
  const [flyToTarget, setFlyToTarget] =
    useState(null);


      // ---------------- LOCATION ----------------

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported.");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(

      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;



        setPosition({ lat, lng });

        await fetchLocationLabel(lat, lng);

        await fetchNearbyHospitals(
          lat,
          lng,
          radiusKm * 1000
        );

        setLoading(false);
      },
      () => {
        setLoading(false);
        setError(
          "Location permission denied."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // ---------------- LOCATION NAME ----------------

  const fetchLocationLabel = async (
    lat,
    lng
  ) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );

      const data = await res.json();

      const city =
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        data.address?.suburb ||
        "";

      const state =
        data.address?.state || "";

      setLocationLabel(
        `${city}${city && state ? ", " : ""}${state}`
      );
    } catch {
      setLocationLabel("Current Location");
    }
  };

  // ---------------- OVERPASS ----------------

  const runOverpassQuery = async (
    lat,
    lng,
    radius
  ) => {
    const query = `
[out:json][timeout:25];
(
node["amenity"="hospital"](around:${radius},${lat},${lng});
way["amenity"="hospital"](around:${radius},${lat},${lng});
relation["amenity"="hospital"](around:${radius},${lat},${lng});
);
out center;
`;

    const response = await fetch(
      "https://overpass.kumi.systems/api/interpreter",
      {
        method: "POST",
        body: query,
      }
    );

    return await response.json();
  };



  // ---------------- FETCH HOSPITALS ----------------

  const fetchNearbyHospitals = async (
    lat,
    lng,
    radius
  ) => {
    try {
      setLoading(true);
      setError("");


console.log("Fetching hospitals from:", lat, lng);  /////
    console.log("Radius:", radius);  /////


      const data = await runOverpassQuery(
        lat,
        lng,
        radius
      );

      const list = (data.elements || [])
        .map((item) => {
          const hLat = item.lat || item.center?.lat;
          const hLng = item.lon || item.center?.lon;

          if (!hLat || !hLng) return null;

          return {
            id: item.id,
            name:
              item.tags?.name ||
              "Unnamed Hospital",
            lat: hLat,
            lng: hLng,
            phone:
              item.tags?.phone ||
              item.tags?.["contact:phone"] ||
              "",
            address:
              item.tags?.["addr:full"] ||
              item.tags?.street ||
              "",
            emergency:
              item.tags?.emergency === "yes",
            hours:
              item.tags?.opening_hours || "",
            distance: getDistanceKm(
              lat,
              lng,
              hLat,
              hLng
            ),
          };
        })
        .filter(Boolean)
        .sort(
          (a, b) =>
            a.distance - b.distance
        );

      setHospitals(list);

      if (list.length === 0) {
        setError(
          "No hospitals found."
        );
      }
    } catch (err) {
      console.log(err);

      setError(
        "Unable to load hospitals."
      );
    }

    setLoading(false);
  };

  // ---------------- BUTTONS ----------------

  const refreshLocation = () => {
    getCurrentLocation();
  };

  const changeRadius = (km) => {
    setRadiusKm(km);

    if (position) {
      fetchNearbyHospitals(
        position.lat,
        position.lng,
        km * 1000
      );
    }
  };

  const openDirections = (hospital) => {
    window.open(
      `https://www.openstreetmap.org/directions?from=${position.lat},${position.lng}&to=${hospital.lat},${hospital.lng}`,
      "_blank"
    );
  };

  const filteredHospitals =
    hospitals.filter((hospital) =>
      hospital.name
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        )
    );


      return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}

      <div className="bg-white shadow px-5 py-4 flex justify-between items-center">

        <div>
          <h1 className="text-2xl font-bold">
            🏥 Nearby Hospitals
          </h1>

          <p className="text-gray-500 text-sm">
            {locationLabel || "Detecting location..."}
          </p>
        </div>

        <button
          onClick={() => navigate("/home")}
          className="bg-cyan-600 text-white px-4 py-2 rounded-lg"
        >
          Home
        </button>

      </div>

      <div className="max-w-6xl mx-auto p-5">

        {/* Radius */}

        <div className="flex gap-2 flex-wrap mb-4">

          {RADIUS_OPTIONS.map((km) => (

            <button
              key={km}
              onClick={() => changeRadius(km)}
              className={`px-4 py-2 rounded-lg ${
                radiusKm === km
                  ? "bg-cyan-600 text-white"
                  : "bg-white border"
              }`}
            >
              {km} km
            </button>

          ))}

          <button
            onClick={refreshLocation}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Refresh
          </button>

        </div>

        {/* Search */}

        <input
          className="w-full border rounded-lg px-4 py-3 mb-4"
          placeholder="Search Hospital..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />

        {loading && <Spinner />}

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {position && (

          <div
            className="rounded-xl overflow-hidden shadow mb-5"
            style={{ height: 400 }}
          >

            <MapContainer
              center={[
                position.lat,
                position.lng,
              ]}
              zoom={15}
              style={{
                height: "100%",
                width: "100%",
              }}
            >

              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap"
              />

              <MapController
                center={[
                  position.lat,
                  position.lng,
                ]}
                target={flyToTarget}
              />

              <Marker
                position={[
                  position.lat,
                  position.lng,
                ]}
              >
                <Popup>
                  📍 Your Current Location
                </Popup>
              </Marker>

              {filteredHospitals.map((hospital) => (

                <Marker
                  key={hospital.id}
                  position={[
                    hospital.lat,
                    hospital.lng,
                  ]}
                  icon={hospitalIcon}
                >
                  <Popup>

                    <b>{hospital.name}</b>

                    <br />

                    {hospital.distance.toFixed(2)} km

                  </Popup>

                </Marker>

              ))}

            </MapContainer>

          </div>

        )}

        <div className="space-y-3">

          {filteredHospitals.map((hospital) => (

            <div
              key={hospital.id}
              className="bg-white rounded-xl shadow p-4 cursor-pointer hover:bg-cyan-50"
              onClick={() => {
                setSelectedHospital(hospital);
                setFlyToTarget([
                  hospital.lat,
                  hospital.lng,
                ]);
              }}
            >

              <h2 className="font-bold text-lg">
                🏥 {hospital.name}
              </h2>

              <p className="text-sm text-gray-500">
                {hospital.distance.toFixed(2)} km away
              </p>

            </div>

          ))}

        </div>


              </div>

      {selectedHospital && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

          <div className="bg-white rounded-2xl w-[380px] p-6">

            <div className="flex justify-between items-center mb-4">

              <h2 className="text-xl font-bold">
                🏥 {selectedHospital.name}
              </h2>

              <button
                onClick={() => setSelectedHospital(null)}
                className="text-2xl"
              >
                ×
              </button>

            </div>

            <div className="space-y-2">

              <p>
                📍 {selectedHospital.address || "Address not available"}
              </p>

              <p>
                📏 {selectedHospital.distance.toFixed(2)} km
              </p>

              {selectedHospital.hours && (
                <p>
                  🕒 {selectedHospital.hours}
                </p>
              )}

              {selectedHospital.phone ? (
                <a
                  href={`tel:${selectedHospital.phone}`}
                  className="block bg-green-600 text-white text-center py-3 rounded-xl mt-3"
                >
                  📞 Call Hospital
                </a>
              ) : (
                <p className="text-gray-500">
                  Phone number not available
                </p>
              )}

              <button
                onClick={() =>
                  openDirections(selectedHospital)
                }
                className="w-full bg-cyan-600 text-white py-3 rounded-xl mt-2"
              >
                🧭 Get Directions
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}