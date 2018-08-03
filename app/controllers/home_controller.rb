class HomeController < ApplicationController
  include HomeHelper
  def index

  end

  def accept
    puts accept_request_params.to_json
  end

  def biorepository
    @customer = Customer.new
  end

  def biorepo_data
    @subjects = Subject.all
    # @new_output = process_subjects(@subjects, biorepo_data_params)
    # puts "NEW OUTPUT: #{@new_output.to_json}"
    if biorepo_data_params
     @subjects = filter_subjects(@subjects, biorepo_data_params)
    end
    @output = test1(@subjects)

    render json: @output, status: :ok
  end

  private

    def biorepo_data_params
      params.permit(age_range: [], sex: [], race: [], course: [])
    end

    def accept_request_params
      params.require(:customer).permit(:firstname, :lastname, :email, :institution, :studyname, :studydescription, :irb)
    end
end
