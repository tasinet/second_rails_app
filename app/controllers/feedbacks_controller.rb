class FeedbacksController < ApplicationController
  before_filter :signed_in_user, only: [:index, :edit, :update, :destroy, :show]
  before_filter :correct_user,   only: [:edit, :update, :show]

  def destroy
    @feedback = Feedback.find_by_id(params[:id])
    if current_user?(@feedback.domain.user)
      @domain = @feedback.domain
      @feedback.destroy
      flash[:success] = "Feedback successfully deleted"
      redirect_back_or @domain
    else
      flash[:error] = "Feedback not found or not owned by you"
      redirect_back_or root_path
    end
  end

end
