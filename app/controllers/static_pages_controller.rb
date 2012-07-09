class StaticPagesController < ApplicationController
  def home
     if signed_in?
	@confirmed_domains = current_user.domains.where("confirmed='t'")
	@unconfirmed_domains = current_user.domains.where("confirmed='f'")
	@domain = current_user.domains.build 
    end
  end

  def help
  end

  def about
  end

  def contact
  end
end
