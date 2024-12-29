require 'net/http'

class WeatherApiService
  BASE_URL = "http://api.weatherapi.com/v1"
  CACHE_EXPIRATION = 30.minutes

  def initialize(zip_code)
    @zip_code = zip_code
  end

  def weather_result
    data = fetch_weather_data
    WeatherResult.new(
      cache_hit: data[:cache_hit],
      zip_code: @zip_code,
      current_temperature: data[:current_temperature],
      forecasts: data[:forecasts]
    )
  end

  private
  
  def fetch_weather_data
    cache_hit = true
    cache_key = "weather_data_#{@zip_code}"
    weather_result = Rails.cache.fetch(cache_key, expires_in: CACHE_EXPIRATION) do
      cache_hit = false
      { current_temperature: get_current_temperature, forecasts: get_forecasts }
    end
    weather_result.merge(cache_hit: cache_hit)
  end

  def get_current_temperature
    make_request(api_name: "current").dig("current", "temp_f") || nil
  end

  def get_forecasts(days: 4)
    forecast_data = make_request(api_name: "forecast", query_params: { days: days }).dig("forecast", "forecastday") || []
    make_daily_forecasts(forecast_data)
  end

  def make_daily_forecasts(forecast_data)
    forecast_data.map do |day|
      DailyForecast.new(date: day["date"], high: day["day"]["maxtemp_f"], low: day["day"]["mintemp_f"])
    end
  end

  def make_request(api_name:, query_params: {})
    query_params.merge!(q: @zip_code)
    url = URI("#{BASE_URL}/#{api_name}.json?key=#{ENV['WEATHER_API_KEY']}&#{query_params.to_query}")
    response = Net::HTTP.get(url)
    JSON.parse(response)
  end
end