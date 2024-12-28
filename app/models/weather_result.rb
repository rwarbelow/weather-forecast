class WeatherResult
  attr_reader :zip_code, :cache_hit, :current_temperature, :forecasts

  def initialize(zip_code:, cache_hit:, current_temperature:, forecasts:)
    @zip_code = zip_code
    @cache_hit = cache_hit
    @current_temperature = current_temperature
    @forecasts = forecasts
  end
end