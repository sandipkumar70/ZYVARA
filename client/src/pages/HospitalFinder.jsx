
// import { useState, useEffect, useRef } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
// import L from 'leaflet'
// import 'leaflet/dist/leaflet.css'

// delete L.Icon.Default.prototype._getIconUrl
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
//   iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
// })

// const hospitalIcon = new L.Icon({
//   iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// })

// function MapController({ center, zoomTarget }) {
//   const map = useMap()
//   useEffect(() => {
//     if (center) {
//       map.setView(center, map.getZoom())
//     }
//   }, [center])
//   useEffect(() => {
//     if (zoomTarget) {
//       map.flyTo(zoomTarget, 17, { duration: 0.8 })
//     }
//   }, [zoomTarget])
//   return null
// }

// function getDistanceKm(lat1, lng1, lat2, lng2) {
//   const R = 6371
//   const dLat = (lat2 - lat1) * (Math.PI / 180)
//   const dLng = (lng2 - lng1) * (Math.PI / 180)
//   const a =
//     Math.sin(dLat / 2) ** 2 +
//     Math.cos(lat1 * (Math.PI / 180)) *
//       Math.cos(lat2 * (Math.PI / 180)) *
//       Math.sin(dLng / 2) ** 2
//   return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
// }

// function buildAddress(tags) {
//   if (!tags) return null
//   const parts = [
//     tags['addr:housenumber'],
//     tags['addr:street'],
//     tags['addr:city'] || tags['addr:suburb']
//   ].filter(Boolean)
//   return parts.length > 0 ? parts.join(', ') : null
// }

// const RADIUS_OPTIONS = [2, 5, 10, 20]

// function Spinner() {
//   return (
//     <div className="flex justify-center py-2">
//       <div className="w-6 h-6 border-2 border-gray-200 border-t-cyan-500 rounded-full animate-spin" />
//     </div>
//   )
// }

// function HospitalFinder() {
//   const navigate = useNavigate()
//   const [position, setPosition] = useState(null)
//   const [locationLabel, setLocationLabel] = useState('')
//   const [hospitals, setHospitals] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')
//   const [radiusKm, setRadiusKm] = useState(5)
//   const [selectedHospital, setSelectedHospital] = useState(null)
//   const [searchTerm, setSearchTerm] = useState('')
//   const [flyToTarget, setFlyToTarget] = useState(null)
  
  

//   useEffect(() => {
//     if (!navigator.geolocation) {
//       setError('Geolocation not supported in this browser.')
//       return
//     }

    

//   navigator.geolocation.getCurrentPosition(
//   (pos) => {
//     const { latitude, longitude } = pos.coords

//     setPosition({ lat: latitude, lng: longitude })

//     fetchNearbyHospitals(latitude, longitude, radiusKm * 1000, false)
//     fetchLocationLabel(latitude, longitude)
//   },


//       () => {
//         setError('Location access denied. Please allow location to find nearby hospitals.')
//       },
//       {
//       enableHighAccuracy: true,
//       timeout: 10000,
//       maximumAge: 0
//       }
//     )

   
    
//   }, [])

//   const fetchLocationLabel = async (lat, lng) => {
//     try {
//       const res = await fetch(
//         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
//       )
//       const data = await res.json()
//       const city = data.address?.city || data.address?.town || data.address?.suburb || data.address?.village
//       const state = data.address?.state
//       setLocationLabel([city, state].filter(Boolean).join(', ') || 'Location detected')
//     } catch (err) {
//       setLocationLabel('Location detected')
//     }
//   }

  
//  const runOverpassQuery = async (lat, lng, radiusMeters) => {

//   const query = `
// [out:json];
// (
//   node["amenity"="hospital"](around:${radiusMeters},${lat},${lng});
//   way["amenity"="hospital"](around:${radiusMeters},${lat},${lng});
//   relation["amenity"="hospital"](around:${radiusMeters},${lat},${lng});
// );
// out center;
// `;

//   const res = await fetch(
//     "https://overpass-api.de/api/interpreter",
//     {
//       method: "POST",
//       body: query,
//     }
//   );

//   return await res.json();
// };

//   const fetchNearbyHospitals = async (lat, lng, radiusMeters, allowAutoExpand) => {
//     setLoading(true)
//     setError('')
//     try {
//       const data = await runOverpassQuery(lat, lng, radiusMeters)
//       console.log("Current Location:", lat, lng)
//       console.log("Radius:", radiusMeters);

//       let results = data.elements
//         .map((el) => {
//           const hLat = el.lat || el.center?.lat
//           const hLng = el.lon || el.center?.lon
//           if (!hLat || !hLng) return null
//           return {
//             id: el.id,
//             name: el.tags?.name || 'Unnamed Hospital',
//             lat: hLat,
//             lng: hLng,
//             phone: el.tags?.phone || el.tags?.['contact:phone'] || null,
//             address: buildAddress(el.tags),
//             isEmergency: el.tags?.emergency === 'yes',
//             hours: el.tags?.opening_hours || null,
//             distance: getDistanceKm(lat, lng, hLat, hLng)
//           }
//         })
//         .filter(Boolean)
//         .sort((a, b) => a.distance - b.distance)

//       if (results.length === 0 && allowAutoExpand && radiusMeters < 15000) {
//         setLoading(false)
//         fetchNearbyHospitals(lat, lng, radiusMeters + 5000, true)
//         return
//       }

//       console.log(results)

//       setHospitals(results)

//       if (results.length === 0) {
//         setError(`No hospitals found within ${radiusMeters / 1000}km.`)
//       }
//     } catch (err) {
//       setError('Failed to fetch nearby hospitals. Please check your internet connection.')
//     }
//     setLoading(false)
//   }

//   const handleRadiusChange = (km) => {
//     setRadiusKm(km)
//     if (position) {
//       fetchNearbyHospitals(position.lat, position.lng, km * 1000, false)
//     }
//   }

//   const handleRefresh = () => {
//     if (position) {
//       fetchNearbyHospitals(position.lat, position.lng, radiusKm * 1000, false)
//       fetchLocationLabel(position.lat, position.lng)
//     }
//   }

//   const handleTryBiggerRadius = () => {
//     const next = RADIUS_OPTIONS.find((r) => r > radiusKm)
//     if (next) handleRadiusChange(next)
//   }

//   const handleCardClick = (h) => {
//     setFlyToTarget([h.lat, h.lng])
//   }

//   const openDirections = (hLat, hLng) => {
//     window.open(`https://www.openstreetmap.org/directions?from=${position.lat},${position.lng}&to=${hLat},${hLng}`, '_blank')
//   }

//   const filteredHospitals = hospitals.filter((h) =>
//     h.name.toLowerCase().includes(searchTerm.toLowerCase())
//   )

//   return (
//     <div className="min-h-screen bg-[#f7f7f8] dark:bg-[#1e3d4a] dark:bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] dark:from-[#2d6176] dark:via-[#1e3d4a] dark:to-[#12262e] flex flex-col transition-colors duration-300">

//       <div className="max-w-4xl mx-auto w-full px-4 pt-6">
//         <div className="bg-white dark:bg-slate-900/40 backdrop-blur-sm border border-gray-200 dark:border-slate-700/30 rounded-3xl shadow-sm dark:shadow-none px-6 py-4 flex items-center justify-between transition-all duration-300">
//           <div>
//             <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
//               🏥 Nearby Hospitals {hospitals.length > 0 && `(${hospitals.length})`}
//             </h2>
//             <p className="text-sm text-gray-500 dark:text-slate-400">Find hospitals near your current location</p>
//           </div>
//           <div className="flex gap-2">
//             <button
//               onClick={() => navigate('/home')}
//               className="px-4 py-2 bg-gray-100 dark:bg-slate-900/40 hover:bg-gray-200 dark:hover:bg-slate-900/60 border border-gray-200 dark:border-cyan-400/30 rounded-xl text-sm font-medium text-gray-700 dark:text-cyan-400 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
//             >
//               Back Home
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-4xl mx-auto w-full px-4 py-4 space-y-4">

//         {/* Current location glass card */}
//         {position && (
//           <div className="text-xs text-cyan-600 dark:text-cyan-400 font-semibold uppercase tracking-wider mb-1">
//             <div>
//               <p className="text-xs text-cyan-400 font-semibold uppercase tracking-wider mb-1">📍 Current Location</p>
//               <p className="text-sm font-medium text-gray-900 dark:text-white">{locationLabel || 'Detecting...'}</p>
//             </div>
//             <div className="flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/30 px-3 py-1.5 rounded-full">
//               <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
//               <span className="text-[11px] font-semibold text-emerald-300">Live Tracking</span>
//             </div>
//           </div>
//         )}

//         {/* Radius selector + refresh */}
//         {position && (
//           <div className="bg-white border border-gray-200 rounded-3xl shadow-sm px-4 py-3 flex items-center justify-between flex-wrap gap-3">
//             <div className="flex gap-2">
//               {RADIUS_OPTIONS.map((km) => (
//                 <button
//                   key={km}
//                   onClick={() => handleRadiusChange(km)}
//                   className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
//                     radiusKm === km
//                       ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
//                       : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                   }`}
//                 >
//                   {km} km
//                 </button>
//               ))}
//             </div>
//             <button
//               onClick={handleRefresh}
//               className="px-3.5 py-2 bg-cyan-50 hover:bg-cyan-100 text-cyan-600 rounded-xl text-xs font-semibold transition"
//             >
//               🔄 Refresh
//             </button>
//           </div>
//         )}

//         {/* Search bar */}
//         {position && hospitals.length > 0 && (
//           <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-4 py-3">
//             <input
//               type="text"
//               placeholder="🔍 Search hospital..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
//             />
//           </div>
//         )}

//         {error && (
//           <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm flex items-center justify-between flex-wrap gap-2">
//             <span>🏥 {error} Try increasing the search radius.</span>
//             {radiusKm < 20 && (
//               <button
//                 onClick={handleTryBiggerRadius}
//                 className="px-3 py-1.5 bg-white border border-red-200 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition"
//               >
//                 Try {RADIUS_OPTIONS.find((r) => r > radiusKm)} km
//               </button>
//             )}
//           </div>
//         )}

//         {!position ? (
//           <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-8 text-center">
//             <Spinner />
//             <p className="text-gray-400 text-sm mt-2">Getting your location...</p>
//           </div>
//         ) : (
//           <>
//             <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden" style={{ height: '350px' }}>
//               <MapContainer center={[position.lat, position.lng]} zoom={14} style={{ height: '100%', width: '100%' }}>
//                 <TileLayer
//                   attribution='&copy; OpenStreetMap contributors'
//                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                 />
//                 <MapController center={[position.lat, position.lng]} zoomTarget={flyToTarget} />

//                 <Marker position={[position.lat, position.lng]}>
//                   <Popup>📍 You are here</Popup>
//                 </Marker>

//                 {hospitals.map((h) => (
//                   <Marker key={h.id} position={[h.lat, h.lng]} icon={hospitalIcon}>
//                     <Popup>
//                       <strong>{h.name}</strong><br />
//                       {h.distance.toFixed(1)} km away
//                     </Popup>
//                   </Marker>
//                 ))}
//               </MapContainer>
//             </div>

//             {loading && (
//               <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6 text-center">
//                 <Spinner />
//                 <p className="text-gray-400 text-sm mt-2">Searching nearby hospitals...</p>
//               </div>
//             )}

//             {!loading && filteredHospitals.length > 0 && (
//               <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden divide-y divide-gray-100">
//                 {filteredHospitals.map((h, i) => (
//                   <button
//                     key={h.id}
//                     onClick={() => { setSelectedHospital(h); handleCardClick(h) }}
//                    className="w-full text-left px-5 py-4 hover:bg-cyan-100 active:bg-cyan-200 transition-all animate-[fadeIn_0.3s_ease-in-out]"
//                   >
//                     <div className="flex items-start justify-between gap-3">
//                       <div className="flex-1">
//                         <p className="font-medium text-gray-900 text-sm flex items-center flex-wrap gap-1.5">
//                           🏥 {h.name}

//                          {i === 0 && (
//                             <span className="text-[10px] font-bold bg-cyan-500 text-white px-2.5 py-1 rounded-full shadow-sm">
//                               ⭐ Nearest
//                             </span>
//                           )}

//                           {h.isEmergency && (
//                             <span className="text-[10px] bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full">
//                               🚑 Emergency
//                             </span>
//                           )}
//                         </p>
//                         {h.address && (
//                           <p className="text-xs text-gray-400 mt-1">📍 {h.address}</p>
//                         )}
//                         <p className="text-xs text-gray-400 mt-0.5">📏 {h.distance.toFixed(1)} km away</p>
//                       </div>
//                       <span className="text-gray-300 text-lg">›</span>
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             )}

//             {!loading && hospitals.length > 0 && filteredHospitals.length === 0 && (
//               <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6 text-center">
//                 <p className="text-gray-400 text-sm">No hospital matches "{searchTerm}"</p>
//               </div>
//             )}
//           </>
//         )}

//       </div>

//       {selectedHospital && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
//           <div className="bg-white rounded-3xl shadow-lg p-6 max-w-sm w-full animate-[fadeIn_0.2s_ease-in-out]">
//             <div className="flex items-start justify-between mb-4">
//               <h3 className="font-bold text-gray-900 text-lg pr-4">🏥 {selectedHospital.name}</h3>
//               <button
//                 onClick={() => setSelectedHospital(null)}
//                 className="text-gray-400 hover:text-gray-600 text-xl leading-none"
//               >
//                 ×
//               </button>
//             </div>

//             <div className="space-y-2 mb-5">
//               {selectedHospital.isEmergency && (
//                 <span className="inline-block text-[11px] bg-red-50 text-red-600 border border-red-200 px-2.5 py-1 rounded-full">
//                   🚑 Emergency Available
//                 </span>
//               )}
//               {selectedHospital.address && (
//                 <p className="text-sm text-gray-600">📍 {selectedHospital.address}</p>
//               )}
//               <p className="text-sm text-gray-600">📏 {selectedHospital.distance.toFixed(1)} km away</p>
//               {selectedHospital.hours && (
//                 <p className="text-sm text-gray-600">🕒 {selectedHospital.hours}</p>
//               )}
//               {!selectedHospital.phone && (
//                 <p className="text-xs text-gray-400">📞 Phone number not available for this hospital</p>
//               )}
//             </div>

//             <div className="flex gap-3">
//               {selectedHospital.phone && (
//                 <a
//                   href={`tel:${selectedHospital.phone}`}
//                   className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 rounded-2xl text-sm text-center transition"
//                 >
//                   📞 Call
//                 </a>
//               )}
//               <button
//                 onClick={() => openDirections(selectedHospital.lat, selectedHospital.lng)}
//                 className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-3 rounded-2xl text-sm transition"
//               >
//                 🧭 Directions
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   )
// }

// export default HospitalFinder








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