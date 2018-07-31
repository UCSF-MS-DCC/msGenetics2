class HomeController < ApplicationController
  include HomeHelper
  def index

  end

  def biorepository

  end

  def biorepo_data
    @subjects = Subject.all

    if biorepo_data_params[:age_range] || biorepo_data_params[:sex] || biorepo_data_params[:race] || biorepo_data_params[:course]
      @subjects = filter_subjects(@subjects, biorepo_data_params)
    end

    @output = test1(@subjects)

    render json: @output, status: :ok
  end

  private

    def biorepo_data_params
      params.permit(:format, age_range: [], sex: [], race: [], course: [])
    end
end
