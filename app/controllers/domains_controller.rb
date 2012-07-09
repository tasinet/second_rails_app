class DomainsController < ApplicationController
  before_filter :signed_in_user, only: [:create, :destroy]
  before_filter :correct_user, only: :destroy

  def create 
    @domain = current_user.domains.build(params[:domain])
    if @domain.save
	puts 'saved successfully'
      flash[:success] = "Domain accepted. You still need to verify, though."
      redirect_to root_path
    else
       @confirmed_domains = current_user.domains.where("confirmed='t'")
       @unconfirmed_domains = current_user.domains.where("confirmed='f'")
      render 'static_pages/home'
    end
  end

  def verify
	puts 'verify'
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
