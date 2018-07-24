class HomeController < ApplicationController
  include HomeHelper
  def index

  end

  def biorepository

  end

  def biorepo_data
    @output = test1(Subject.all)
    render json: @output, status: :ok
  end
end
