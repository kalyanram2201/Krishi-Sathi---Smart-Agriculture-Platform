import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Sun,
  Cloud,
  CloudRain,
  Thermometer,
  Droplets,
  Wind,
  Eye,
  MapPin,
} from "lucide-react";

const BACKEND_URL = "http://localhost:5000"; // change when deployed

const Weather = () => {
  const [city, setCity] = useState("Delhi");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------------- FETCH FROM BACKEND ---------------- */

  const fetchWeather = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${BACKEND_URL}/api/weather/${city}`
      );
      setWeather(res.data);
      setError("");
    } catch (err) {
      setError("Unable to fetch real-time weather data");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- REAL-TIME POLLING ---------------- */

  useEffect(() => {
    fetchWeather();

    const interval = setInterval(() => {
      fetchWeather();
    }, 60000); // every 60 seconds (real-time)

    return () => clearInterval(interval);
  }, [city]);

  /* ---------------- ICON HELPER ---------------- */

  const getIcon = (desc) => {
    if (!desc) return Cloud;
    if (desc.includes("rain")) return CloudRain;
    if (desc.includes("cloud")) return Cloud;
    return Sun;
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
      <div className="max-w-6xl mx-auto px-4">

        <h1 className="text-3xl font-bold text-center mb-6">
          Real-Time Weather & Farm Alerts
        </h1>

        {/* SEARCH */}
        <div className="max-w-md mx-auto mb-6 flex gap-2">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city"
              className="w-full pl-10 py-2 border rounded-lg"
            />
          </div>
        </div>

        {error && (
          <div className="text-center text-red-600 mb-4">{error}</div>
        )}

        {/* WEATHER CARD */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <motion.div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
            {loading ? (
              <div className="text-center">Loading real-time data...</div>
            ) : weather && (
              <>
                <div className="flex justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">{weather.city}</h2>
                    <p className="capitalize text-gray-600">
                      {weather.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-orange-500">
                      {weather.temperature}°C
                    </div>
                    {React.createElement(getIcon(weather.description), {
                      className: "h-10 w-10 text-blue-500 ml-auto",
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-blue-50 p-3 rounded">
                    <Droplets className="mx-auto mb-1 text-blue-600" />
                    {weather.humidity}%<br />Humidity
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <Wind className="mx-auto mb-1 text-green-600" />
                    {weather.wind_speed} km/h<br />Wind
                  </div>
                  <div className="bg-purple-50 p-3 rounded">
                    <Eye className="mx-auto mb-1 text-purple-600" />
                    {weather.visibility ?? "--"} km<br />Visibility
                  </div>
                  <div className="bg-orange-50 p-3 rounded">
                    <Thermometer className="mx-auto mb-1 text-orange-600" />
                    {weather.pressure} hPa<br />Pressure
                  </div>
                </div>
              </>
            )}
          </motion.div>

          {/* ALERTS */}
          <motion.div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Farm Alerts</h2>

            {weather?.alerts?.map((alert, i) => (
              <div
                key={i}
                className="mb-3 p-3 bg-yellow-50 border-l-4 border-yellow-500"
              >
                <h3 className="font-medium">{alert.title}</h3>
                <p className="text-sm">{alert.message}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* FORECAST */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">5-Day Forecast</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {weather?.forecast?.map((d, i) => (
              <div key={i} className="bg-gray-50 p-4 rounded text-center">
                <div className="font-medium">Day {i + 1}</div>
                <div className="capitalize text-sm">{d.desc}</div>
                <div className="font-semibold">{d.temp}°C</div>
                <div className="text-xs">💧 {d.humidity}%</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Weather;
