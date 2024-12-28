class ForecastController < ApplicationController
  def index
    zip_code = params[:zip_code]
    if zip_code.present?
      @weather_result = WeatherApiService.new(zip_code).weather_result
    end
  end
end
