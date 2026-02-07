import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const MBTA_API_KEY = process.env.MBTA_API_KEY;
const MBTA_API_BASE = "https://api-v3.mbta.com";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { stop } = req.query;

  if (!stop || typeof stop !== "string") {
    return res.status(400).json({ error: "Stop ID is required" });
  }

  try {
    const response = await axios.get(`${MBTA_API_BASE}/predictions`, {
      params: {
        "filter[stop]": stop,
        include: "route,trip",
        api_key: MBTA_API_KEY,
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching predictions:", error);
    res.status(500).json({ error: "Failed to fetch predictions" });
  }
}
