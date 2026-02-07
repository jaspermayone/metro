import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const apiKey = process.env.MBTA_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    const response = await axios.get("https://api-v3.mbta.com/vehicles", {
      params: {
        "api_key": apiKey,
        "filter[route_type]": "0,1", // 0=Light Rail (Green), 1=Heavy Rail (Red/Orange/Blue)
        "include": "route,stop,trip",
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ error: "Failed to fetch vehicle data" });
  }
}
