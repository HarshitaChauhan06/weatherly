import React, { useEffect, useState } from "react";
import "./App.css";

import {
  FaCloudSun,
  FaWind,
  FaTint,
  FaTemperatureHigh,
} from "react-icons/fa";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
 Tooltip,
  ResponsiveContainer,
} from "recharts";

const API_KEY = "3bebeb1de93e81d9ae914ac9c2ab27fe";

function App() {
  const [city, setCity] = useState("Gurugram");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [hourly, setHourly] = useState([]);

  // 🌈 Weather Backgrounds
  const weatherBackgrounds = {
    Clear:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=100&w=1920",

    Clouds:
      "https://images.unsplash.com/photo-1499346030926-9a72daac6c63?q=100&w=1920",

    Rain:
      "https://images.unsplash.com/photo-1519692933481-e162a57d6721?q=100&w=1920",

    Drizzle:
      "https://images.unsplash.com/photo-1519692933481-e162a57d6721?q=100&w=1920",

    Thunderstorm:
      "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?q=100&w=1920",

    Snow:
      "https://images.unsplash.com/photo-1517299321609-52687d1bc55a?q=100&w=1920",

    Mist:
      "https://images.unsplash.com/photo-1487621167305-5d248087c724?q=100&w=1920",

    Fog:
      "https://images.unsplash.com/photo-1487621167305-5d248087c724?q=100&w=1920",

    Haze:
      "https://images.unsplash.com/photo-1487621167305-5d248087c724?q=100&w=1920",

    Smoke:
      "https://images.unsplash.com/photo-1487621167305-5d248087c724?q=100&w=1920",

    Dust:
      "https://images.unsplash.com/photo-1487621167305-5d248087c724?q=100&w=1920",
  };

  // 🌤 Fetch Weather
  const getWeather = async () => {
    try {
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      const weatherData = await weatherRes.json();

      setWeather(weatherData);

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );

      const forecastData = await forecastRes.json();

      // 7 Days
      const dailyData = forecastData.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );

      setForecast(dailyData.slice(0, 7));

      // 24 Hours
      setHourly(forecastData.list.slice(0, 24));
    } catch (err) {
      console.log(err);
    }
  };

  // 📍 Auto Location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        const data = await res.json();

        setCity(data.name);
      },
      () => {
        console.log("Location denied");
      }
    );
  }, []);
// eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    getWeather();
  }, [city]);

  const background =
    weatherBackgrounds[weather?.weather?.[0]?.main] ||
    weatherBackgrounds.Clear;

  return (
    <div
      className="app"
      style={{
        backgroundImage: `url(${background})`,
      }}
    >
      <div className="overlay"></div>

      <div className="container">
        {/* Logo */}
        <h1 className="logo">🌈 Weatherly</h1>

        {/* Search */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <button onClick={getWeather}>Search</button>
        </div>

        {/* Main Weather */}
        {weather && weather.main && (
          <>
            <div className="weather-card">
              <div>
                <h2>{weather.name}</h2>

                <h1>{Math.round(weather.main.temp)}°C</h1>

                <p>{weather.weather[0].main}</p>
              </div>

              <div className="details">
                <p>
                  <FaTemperatureHigh /> Feels{" "}
                  {Math.round(weather.main.feels_like)}°
                </p>

                <p>
                  <FaTint /> {weather.main.humidity}%
                </p>

                <p>
                  <FaWind /> {weather.wind.speed} km/h
                </p>
              </div>
            </div>

            {/* Hourly */}
            <div className="section-title">
              24 Hours Forecast
            </div>

            <div className="hourly-container">
              {hourly.map((item, index) => (
                <div className="hour-card" key={index}>
                  <p>
                    {new Date(item.dt_txt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                  <FaCloudSun className="icon" />

                  <h3>{Math.round(item.main.temp)}°</h3>
                </div>
              ))}
            </div>

            {/* Weekly */}
            <div className="section-title">
              7 Day Forecast
            </div>

            <div className="forecast-container">
              {forecast.map((item, index) => (
                <div className="forecast-card" key={index}>
                  <h3>
                    {new Date(item.dt_txt).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "short",
                      }
                    )}
                  </h3>

                  <FaCloudSun className="icon" />

                  <p>{Math.round(item.main.temp)}°C</p>
                </div>
              ))}
            </div>

            {/* Graph */}
            <div className="graph-card">
              <h3>Temperature Graph</h3>

              <ResponsiveContainer
                width="100%"
                height={250}
              >
                <LineChart
                  data={hourly.map((item) => ({
                    time: new Date(
                      item.dt_txt
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                    }),
                    temp: item.main.temp,
                  }))}
                >
                  <XAxis
                    dataKey="time"
                    stroke="#fff"
                  />

                  <YAxis stroke="#fff" />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="temp"
                    stroke="#38bdf8"
                    strokeWidth={4}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;