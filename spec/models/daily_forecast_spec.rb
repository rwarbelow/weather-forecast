require 'rails_helper'

RSpec.describe DailyForecast do
  describe '#initialize' do
    it 'initializes with correct attributes' do
      forecast_data = {
        date: '2024-12-27',
        high: '35',
        low: '20'
      }
      
      daily_forecast = DailyForecast.new(
        date: forecast_data[:date], 
        high: forecast_data[:high], 
        low: forecast_data[:low]
      )
      
      forecast_data.each do |key, value|
        expect(daily_forecast.send(key)).to eq(value)
      end
    end
  end
end