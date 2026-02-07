import React, { useEffect, useState } from "react";
import { Vehicle, VehiclesResponse, Route } from "@/types/mbta";
import { STATION_COORDS } from "@/config/stationCoords";

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

export default function TransitMap() {
  const [trains, setTrains] = useState<TrainPosition[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hoveredTrain, setHoveredTrain] = useState<TrainPosition | null>(null);

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
      const positions: TrainPosition[] = data.data
        .map((vehicle: Vehicle) => {
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
              occupancyStatus: vehicle.attributes.occupancy_status,
              currentStatus: vehicle.attributes.current_status || "UNKNOWN",
              speed: vehicle.attributes.speed,
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
    <div className="relative">
      {/* Static Map Background */}
      <div className="relative w-full">
        <img
          src="/images/map-light.png"
          alt="MBTA Transit Map"
          className="w-full h-auto"
        />

        {/* SVG Overlay for Train Markers */}
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 826 770"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Animated train markers */}
          {trains.map((train) => (
            <g
              key={train.id}
              className="train-marker animate-pulse cursor-pointer"
              onMouseEnter={() => setHoveredTrain(train)}
              onMouseLeave={() => setHoveredTrain(null)}
              style={{ pointerEvents: "all" }}
            >
              <circle
                cx={train.x}
                cy={train.y}
                r={hoveredTrain?.id === train.id ? "8" : "6"}
                fill={train.color}
                stroke="white"
                strokeWidth="2"
                opacity="0.9"
              />
              <circle
                cx={train.x}
                cy={train.y}
                r={hoveredTrain?.id === train.id ? "12" : "10"}
                fill={train.color}
                opacity="0.3"
              />
            </g>
          ))}
        </svg>

        {/* Tooltip */}
        {hoveredTrain && (
          <div
            className="absolute bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg border border-gray-700 pointer-events-none z-10 min-w-[200px]"
            style={{
              left: `${(hoveredTrain.x / 826) * 100}%`,
              top: `${(hoveredTrain.y / 770) * 100}%`,
              transform: "translate(-50%, -120%)",
            }}
          >
            <div className="text-sm font-bold mb-1" style={{ color: hoveredTrain.color }}>
              {hoveredTrain.route} Line - Train {hoveredTrain.label}
            </div>

            <div className="text-xs space-y-0.5">
              <div className="flex justify-between">
                <span className="text-gray-400">Direction:</span>
                <span className="text-gray-200">
                  {hoveredTrain.direction === 0 ? "Outbound" : "Inbound"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Carriages:</span>
                <span className="text-gray-200">{hoveredTrain.carriages}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className="text-gray-200">
                  {hoveredTrain.currentStatus.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </div>

              {hoveredTrain.occupancyStatus && hoveredTrain.occupancyStatus !== "NO_DATA_AVAILABLE" && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Occupancy:</span>
                  <span className={`text-xs font-medium ${
                    hoveredTrain.occupancyStatus === "MANY_SEATS_AVAILABLE" ? "text-green-400" :
                    hoveredTrain.occupancyStatus === "FEW_SEATS_AVAILABLE" ? "text-yellow-400" :
                    hoveredTrain.occupancyStatus === "STANDING_ROOM_ONLY" ? "text-orange-400" :
                    hoveredTrain.occupancyStatus === "FULL" ? "text-red-400" :
                    "text-gray-400"
                  }`}>
                    {hoveredTrain.occupancyStatus.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
              )}

              {hoveredTrain.speed !== null && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Speed:</span>
                  <span className="text-gray-200">{hoveredTrain.speed.toFixed(1)} mph</span>
                </div>
              )}

              <div className="text-gray-500 text-[10px] mt-1 pt-1 border-t border-gray-700">
                Updated {new Date(hoveredTrain.updatedAt).toLocaleTimeString()}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="mt-4 p-4 bg-gray-800 rounded-lg text-white">
        <div className="flex justify-between items-center">
          <div>
            <span className="font-bold">{trains.length}</span> trains active
          </div>
          {lastUpdate && (
            <div className="text-sm text-gray-400">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
          )}
          {error && (
            <div className="text-sm text-red-400">{error}</div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-3 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#DA291C]"></div>
            <span>Red Line</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#ED8B00]"></div>
            <span>Orange Line</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#003DA5]"></div>
            <span>Blue Line</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#00843D]"></div>
            <span>Green Line</span>
          </div>
        </div>
      </div>
    </div>
  );
}
