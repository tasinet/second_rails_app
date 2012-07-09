class Domain < ActiveRecord::Base
  attr_accessible :base_domain
  belongs_to :user
  
  validates :user_id, presence: true

  VALID_DOMAIN_REGEX  = /\A[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,6}\z/ix
  validates :base_domain, presence: true, format: { with: VALID_DOMAIN_REGEX }

  def confirmed?
	self.confirmed==true
  end
end
