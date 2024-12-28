require 'rails_helper'

RSpec.describe WeatherResult do
  let(:zip_code) { rand(10000..99999)}
  let(:current_temperature) { rand(0..120)}
  let(:forecast) { DailyForecast.new(date: Date.today.to_s, high: current_temperature + 2, low: current_temperature - 2) }

  describe '#initialize' do
    it 'initializes with correct attributes' do
      result_data = {
        zip_code: zip_code,
        cache_hit: true,
        current_temperature: current_temperature,
        forecasts: [forecast]
      }
      
      weather_result = described_class.new(
        zip_code: zip_code, 
        cache_hit: result_data[:cache_hit], 
        current_temperature: current_temperature,
        forecasts: [forecast]
      )
      
      result_data.each do |key, value|
        expect(weather_result.send(key)).to eq(value)
      end
      
      expect(weather_result.forecasts).to all(be_a(DailyForecast))
    end
  end
end