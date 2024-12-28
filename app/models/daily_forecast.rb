class DailyForecast
  attr_reader :date, :high, :low
  
  def initialize(date:, high:, low:)
    @date = date
    @high = high
    @low = low
  end
end