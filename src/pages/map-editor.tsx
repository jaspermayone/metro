import { STATION_COORDS } from "@/config/stationCoords";
import { Inter } from "next/font/google";
import { useEffect, useRef, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

interface MBTAStop {
  id: string;
  attributes: {
    name: string;
  };
}

interface MappedStation {
  id: string;
  name: string;
  x: number;
  y: number;
  line?: string;
}

const LINES = [
  { id: "Red", name: "Red Line", color: "#DA291C" },
  { id: "Mattapan", name: "Mattapan Trolley", color: "#DA291C" },
  { id: "Orange", name: "Orange Line", color: "#ED8B00" },
  { id: "Blue", name: "Blue Line", color: "#003DA5" },
  { id: "Green-B", name: "Green Line B", color: "#00843D" },
  { id: "Green-C", name: "Green Line C", color: "#00843D" },
  { id: "Green-D", name: "Green Line D", color: "#00843D" },
  { id: "Green-E", name: "Green Line E", color: "#00843D" },
];

export default function MapEditor() {
  // Check if map editing is enabled
  if (process.env.NEXT_PUBLIC_MAP_EDITABLE !== 'true') {
    return (
      <main className={`flex items-center justify-center h-screen ${inter.className} bg-[#0a0a0a]`}>
        <div className="text-center p-6 bg-[#1a1a1a] border border-gray-800 rounded">
          <h1 className="text-2xl font-bold text-white mb-4">Map Editor Disabled</h1>
          <p className="text-gray-400 mb-4">
            The interactive map editor is currently disabled.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition"
          >
            Go Home
          </button>
        </div>
      </main>
    );
  }

  const [selectedLine, setSelectedLine] = useState<string>("Red");
  const [stops, setStops] = useState<MBTAStop[]>([]);
  const [loading, setLoading] = useState(false);
  const [mappedStations, setMappedStations] = useState<MappedStation[]>([]);
  const [selectedStop, setSelectedStop] = useState<MBTAStop | null>(null);
  const [coordinates, setCoordinates] = useState<{ x: number; y: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMappedOnly, setShowMappedOnly] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [isDraggingStation, setIsDraggingStation] = useState(false);
  const [draggedStationId, setDraggedStationId] = useState<string | null>(null);
  const [showLineSelector, setShowLineSelector] = useState(true);
  const [showProgress, setShowProgress] = useState(true);
  const [showSearch, setShowSearch] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const mapWrapperRef = useRef<HTMLDivElement>(null);

  // Fetch stops for selected line
  useEffect(() => {
    fetchStops(selectedLine);
  }, [selectedLine]);

  // Load existing coordinates from stationCoords.ts
  useEffect(() => {
    const existing: MappedStation[] = [];

    Object.entries(STATION_COORDS).forEach(([id, coords]) => {
      // Try to find this station in the current stops list
      const stop = stops.find(s => s.id === id);
      if (stop) {
        existing.push({
          id,
          name: stop.attributes.name,
          x: coords.x,
          y: coords.y,
          line: selectedLine,
        });
      }
    });

    if (existing.length > 0) {
      setMappedStations(prev => {
        // Merge with existing, preferring what's already in state
        const merged = [...prev];
        existing.forEach(station => {
          if (!merged.find(m => m.id === station.id)) {
            merged.push(station);
          }
        });
        return merged;
      });
    }
  }, [stops, selectedLine]);

  const fetchStops = async (line: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api-v3.mbta.com/stops?filter[route]=${line}&fields[stop]=name`
      );
      const data = await response.json();

      const parentStations = data.data.filter((stop: MBTAStop) =>
        stop.id.startsWith("place-")
      );

      setStops(parentStations);
    } catch (error) {
      console.error("Error fetching stops:", error);
      alert("Failed to fetch stops from MBTA API");
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!svgRef.current || !containerRef.current || !selectedStop || isPanning || isDraggingStation) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const svgX = x * 826;
    const svgY = y * 770;

    const coords = {
      x: Math.round(svgX * 10) / 10,
      y: Math.round(svgY * 10) / 10
    };

    setCoordinates(coords);

    const newStation: MappedStation = {
      id: selectedStop.id,
      name: selectedStop.attributes.name,
      x: coords.x,
      y: coords.y,
      line: selectedLine,
    };

    setMappedStations(prev => {
      const filtered = prev.filter(s => s.id !== selectedStop.id);
      return [...filtered, newStation];
    });

    // NO auto-advance - user selects next station manually
  };

  const handleStationMouseDown = (e: React.MouseEvent, stationId: string) => {
    e.stopPropagation();
    setIsDraggingStation(true);
    setDraggedStationId(stationId);

    // Select this station
    const stop = stops.find(s => s.id === stationId);
    if (stop) {
      setSelectedStop(stop);
    }
  };

  const handleStationDrag = (e: React.MouseEvent) => {
    if (!isDraggingStation || !draggedStationId || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const svgX = x * 826;
    const svgY = y * 770;

    const coords = {
      x: Math.round(svgX * 10) / 10,
      y: Math.round(svgY * 10) / 10
    };

    setCoordinates(coords);

    // Update the station position
    setMappedStations(prev => {
      return prev.map(station => {
        if (station.id === draggedStationId) {
          return { ...station, x: coords.x, y: coords.y };
        }
        return station;
      });
    });
  };

  const handleStationMouseUp = () => {
    setIsDraggingStation(false);
    setDraggedStationId(null);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button === 1 || e.button === 2 || (e.button === 0 && e.altKey)) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    } else if (isDraggingStation) {
      handleStationDrag(e);
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    handleStationMouseUp();
  };

  const resetView = () => {
    setPan({ x: 0, y: 0 });
    setZoom(1);
  };

  const handleStopSelect = (stop: MBTAStop) => {
    setSelectedStop(stop);
    const existing = mappedStations.find(s => s.id === stop.id);
    if (existing) {
      setCoordinates({ x: existing.x, y: existing.y });
    } else {
      setCoordinates(null);
    }
  };

  const handleDeleteStation = (id: string) => {
    setMappedStations(prev => prev.filter(s => s.id !== id));
    if (selectedStop?.id === id) {
      setCoordinates(null);
    }
  };

  const adjustCoordinate = (dx: number, dy: number) => {
    if (!coordinates || !selectedStop) return;
    const newCoords = {
      x: Math.round((coordinates.x + dx) * 10) / 10,
      y: Math.round((coordinates.y + dy) * 10) / 10
    };
    setCoordinates(newCoords);

    const newStation: MappedStation = {
      id: selectedStop.id,
      name: selectedStop.attributes.name,
      x: newCoords.x,
      y: newCoords.y,
      line: selectedLine,
    };
    setMappedStations(prev => {
      const filtered = prev.filter(s => s.id !== selectedStop.id);
      return [...filtered, newStation];
    });
  };

  const handleManualCoordinateChange = (axis: 'x' | 'y', value: string) => {
    if (!selectedStop || !coordinates) return;
    const num = parseFloat(value);
    if (isNaN(num)) return;

    const newCoords = {
      ...coordinates,
      [axis]: Math.round(num * 10) / 10
    };
    setCoordinates(newCoords);

    const newStation: MappedStation = {
      id: selectedStop.id,
      name: selectedStop.attributes.name,
      x: newCoords.x,
      y: newCoords.y,
      line: selectedLine,
    };
    setMappedStations(prev => {
      const filtered = prev.filter(s => s.id !== selectedStop.id);
      return [...filtered, newStation];
    });
  };

  const generateCode = () => {
    // Group by line, maintain mapping order within each line
    const byLine: { [key: string]: MappedStation[] } = {};

    mappedStations.forEach(station => {
      const line = station.line || "Other";
      if (!byLine[line]) {
        byLine[line] = [];
      }
      byLine[line].push(station);
    });

    let code = "";

    // Sort line names
    Object.keys(byLine).sort().forEach(lineName => {
      code += `\n  // ${lineName} Line\n`;
      byLine[lineName].forEach(station => {
        code += `  "${station.id}": { x: ${station.x}, y: ${station.y} }, // ${station.name}\n`;
      });
    });

    return code.trim();
  };

  const filteredStops = stops.filter(stop => {
    const matchesSearch = stop.attributes.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         stop.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMapped = !showMappedOnly || mappedStations.some(m => m.id === stop.id);
    return matchesSearch && matchesMapped;
  });

  const lineColor = LINES.find(l => l.id === selectedLine)?.color || "#666";
  const progress = stops.length > 0
    ? Math.round((mappedStations.filter(m => m.line === selectedLine).length / stops.length) * 100)
    : 0;

  return (
    <main className={`flex flex-col h-screen ${inter.className} bg-[#0a0a0a] overflow-hidden`}>
      {/* Header */}
      <div className="bg-[#1a1a1a] border-b border-gray-800 px-6 py-4 flex-shrink-0">
        <div className="max-w-[1800px] mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">
            🗺️ Interactive Station Mapper
          </h1>
          <p className="text-gray-400">
            Select a station, click to place, drag dots to adjust. Hold Alt+drag to pan.
          </p>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Sidebar */}
        <div className="w-80 bg-[#1a1a1a] border-r border-gray-800 flex flex-col overflow-hidden">
          {/* Line Selector */}
          <div className="border-b border-gray-800">
            <button
              onClick={() => setShowLineSelector(!showLineSelector)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-800 transition"
            >
              <span className="text-gray-300 text-sm font-medium">Select Line</span>
              <span className="text-gray-400 text-xs">{showLineSelector ? '▼' : '▶'}</span>
            </button>
            {showLineSelector && (
              <div className="px-4 pb-4 space-y-1">
                {LINES.map(line => (
                  <button
                    key={line.id}
                    onClick={() => setSelectedLine(line.id)}
                    className={`w-full px-3 py-2 rounded text-left text-sm font-medium transition flex items-center gap-2 ${
                      selectedLine === line.id
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-400 hover:bg-gray-800'
                    }`}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: line.color }}
                    />
                    {line.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Progress */}
          <div className="border-b border-gray-800">
            <button
              onClick={() => setShowProgress(!showProgress)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-800 transition"
            >
              <div className="flex items-center gap-2">
                <span className="text-gray-300 text-sm font-medium">Progress</span>
                <span className="text-white text-xs font-bold">{progress}%</span>
              </div>
              <span className="text-gray-400 text-xs">{showProgress ? '▼' : '▶'}</span>
            </button>
            {showProgress && (
              <div className="px-4 pb-4">
                <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: lineColor
                    }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {mappedStations.filter(m => m.line === selectedLine).length} / {stops.length} stations mapped
                </div>
                {Object.keys(STATION_COORDS).length > 0 && (
                  <div className="mt-2 p-2 bg-green-900/20 border border-green-700 rounded text-xs text-green-300">
                    ✓ {Object.keys(STATION_COORDS).length} stations loaded from file
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Search */}
          <div className="border-b border-gray-800">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-800 transition"
            >
              <span className="text-gray-300 text-sm font-medium">Search & Filter</span>
              <span className="text-gray-400 text-xs">{showSearch ? '▼' : '▶'}</span>
            </button>
            {showSearch && (
              <div className="px-4 pb-4 space-y-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search stations..."
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none text-sm"
                />
                <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showMappedOnly}
                    onChange={(e) => setShowMappedOnly(e.target.checked)}
                    className="rounded"
                  />
                  Show mapped only
                </label>
              </div>
            )}
          </div>

          {/* Station List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-400">
                Loading stations...
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {filteredStops.map(stop => {
                  const isMapped = mappedStations.some(s => s.id === stop.id);
                  const isSelected = selectedStop?.id === stop.id;

                  return (
                    <button
                      key={stop.id}
                      onClick={() => handleStopSelect(stop)}
                      className={`w-full px-3 py-2 rounded text-left text-sm transition ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : isMapped
                          ? 'bg-green-900/30 text-green-300 hover:bg-green-900/50'
                          : 'text-gray-300 hover:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{stop.attributes.name}</div>
                          <div className="text-xs opacity-70 font-mono">{stop.id}</div>
                        </div>
                        {isMapped && (
                          <div className="text-green-400">✓</div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-gray-800 space-y-2">
            <button
              onClick={() => {
                // Reload from stationCoords.ts
                const existing: MappedStation[] = [];
                Object.entries(STATION_COORDS).forEach(([id, coords]) => {
                  const stop = stops.find(s => s.id === id);
                  if (stop) {
                    existing.push({
                      id,
                      name: stop.attributes.name,
                      x: coords.x,
                      y: coords.y,
                      line: selectedLine,
                    });
                  }
                });
                setMappedStations(existing);
              }}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition"
            >
              Reload from File
            </button>
            <button
              onClick={() => {
                if (confirm("Clear all mapped stations?")) {
                  setMappedStations([]);
                }
              }}
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Controls */}
          <div className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {selectedStop && coordinates ? (
                  <>
                    <div className="text-white text-sm font-medium">
                      {selectedStop.attributes.name}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.1"
                        value={coordinates.x}
                        onChange={(e) => handleManualCoordinateChange('x', e.target.value)}
                        className="w-20 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-xs text-white"
                        placeholder="X"
                      />
                      <input
                        type="number"
                        step="0.1"
                        value={coordinates.y}
                        onChange={(e) => handleManualCoordinateChange('y', e.target.value)}
                        className="w-20 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-xs text-white"
                        placeholder="Y"
                      />
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => adjustCoordinate(0, -1)} className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-white">↑</button>
                      <button onClick={() => adjustCoordinate(0, 1)} className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-white">↓</button>
                      <button onClick={() => adjustCoordinate(-1, 0)} className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-white">←</button>
                      <button onClick={() => adjustCoordinate(1, 0)} className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-white">→</button>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => adjustCoordinate(0, -0.1)} className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-white" title="Fine up">⇡</button>
                      <button onClick={() => adjustCoordinate(0, 0.1)} className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-white" title="Fine down">⇣</button>
                      <button onClick={() => adjustCoordinate(-0.1, 0)} className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-white" title="Fine left">⇠</button>
                      <button onClick={() => adjustCoordinate(0.1, 0)} className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-white" title="Fine right">⇢</button>
                    </div>
                  </>
                ) : (
                  <div className="text-gray-400 text-sm">
                    ← Select a station from the list
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-xs text-gray-300">
                  <input
                    type="checkbox"
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                    className="rounded"
                  />
                  Grid
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
                    className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-white"
                  >
                    -
                  </button>
                  <span className="text-white text-xs min-w-12 text-center">
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    onClick={() => setZoom(Math.min(3, zoom + 0.25))}
                    className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-white"
                  >
                    +
                  </button>
                  <button
                    onClick={resetView}
                    className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-white"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div
            ref={mapWrapperRef}
            className="flex-1 overflow-hidden bg-[#0a0a0a] relative"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onContextMenu={(e) => e.preventDefault()}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transformOrigin: 'center center',
                  transition: isPanning ? 'none' : 'transform 0.1s ease-out',
                }}
              >
                <div
                  ref={containerRef}
                  className={`relative rounded-lg overflow-hidden border-2 ${
                    selectedStop ? 'border-blue-500' : 'border-gray-800'
                  } ${isPanning ? 'cursor-grabbing' : isDraggingStation ? 'cursor-grabbing' : selectedStop ? 'cursor-crosshair' : 'cursor-grab'}`}
                  onClick={selectedStop && !isPanning && !isDraggingStation ? handleMapClick : undefined}
                  style={{ width: '826px' }}
                >
                  <img
                    src="/images/map-light.png"
                    alt="MBTA Transit Map"
                    className="w-full h-auto block pointer-events-none select-none"
                    draggable={false}
                  />

                  {/* SVG Overlay */}
                  <svg
                    ref={svgRef}
                    className="absolute top-0 left-0 w-full h-full"
                    viewBox="0 0 826 770"
                    preserveAspectRatio="xMidYMid meet"
                    style={{ pointerEvents: 'none' }}
                  >
                    {showGrid && (
                      <g opacity="0.15">
                        {Array.from({ length: 83 }).map((_, i) => (
                          <line
                            key={`v-${i}`}
                            x1={i * 10}
                            y1="0"
                            x2={i * 10}
                            y2="770"
                            stroke="white"
                            strokeWidth={i % 5 === 0 ? 0.5 : 0.25}
                          />
                        ))}
                        {Array.from({ length: 78 }).map((_, i) => (
                          <line
                            key={`h-${i}`}
                            x1="0"
                            y1={i * 10}
                            x2="826"
                            y2={i * 10}
                            stroke="white"
                            strokeWidth={i % 5 === 0 ? 0.5 : 0.25}
                          />
                        ))}
                      </g>
                    )}

                    {mappedStations.map((station) => {
                      const stationLine = LINES.find(l => l.id === station.line);
                      const color = stationLine?.color || "#666";
                      const isSelected = selectedStop?.id === station.id;
                      const isDragging = isDraggingStation && draggedStationId === station.id;

                      return (
                        <g
                          key={station.id}
                          style={{ pointerEvents: 'all', cursor: isDragging ? 'grabbing' : 'grab' }}
                          onMouseDown={(e) => handleStationMouseDown(e as any, station.id)}
                        >
                          <circle
                            cx={station.x}
                            cy={station.y}
                            r={isSelected ? 8 : 6}
                            fill={color}
                            opacity="0.4"
                          />
                          <circle
                            cx={station.x}
                            cy={station.y}
                            r={isSelected ? 4 : 3}
                            fill={color}
                            stroke="white"
                            strokeWidth={isSelected ? 2 : 1.5}
                          />
                          <circle
                            cx={station.x}
                            cy={station.y}
                            r="0.5"
                            fill="white"
                          />
                        </g>
                      );
                    })}

                    {selectedStop && coordinates && (
                      <>
                        <circle
                          cx={coordinates.x}
                          cy={coordinates.y}
                          r="10"
                          fill={lineColor}
                          opacity="0.2"
                        />
                        <circle
                          cx={coordinates.x}
                          cy={coordinates.y}
                          r="4"
                          fill={lineColor}
                          stroke="white"
                          strokeWidth="1.5"
                        />
                        <circle
                          cx={coordinates.x}
                          cy={coordinates.y}
                          r="0.5"
                          fill="white"
                        />
                        <line
                          x1={coordinates.x - 15}
                          y1={coordinates.y}
                          x2={coordinates.x + 15}
                          y2={coordinates.y}
                          stroke="white"
                          strokeWidth="0.5"
                          opacity="0.5"
                        />
                        <line
                          x1={coordinates.x}
                          y1={coordinates.y - 15}
                          x2={coordinates.x}
                          y2={coordinates.y + 15}
                          stroke="white"
                          strokeWidth="0.5"
                          opacity="0.5"
                        />
                      </>
                    )}
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Code Output */}
          {mappedStations.length > 0 && (
            <div className="border-t border-gray-800 bg-[#1a1a1a] p-4 flex-shrink-0">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-white font-bold text-sm">
                  Generated Code ({mappedStations.length} stations)
                </h3>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generateCode());
                    alert("✅ Copied!");
                  }}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs"
                >
                  Copy
                </button>
              </div>
              <pre className="bg-gray-900 p-3 rounded text-green-400 font-mono text-xs overflow-x-auto max-h-24 overflow-y-auto">
                {generateCode()}
              </pre>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
