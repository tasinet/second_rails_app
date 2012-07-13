class Feedback < ActiveRecord::Base
  attr_accessible :domain_id, :feedback_type, :email, :message, :fbid, :client_ip
  belongs_to :domain
  
  validates :domain_id, presence: true
  validates :message, presence: true
  validates :client_ip, presence: true
  
  default_scope order: 'feedbacks.created_at DESC'
end
