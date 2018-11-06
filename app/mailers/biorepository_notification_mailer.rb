class BiorepositoryNotificationMailer < ApplicationMailer
  def samples_request_notification
    @customer = params[:customer]
    mail(to: 'adam.renschen@ucsf.edu', subject:"Request for samples information from: <%= @customer.email %>")
  end
end
