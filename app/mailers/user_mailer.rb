class UserMailer < ActionMailer::Base
  default from: "web-robot@rentapieceofparadise.gr"
  def welcome_email(user)
    @user = user
    @url = "http://derpback.herokuapps.com"
    mail(to: user.email, subject: "Welcome to DerpBack. Ready for plug and play feedback?")
  end
  def feedback_email(feedback)
    @f = feedback
    mail(to: @f.domain.user.email, subject: @f.domain.base_domain+" feedback received, type: "+@f.feedback_type)
  end
end
