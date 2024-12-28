require 'rails_helper'

RSpec.describe ForecastController do
  describe "GET index" do
    let(:weather_result) { instance_double(WeatherResult) }
    context "when zip_code is not in params" do
      it "does not assign @weather_result but renders index" do
        get :index
        expect(assigns(:weather_result)).to eq(nil)
        expect(response).to render_template("index")
      end
    end
    context "when zip_code is in params" do
      it "assigns @weather_result and renders index" do
        allow_any_instance_of(WeatherApiService).to receive(:weather_result).and_return(weather_result)
        get :index, params: { zip_code: rand(10000..99999) }
        expect(assigns(:weather_result)).to eq(weather_result)
        expect(response).to render_template("index")
      end
    end
  end
end