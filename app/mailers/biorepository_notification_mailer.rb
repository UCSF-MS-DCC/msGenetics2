class BiorepositoryNotificationMailer < ApplicationMailer
  def samples_request_notification
    @customer = params[:customer]
    if Rails.env == 'development'
      mail(to: 'adam.renschen@ucsf.edu', subject:"Request for samples information from: #{@customer.email}")
    else
      mail(to: 'biorepository@ucsf.edu, adam.renschen@ucsf.edu', subject:"Request for samples information from: #{@customer.email}")
    end
  end
end
