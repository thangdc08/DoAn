package com.badminton.recommendationservice.client;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
@Slf4j
public class WeatherServiceClient {

    private final RestTemplate restTemplate;

    public WeatherData fetchWeatherData(double lat, double lng) {
        double temperature = 28.0;
        double humidity = 60.0;
        double windSpeed = 8.0;
        double uvIndex = 3.5;
        int aqi = 55;
        double pm25 = 15.0;

        try {
            // 1. Fetch main weather data (Temp, Humidity, Wind, UV Index Max)
            String weatherUrl = String.format(
                "https://api.open-meteo.com/v1/forecast?latitude=%f&longitude=%f&current=temperature_2m,relative_humidity_2m,wind_speed_10m&daily=uv_index_max&timezone=auto",
                lat, lng
            );
            log.info("Fetching weather from Open-Meteo: {}", weatherUrl);
            JsonNode weatherNode = restTemplate.getForObject(weatherUrl, JsonNode.class);
            if (weatherNode != null) {
                JsonNode current = weatherNode.path("current");
                if (!current.isMissingNode()) {
                    temperature = current.path("temperature_2m").asDouble(temperature);
                    humidity = current.path("relative_humidity_2m").asDouble(humidity);
                    windSpeed = current.path("wind_speed_10m").asDouble(windSpeed);
                }
                
                JsonNode daily = weatherNode.path("daily");
                if (!daily.isMissingNode() && daily.path("uv_index_max").isArray() && daily.path("uv_index_max").size() > 0) {
                    uvIndex = daily.path("uv_index_max").get(0).asDouble(uvIndex);
                }
            }
        } catch (Exception e) {
            log.error("Failed to fetch weather from Open-Meteo Weather API: {}, using fallback values", e.getMessage());
        }

        try {
            // 2. Fetch air quality data (AQI, PM2.5)
            String aqUrl = String.format(
                "https://air-quality-api.open-meteo.com/v1/air-quality?latitude=%f&longitude=%f&current=us_aqi,pm2_5",
                lat, lng
            );
            log.info("Fetching air quality from Open-Meteo: {}", aqUrl);
            JsonNode aqNode = restTemplate.getForObject(aqUrl, JsonNode.class);
            if (aqNode != null) {
                JsonNode current = aqNode.path("current");
                if (!current.isMissingNode()) {
                    aqi = current.path("us_aqi").asInt(aqi);
                    pm25 = current.path("pm2_5").asDouble(pm25);
                }
            }
        } catch (Exception e) {
            log.error("Failed to fetch air quality from Open-Meteo Air Quality API: {}, using fallback values", e.getMessage());
        }

        return new WeatherData(temperature, humidity, windSpeed, uvIndex, aqi, pm25);
    }

    @lombok.Value
    public static class WeatherData {
        double temperature;
        double humidity;
        double windSpeed;
        double uvIndex;
        int aqi;
        double pm25;
    }
}
