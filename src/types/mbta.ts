export interface Vehicle {
  id: string;
  type: "vehicle";
  attributes: {
    bearing?: number;
    current_status: string;
    current_stop_sequence?: number;
    direction_id: 0 | 1;
    label: string;
    latitude: number;
    longitude: number;
    speed?: number;
    updated_at: string;
  };
  relationships: {
    route: {
      data: {
        id: string;
        type: "route";
      };
    };
    stop?: {
      data: {
        id: string;
        type: "stop";
      };
    };
    trip?: {
      data: {
        id: string;
        type: "trip";
      };
    };
  };
}

export interface Route {
  id: string;
  type: "route";
  attributes: {
    color: string;
    description: string;
    direction_destinations: string[];
    direction_names: string[];
    long_name: string;
    short_name: string;
    sort_order: number;
    text_color: string;
    type: number;
  };
}

export interface VehiclesResponse {
  data: Vehicle[];
  included?: Array<Route | any>;
}

export interface RouteColors {
  [key: string]: string;
}

export interface Prediction {
  id: string;
  type: "prediction";
  attributes: {
    arrival_time: string | null;
    departure_time: string | null;
    direction_id: 0 | 1;
    status: string | null;
    stop_sequence: number;
  };
  relationships: {
    route: {
      data: {
        id: string;
        type: "route";
      };
    };
    trip?: {
      data: {
        id: string;
        type: "trip";
      };
    };
    stop: {
      data: {
        id: string;
        type: "stop";
      };
    };
  };
}

export interface Trip {
  id: string;
  type: "trip";
  attributes: {
    headsign: string;
    direction_id: 0 | 1;
    name: string;
  };
}

export interface PredictionsResponse {
  data: Prediction[];
  included?: Array<Route | Trip | any>;
}
