import express from "express";
import fetch from "node-fetch"; // No need for authentication if API is open

const app = express();
const PORT = process.env.PORT || 5000;

// CORS middleware to allow frontend requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Allow all origins (change in production)
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Proxy route
app.get("/api/proxy", async (req, res) => {
  try {
    const externalApiUrl = "https://api.jsonserve.com/Uw5CrX"; 

    const response = await fetch(externalApiUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0", // Mimic browser request
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Error fetching data from API" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
