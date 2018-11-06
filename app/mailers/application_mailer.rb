class ApplicationMailer < ActionMailer::Base
  default from: 'mailbot@msgenetics.ucsf.edu'
  layout 'mailer'
end
