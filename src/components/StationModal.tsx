import React, { useEffect, useState } from "react";
import { Prediction, PredictionsResponse, Route, Trip } from "@/types/mbta";

interface StationModalProps {
  stationId: string;
  stationName: string;
  onClose: () => void;
}

interface PredictionDisplay {
  routeName: string;
  routeColor: string;
  headsign: string;
  direction: string;
  arrivalTime: Date | null;
  minutesAway: number | null;
  status: string | null;
}

export default function StationModal({
  stationId,
  stationName,
  onClose,
}: StationModalProps) {
  const [predictions, setPredictions] = useState<PredictionDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPredictions();
    const interval = setInterval(fetchPredictions, 30000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stationId]);

  const fetchPredictions = async () => {
    try {
      const response = await fetch(`/api/predictions?stop=${stationId}`);
      if (!response.ok) throw new Error("Failed to fetch predictions");

      const data: PredictionsResponse = await response.json();

      const routeMap = new Map<string, Route>();
      const tripMap = new Map<string, Trip>();
      data.included?.forEach((item) => {
        if (item.type === "route") {
          routeMap.set(item.id, item as Route);
        } else if (item.type === "trip") {
          tripMap.set(item.id, item as Trip);
        }
      });

      const processedPredictions: PredictionDisplay[] = data.data
        .map((pred: Prediction) => {
          const route = routeMap.get(pred.relationships.route.data.id);
          const trip = pred.relationships.trip?.data
            ? tripMap.get(pred.relationships.trip.data.id)
            : null;

          const arrivalTime = pred.attributes.arrival_time
            ? new Date(pred.attributes.arrival_time)
            : null;

          const minutesAway = arrivalTime
            ? Math.round((arrivalTime.getTime() - Date.now()) / 60000)
            : null;

          let routeName = route?.attributes.long_name || "";
          if (routeName.includes("Red")) routeName = "Red";
          else if (routeName.includes("Orange")) routeName = "Orange";
          else if (routeName.includes("Blue")) routeName = "Blue";
          else if (routeName.includes("Green")) {
            const routeId = pred.relationships.route.data.id;
            if (routeId.includes("-")) routeName = routeId;
            else routeName = "Green";
          }

          return {
            routeName,
            routeColor: route?.attributes.color
              ? `#${route.attributes.color}`
              : "#666",
            headsign: trip?.attributes.headsign || "Unknown",
            direction:
              pred.attributes.direction_id === 0 ? "Outbound" : "Inbound",
            arrivalTime,
            minutesAway,
            status: pred.attributes.status,
          };
        })
        .filter((pred) => pred.minutesAway !== null && pred.minutesAway >= 0)
        .sort((a, b) => (a.minutesAway || 0) - (b.minutesAway || 0));

      setPredictions(processedPredictions);
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error("Error fetching predictions:", err);
      setError("Failed to load arrival predictions");
      setLoading(false);
    }
  };

  // Group predictions by route
  const groupedPredictions = predictions.reduce((acc, pred) => {
    const key = `${pred.routeName}-${pred.direction}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(pred);
    return acc;
  }, {} as { [key: string]: PredictionDisplay[] });

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden transform transition-all animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">
                {stationName}
              </h2>
              <p className="text-gray-400 text-sm">Live Arrivals</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-all text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 backdrop-blur-sm"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Decorative line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)] bg-gray-50">
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 font-medium">Loading arrivals...</p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="text-6xl mb-4">⚠️</div>
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          )}

          {!loading && !error && predictions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="text-6xl mb-4">🚇</div>
              <p className="text-gray-600 font-medium text-lg">No upcoming trains</p>
              <p className="text-gray-500 text-sm mt-2">Check back later</p>
            </div>
          )}

          {!loading && !error && predictions.length > 0 && (
            <div className="space-y-4">
              {Object.entries(groupedPredictions).map(([key, preds]) => {
                const firstPred = preds[0];
                return (
                  <div
                    key={key}
                    className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all"
                  >
                    {/* Route header */}
                    <div
                      className="px-5 py-3 flex items-center gap-3 border-l-4"
                      style={{ borderLeftColor: firstPred.routeColor }}
                    >
                      <div
                        className="w-3 h-3 rounded-full shadow-lg"
                        style={{
                          backgroundColor: firstPred.routeColor,
                          boxShadow: `0 0 12px ${firstPred.routeColor}60`,
                        }}
                      ></div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-900 text-lg">
                          {firstPred.routeName} Line
                        </div>
                        <div className="text-sm text-gray-600">
                          {firstPred.direction}
                        </div>
                      </div>
                    </div>

                    {/* Predictions list */}
                    <div className="divide-y divide-gray-100">
                      {preds.map((pred, idx) => (
                        <div
                          key={idx}
                          className="px-5 py-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
                        >
                          <div className="flex-1 min-w-0 pr-4">
                            <div className="font-semibold text-gray-900 truncate text-base">
                              {pred.headsign}
                            </div>
                            {pred.status && (
                              <div className="text-xs text-orange-600 font-medium mt-1 bg-orange-50 inline-block px-2 py-0.5 rounded">
                                {pred.status}
                              </div>
                            )}
                          </div>

                          <div className="text-right flex-shrink-0">
                            {pred.minutesAway !== null && (
                              <>
                                <div
                                  className={`text-4xl font-black leading-none mb-1 ${
                                    pred.minutesAway === 0
                                      ? "text-green-600 animate-pulse"
                                      : pred.minutesAway <= 1
                                      ? "text-green-600"
                                      : pred.minutesAway <= 5
                                      ? "text-yellow-600"
                                      : pred.minutesAway <= 10
                                      ? "text-orange-600"
                                      : "text-gray-900"
                                  }`}
                                >
                                  {pred.minutesAway === 0
                                    ? "BRD"
                                    : pred.minutesAway}
                                </div>
                                {pred.minutesAway > 0 && (
                                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                                    min
                                  </div>
                                )}
                                {pred.minutesAway === 0 && (
                                  <div className="text-xs text-green-600 font-bold uppercase tracking-wide">
                                    Boarding
                                  </div>
                                )}
                              </>
                            )}
                            {pred.arrivalTime && (
                              <div className="text-xs text-gray-500 mt-1">
                                {pred.arrivalTime.toLocaleTimeString([], {
                                  hour: "numeric",
                                  minute: "2-digit",
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer info */}
          {!loading && !error && predictions.length > 0 && (
            <div className="mt-6 text-center text-xs text-gray-500">
              Updates every 30 seconds • Real-time MBTA data
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
