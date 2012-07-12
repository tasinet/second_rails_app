class Feedback < ActiveRecord::Base
  attr_accessible :domain_id, :feedback_type, :email, :message, :fbid, :client_ip
  belongs_to :domain
end
