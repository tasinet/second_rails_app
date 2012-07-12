class UserMailer < ActionMailer::Base
  default from: "web-robot@rentapieceofparadise.gr"
  def welcome_email(user)
    @user = user
    @url = "http://derpback.herokuapps.com"
    mail(to: user.email, subject: "Welcome to DerpBack. Ready for plug and play feedback?")
  end
end
