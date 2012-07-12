class DomainsController < ApplicationController
  include EncryptHelper 
  include UrlHelper
  before_filter :signed_in_user, only: [:create, :destroy]
  before_filter :correct_user, only: :destroy

  def show
    @domain = current_user.domains.find_by_id(params[:id])
    @feedback = @domain.feedbacks
  end

  def create 
    @domain = current_user.domains.build(params[:domain])
    @domain.verification_text = randomString 64
    if @domain.valid? && @domain.save
      flash[:success] = "Domain accepted. You still need to verify, though."
      redirect_to root_path
    else
       @confirmed_domains = current_user.domains.where("confirmed='t'")
       @unconfirmed_domains = current_user.domains.where("confirmed='f'")
       render 'static_pages/home'
    end
  end

  def update
    @user = current_user
    @domain = @user.domains.find_by_id(params[:id])
    if @domain.nil?
	flash[:error]="You do not own this domain"
        redirect_to root_path
    end
    if params[:download]
	data = @domain.verification_text
	send_data data, :type => 'text/html', :x_sendfile => true, :filename => @domain.confirmation_url
    end
    if params[:confirm]
	require "open-uri"
	if get_url('http://'+@domain.confirmation_url(1)) == @domain.verification_text
           flash[:success]="Domain verified! You can delete the verification file, as it is no longer needed."
	   @domain.confirmed=true;
	   @domain.save
	   redirect_to root_path
	else
	   flash.now[:error] = "URL did not match verification text. Please copy the file exactly."
	end
    end
  end

  def add_feedback
    @domain = Domain.find_by_id params[:feedback][:domain_id] if !params[:feedback][:domain_id].nil?
    if (@domain.nil?)
	flash[:error] = "Domain not found!"
	redirect_to root_path
    end
    @feedback = @domain.feedbacks.build(params[:feedback])
    if @feedback.save
	    flash[:success] = "Thanks!"
	    redirect_to root_path
    end
  end

  def destroy
    domain_name = @domain.base_domain
    @domain.destroy
    flash[:notify] = domain_name+" was deleted."
    redirect_to root_path
  end

  private

    def correct_user
      @domain = current_user.domains.find_by_id(params[:id])
      redirect_to root_path if @domain.nil?
    end 

end
