class Feedback < ActiveRecord::Base
  attr_accessible :domain_id, :feedback_type, :email, :message, :fbid
  belongs_to :domain
end
