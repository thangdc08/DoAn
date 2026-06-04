package com.badminton.recommendationservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeatherRecommendationResponse {
    private double temperature;
    private double humidity;
    private double windSpeed;
    private double uvIndex;
    private int aqi;
    private double pm25;
    private int score;
    private String status;
    private String advice;
}
