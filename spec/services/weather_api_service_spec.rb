require "rails_helper"

RSpec.describe WeatherApiService do
  let(:today) { Date.today.to_s }
  let(:zip_code) { rand(10000..99999) }
  let(:maxtemp_f) { rand(0..120) }
  let(:mintemp_f) { rand(0..120) }
  let(:expected_current_temp) { rand(mintemp_f..maxtemp_f) }
  let(:raw_forecast_data) { [{ "date": today, "day": { "maxtemp_f": maxtemp_f, "mintemp_f": mintemp_f}}]}
  let(:cache_key) { "weather_data_#{zip_code}"}
  let(:forecast_url) { URI("#{WeatherApiService::BASE_URL}/forecast.json?key=#{ENV['WEATHER_API_KEY']}&days=4&q=#{zip_code}") }
  let(:current_temp_url) { URI("#{WeatherApiService::BASE_URL}/current.json?key=#{ENV['WEATHER_API_KEY']}&q=#{zip_code}") }
  let(:memory_store) { ActiveSupport::Cache.lookup_store(:memory_store) }
  
  before do
    allow(Net::HTTP).to receive(:get).with(current_temp_url).and_return(JSON.generate({ current: { temp_f: expected_current_temp }}))
    allow(Net::HTTP).to receive(:get).with(forecast_url).and_return(JSON.generate({ forecast: { forecastday: raw_forecast_data }}))
    allow(Rails).to receive(:cache).and_return(memory_store)
  end

  describe "#weather_result" do
    context "when result is not found in cache" do
      it "returns a WeatherResult object with the correct attributes" do
        allow(Rails.cache).to receive(:fetch)
          .with(cache_key, expires_in: WeatherApiService::CACHE_EXPIRATION).and_yield()

        service = described_class.new(zip_code)
        result = service.weather_result

        expect(result).to be_a(WeatherResult)
        expect(result.cache_hit).to be(false)
        expect(result.current_temperature).to eq(expected_current_temp)
        expect(result.forecasts.count).to eq(raw_forecast_data.count)
        expect(result.forecasts).to all(be_a(DailyForecast))
      end
    end

    context "when result is found in cache" do
      it "returns a WeatherResult object with the correct attributes" do
        allow(Rails.cache).to receive(:fetch)
          .with(cache_key, expires_in: WeatherApiService::CACHE_EXPIRATION)
          .and_return({ current_temperature: expected_current_temp, forecasts: [] })

        service = described_class.new(zip_code)
        result = service.weather_result

        expect(result).to be_a(WeatherResult)
        expect(result.cache_hit).to be(true)
        expect(result.current_temperature).to eq(expected_current_temp)
        expect(result.forecasts).to be_empty
      end
    end
  end
end