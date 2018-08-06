class BiorepositoryNotificationMailer < ApplicationMailer
  def samples_request_notification
    @customer = params[:customer]
    mail(to: @customer.email, subject:"Request for samples information")
  end
end
