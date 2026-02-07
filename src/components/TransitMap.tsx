import { STATION_COORDS } from "@/config/stationCoords";
import { Route, Vehicle, VehiclesResponse } from "@/types/mbta";
import Image from "next/image";
import { useEffect, useState } from "react";
import StationModal from "./StationModal";

interface TrainPosition {
  id: string;
  x: number;
  y: number;
  route: string;
  color: string;
  label: string;
  direction: 0 | 1;
  carriages: number;
  occupancyStatus: string | null;
  currentStatus: string;
  speed: number | null;
  updatedAt: string;
}

const ROUTE_COLORS: { [key: string]: string } = {
  Red: "#DA291C",
  Orange: "#ED8B00",
  Blue: "#003DA5",
  Green: "#00843D",
  "Green-B": "#00843D",
  "Green-C": "#00843D",
  "Green-D": "#00843D",
  "Green-E": "#00843D",
};

// Station name mapping
const STATION_NAMES: { [key: string]: string } = {
  // Green-E Line
  "place-rvrwy": "Riverway",
  "place-bckhl": "Back of the Hill",
  "place-hsmnl": "Heath Street",
  "place-mfa": "Museum of Fine Arts",
  "place-nuniv": "Northeastern University",
  "place-symcl": "Symphony",
  "place-prmnl": "Prudential",
  "place-boyls": "Boylston",
  "place-armnl": "Arlington",
  "place-coecl": "Copley",
  "place-mispk": "Mission Park",
  "place-fenwd": "Fenwood Road",
  "place-brmnl": "Brigham Circle",
  "place-lngmd": "Longwood Medical Area",
  "place-spmnl": "Science Park/West End",
  "place-lech": "Lechmere",
  "place-esomr": "East Somerville",
  "place-gilmn": "Gilman Square",
  "place-mgngl": "Magoun Square",
  "place-balsq": "Ball Square",
  "place-mdftf": "Medford/Tufts",
  // Orange Line
  "place-forhl": "Forest Hills",
  "place-grnst": "Green Street",
  "place-sbmnl": "Stony Brook",
  "place-jaksn": "Jackson Square",
  "place-rcmnl": "Roxbury Crossing",
  "place-rugg": "Ruggles",
  "place-masta": "Massachusetts Avenue",
  "place-bbsta": "Back Bay",
  "place-chncl": "Chinatown",
  "place-tumnl": "Tufts Medical Center",
  "place-state": "State",
  "place-haecl": "Haymarket",
  "place-north": "North Station",
  "place-ccmnl": "Community College",
  "place-sull": "Sullivan Square",
  "place-astao": "Assembly",
  "place-welln": "Wellington",
  "place-mlmnl": "Malden Center",
  "place-ogmnl": "Oak Grove",
  // Red Line
  "place-pktrm": "Park Street",
  "place-alfcl": "Alewife",
  "place-davis": "Davis",
  "place-portr": "Porter",
  "place-harsq": "Harvard",
  "place-cntsq": "Central",
  "place-knncl": "Kendall/MIT",
  "place-chmnl": "Charles/MGH",
  "place-dwnxg": "Downtown Crossing",
  "place-sstat": "South Station",
  "place-brdwy": "Broadway",
  "place-andrw": "Andrew",
  "place-jfk": "JFK/UMass",
  "place-shmnl": "Savin Hill",
  "place-smmnl": "Shawmut",
  "place-fldcr": "Fields Corner",
  "place-nqncy": "North Quincy",
  "place-wlsta": "Wollaston",
  "place-qnctr": "Quincy Center",
  "place-qamnl": "Quincy Adams",
  "place-brntn": "Braintree",
  // Mattapan Line
  "place-cedgr": "Cedar Grove",
  "place-asmnl": "Ashmont",
  "place-butlr": "Butler",
  "place-miltt": "Milton",
  "place-cenav": "Central Avenue",
  "place-valrd": "Valley Road",
  "place-capst": "Capen Street",
  "place-matt": "Mattapan",
  // Blue Line
  "place-gover": "Government Center",
  "place-bomnl": "Bowdoin",
  "place-aqucl": "Aquarium",
  "place-mvbcl": "Maverick",
  "place-aport": "Airport",
  "place-wimnl": "Wood Island",
  "place-orhte": "Orient Heights",
  "place-sdmnl": "Suffolk Downs",
  "place-bmmnl": "Beachmont",
  "place-rbmnl": "Revere Beach",
  "place-wondl": "Wonderland",
  // Green-D Line
  "place-river": "Riverside",
  "place-woodl": "Woodland",
  "place-waban": "Waban",
  "place-eliot": "Eliot",
  "place-newtn": "Newton Highlands",
  "place-newto": "Newton Centre",
  "place-chhil": "Chestnut Hill",
  "place-rsmnl": "Reservoir",
  "place-bcnfd": "Beaconsfield",
  "place-brkhl": "Brookline Hills",
  "place-bvmnl": "Brookline Village",
  "place-longw": "Longwood",
  "place-fenwy": "Fenway",
  "place-kencl": "Kenmore",
  "place-hymnl": "Hynes Convention Center",
  "place-unsqu": "Union Square",
  // Green-C Line
  "place-clmnl": "Cleveland Circle",
  "place-engav": "Englewood Avenue",
  "place-denrd": "Dean Road",
  "place-tapst": "Tappan Street",
  "place-bcnwa": "Washington Square",
  "place-fbkst": "Fairbanks Street",
  "place-bndhl": "Brandon Hall",
  "place-sumav": "Summit Avenue",
  "place-cool": "Coolidge Corner",
  "place-stpul": "Saint Paul Street",
  "place-kntst": "Kent Street",
  "place-hwsst": "Hawes Street",
  "place-smary": "Saint Mary's Street",
  // Green-B Line
  "place-lake": "Boston College",
  "place-sougr": "South Street",
  "place-chill": "Chestnut Hill Avenue",
  "place-chswk": "Chiswick Road",
  "place-sthld": "Sutherland Road",
  "place-wascm": "Washington Street",
  "place-wrnst": "Warren Street",
  "place-alsgr": "Allston Street",
  "place-grigg": "Griggs Street",
  "place-harvd": "Harvard Avenue",
  "place-brico": "Packard's Corner",
  "place-babck": "Babcock Street",
  "place-amory": "Amory Street",
  "place-buest": "Boston University East",
  "place-bucen": "Boston University Central",
  "place-bland": "Blandford Street",
};

export default function TransitMap() {
  const [trains, setTrains] = useState<TrainPosition[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hoveredTrain, setHoveredTrain] = useState<TrainPosition | null>(null);
  const [selectedStation, setSelectedStation] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const fetchVehicles = async () => {
    try {
      const response = await fetch("/api/vehicles");
      if (!response.ok) throw new Error("Failed to fetch vehicles");

      const data: VehiclesResponse = await response.json();

      // Create a map of routes for quick lookup
      const routeMap = new Map<string, Route>();
      const stopMap = new Map<string, any>();
      data.included?.forEach((item) => {
        if (item.type === "route") {
          routeMap.set(item.id, item as Route);
        } else if (item.type === "stop") {
          stopMap.set(item.id, item);
        }
      });

      // Convert vehicles to train positions
      const positions = data.data
        .map((vehicle: Vehicle): TrainPosition | null => {
          const routeId = vehicle.relationships.route.data.id;
          const route = routeMap.get(routeId);

          // Determine route name (Red, Orange, Blue, or Green branch)
          let routeName = route?.attributes.long_name || routeId;
          if (routeName.includes("Red")) routeName = "Red";
          else if (routeName.includes("Orange")) routeName = "Orange";
          else if (routeName.includes("Blue")) routeName = "Blue";
          else if (routeName.includes("Green")) {
            // Determine Green Line branch
            if (routeId === "Green-B") routeName = "Green-B";
            else if (routeId === "Green-C") routeName = "Green-C";
            else if (routeId === "Green-D") routeName = "Green-D";
            else if (routeId === "Green-E") routeName = "Green-E";
            else routeName = "Green";
          }

          // Get stop ID if available
          const stopId = vehicle.relationships.stop?.data?.id;

          // Get parent station ID from stop data
          let parentStationId = stopId;
          if (stopId) {
            const stop = stopMap.get(stopId);
            if (stop?.relationships?.parent_station?.data?.id) {
              parentStationId = stop.relationships.parent_station.data.id;
            }
          }

          // Try to map to SVG coordinates using parent station ID
          let svgCoords = parentStationId ? STATION_COORDS[parentStationId] : null;

          // If we have coordinates, use them
          if (svgCoords) {
            return {
              id: vehicle.id,
              x: svgCoords.x,
              y: svgCoords.y,
              route: routeName,
              color: ROUTE_COLORS[routeName] || "#666",
              label: vehicle.attributes.label,
              direction: vehicle.attributes.direction_id,
              carriages: vehicle.attributes.carriages?.length || 0,
              occupancyStatus: vehicle.attributes.occupancy_status || null,
              currentStatus: vehicle.attributes.current_status || "UNKNOWN",
              speed: vehicle.attributes.speed || null,
              updatedAt: vehicle.attributes.updated_at,
            };
          }

          return null;
        })
        .filter((pos): pos is TrainPosition => pos !== null);

      setTrains(positions);
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      console.error("Error fetching vehicles:", err);
      setError("Failed to load train positions");
    }
  };

  useEffect(() => {
    fetchVehicles();
    const interval = setInterval(fetchVehicles, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Map Container */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
        <div className="relative w-full">
          <Image
            src="/images/map-light.png"
            alt="MBTA Transit Map"
            className="w-full h-auto"
          />

        {/* SVG Overlay for Train Markers and Clickable Stations */}
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 826 770"
          preserveAspectRatio="xMidYMid meet"
          style={{ pointerEvents: "none" }}
        >
          {/* Clickable station areas - rendered first */}
          {Object.entries(STATION_COORDS).map(([stationId, coords]) => (
            <circle
              key={`station-${stationId}`}
              cx={coords.x}
              cy={coords.y}
              r="12"
              fill="transparent"
              className="cursor-pointer hover:fill-white hover:fill-opacity-20 transition-all"
              style={{ pointerEvents: "auto" }}
              onClick={() =>
                setSelectedStation({
                  id: stationId,
                  name: STATION_NAMES[stationId] || stationId,
                })
              }
            />
          ))}

          {/* Animated train markers - rendered on top with higher priority */}
          {trains.map((train) => {
            const isHovered = hoveredTrain?.id === train.id;
            return (
              <g
                key={train.id}
                className="train-marker"
                style={{ pointerEvents: "auto" }}
              >
                {/* Invisible larger circle for hover detection */}
                <circle
                  cx={train.x}
                  cy={train.y}
                  r="15"
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredTrain(train)}
                  onMouseLeave={() => setHoveredTrain(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    const stationEntry = Object.entries(STATION_COORDS).find(
                      ([_, coords]) =>
                        Math.abs(coords.x - train.x) < 8 &&
                        Math.abs(coords.y - train.y) < 8
                    );
                    if (stationEntry) {
                      setSelectedStation({
                        id: stationEntry[0],
                        name: STATION_NAMES[stationEntry[0]] || stationEntry[0],
                      });
                    }
                  }}
                />
                {/* Glow effect */}
                {!isHovered && (
                  <circle
                    cx={train.x}
                    cy={train.y}
                    r="10"
                    fill={train.color}
                    opacity="0.2"
                    style={{ pointerEvents: "none" }}
                    className="animate-pulse"
                  />
                )}
                {/* Outer ring on hover */}
                {isHovered && (
                  <circle
                    cx={train.x}
                    cy={train.y}
                    r="14"
                    fill="none"
                    stroke={train.color}
                    strokeWidth="2"
                    opacity="0.4"
                    style={{ pointerEvents: "none" }}
                  />
                )}
                {/* Main train marker */}
                <circle
                  cx={train.x}
                  cy={train.y}
                  r={isHovered ? "7" : "6"}
                  fill={train.color}
                  stroke="white"
                  strokeWidth={isHovered ? "2.5" : "2"}
                  style={{ pointerEvents: "none" }}
                />
              </g>
            );
          })}
        </svg>

          {/* Tooltip */}
          {hoveredTrain && (() => {
            const xPercent = (hoveredTrain.x / 826) * 100;
            const yPercent = (hoveredTrain.y / 770) * 100;

            // Determine positioning based on location
            let transform = "translate(-50%, -120%)"; // Default: centered above

            // If too far up, show below
            if (yPercent < 20) {
              transform = "translate(-50%, 20%)";
            }
            // If too far left, align to right of point
            else if (xPercent < 15) {
              transform = "translate(10%, -50%)";
            }
            // If too far right, align to left of point
            else if (xPercent > 85) {
              transform = "translate(-110%, -50%)";
            }

            return (
              <div
                className="absolute bg-white px-4 py-3 rounded-xl shadow-2xl border border-gray-300 pointer-events-none min-w-[220px]"
                style={{
                  left: `${xPercent}%`,
                  top: `${yPercent}%`,
                  transform,
                  zIndex: 1000,
                  backgroundColor: "rgba(255, 255, 255, 0.98)",
                  backdropFilter: "blur(8px)",
                }}
              >
                {/* Arrow indicator */}
                <div
                  className="absolute w-3 h-3 bg-white border-gray-300 rotate-45"
                  style={{
                    ...(yPercent < 20
                      ? { top: "-6px", left: "50%", transform: "translateX(-50%) rotate(45deg)", borderTop: "1px solid", borderLeft: "1px solid" }
                      : xPercent < 15
                      ? { left: "-6px", top: "50%", transform: "translateY(-50%) rotate(45deg)", borderBottom: "1px solid", borderLeft: "1px solid" }
                      : xPercent > 85
                      ? { right: "-6px", top: "50%", transform: "translateY(-50%) rotate(45deg)", borderTop: "1px solid", borderRight: "1px solid" }
                      : { bottom: "-6px", left: "50%", transform: "translateX(-50%) rotate(45deg)", borderBottom: "1px solid", borderRight: "1px solid" }),
                  }}
                ></div>
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: hoveredTrain.color,
                    boxShadow: `0 0 8px ${hoveredTrain.color}40`,
                  }}
                ></div>
                <div className="font-bold text-gray-900 text-sm">
                  {hoveredTrain.route} Line
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Train</span>
                  <span className="font-semibold text-gray-900">
                    #{hoveredTrain.label}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Direction</span>
                  <span className="font-medium text-gray-900">
                    {hoveredTrain.direction === 0 ? "Outbound" : "Inbound"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Status</span>
                  <span className="font-medium text-gray-900">
                    {hoveredTrain.currentStatus
                      .replace(/_/g, " ")
                      .toLowerCase()
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </span>
                </div>

                {hoveredTrain.carriages > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Cars</span>
                    <span className="font-medium text-gray-900">
                      {hoveredTrain.carriages}
                    </span>
                  </div>
                )}

                {hoveredTrain.occupancyStatus &&
                  hoveredTrain.occupancyStatus !== "NO_DATA_AVAILABLE" && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Occupancy</span>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded ${
                          hoveredTrain.occupancyStatus === "MANY_SEATS_AVAILABLE"
                            ? "bg-green-100 text-green-700"
                            : hoveredTrain.occupancyStatus === "FEW_SEATS_AVAILABLE"
                            ? "bg-yellow-100 text-yellow-700"
                            : hoveredTrain.occupancyStatus === "STANDING_ROOM_ONLY"
                            ? "bg-orange-100 text-orange-700"
                            : hoveredTrain.occupancyStatus === "FULL"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {hoveredTrain.occupancyStatus
                          .replace(/_/g, " ")
                          .toLowerCase()
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </span>
                    </div>
                  )}

                {hoveredTrain.speed !== null && hoveredTrain.speed > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Speed</span>
                    <span className="font-medium text-gray-900">
                      {hoveredTrain.speed.toFixed(0)} mph
                    </span>
                  </div>
                )}
              </div>

                <div className="text-[10px] text-gray-400 mt-2 pt-2 border-t border-gray-100 text-center">
                  {new Date(hoveredTrain.updatedAt).toLocaleTimeString()}
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Active Trains Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Active Trains</p>
              <p className="text-4xl font-bold text-gray-900">{trains.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🚇</span>
            </div>
          </div>
          {lastUpdate && (
            <p className="text-xs text-gray-400 mt-3">
              Updated {lastUpdate.toLocaleTimeString()}
            </p>
          )}
          {error && (
            <p className="text-xs text-red-600 mt-3 bg-red-50 px-2 py-1 rounded">
              {error}
            </p>
          )}
        </div>

        {/* Legend Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-4">Transit Lines</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full shadow-sm"
                style={{
                  backgroundColor: "#DA291C",
                  boxShadow: "0 0 8px #DA291C40",
                }}
              ></div>
              <span className="text-sm font-medium text-gray-700">Red</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full shadow-sm"
                style={{
                  backgroundColor: "#ED8B00",
                  boxShadow: "0 0 8px #ED8B0040",
                }}
              ></div>
              <span className="text-sm font-medium text-gray-700">Orange</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full shadow-sm"
                style={{
                  backgroundColor: "#003DA5",
                  boxShadow: "0 0 8px #003DA540",
                }}
              ></div>
              <span className="text-sm font-medium text-gray-700">Blue</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full shadow-sm"
                style={{
                  backgroundColor: "#00843D",
                  boxShadow: "0 0 8px #00843D40",
                }}
              ></div>
              <span className="text-sm font-medium text-gray-700">Green</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4 pt-3 border-t border-gray-100">
            Click any station to see arrivals
          </p>
        </div>
      </div>

      {/* Station Predictions Modal */}
      {selectedStation && (
        <StationModal
          stationId={selectedStation.id}
          stationName={selectedStation.name}
          onClose={() => setSelectedStation(null)}
        />
      )}
    </div>
  );
}
