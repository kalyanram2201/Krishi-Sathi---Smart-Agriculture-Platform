from flask import Flask, jsonify
import requests
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

API_KEY = os.getenv("OPENWEATHER_API_KEY")
BASE_URL = "https://api.openweathermap.org/data/2.5"

def generate_alerts(weather):
    alerts = []

    if weather["temperature"] >= 35:
        alerts.append({
            "title": "Heat Stress Alert",
            "message": "Increase irrigation and avoid spraying",
            "type": "heat"
        })

    if weather["humidity"] >= 80:
        alerts.append({
            "title": "Fungal Disease Risk",
            "message": "High humidity detected",
            "type": "humidity"
        })

    if weather["wind_speed"] >= 20:
        alerts.append({
            "title": "High Wind Warning",
            "message": "Avoid pesticide spraying",
            "type": "wind"
        })

    if not alerts:
        alerts.append({
            "title": "Normal Conditions",
            "message": "Weather suitable for farming",
            "type": "normal"
        })

    return alerts


@app.route("/api/weather/<city>")
def get_weather(city):
    current = requests.get(
        f"{BASE_URL}/weather",
        params={"q": city, "appid": API_KEY, "units": "metric"}
    ).json()

    forecast = requests.get(
        f"{BASE_URL}/forecast",
        params={"q": city, "appid": API_KEY, "units": "metric"}
    ).json()

    weather_data = {
        "city": current["name"],
        "temperature": round(current["main"]["temp"]),
        "humidity": current["main"]["humidity"],
        "wind_speed": round(current["wind"]["speed"] * 3.6),
        "pressure": current["main"]["pressure"],
        "description": current["weather"][0]["description"],
        "alerts": generate_alerts({
            "temperature": current["main"]["temp"],
            "humidity": current["main"]["humidity"],
            "wind_speed": current["wind"]["speed"] * 3.6
        }),
        "forecast": [
            {
                "day": i,
                "temp": round(item["main"]["temp"]),
                "humidity": item["main"]["humidity"],
                "desc": item["weather"][0]["description"]
            }
            for i, item in enumerate(forecast["list"][::8][:5])
        ]
    }

    return jsonify(weather_data)


if __name__ == "__main__":
    app.run(debug=True)
