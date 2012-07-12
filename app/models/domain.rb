class Domain < ActiveRecord::Base
  include EncryptHelper
  attr_accessible :base_domain
  belongs_to :user
  has_many :feedbacks, dependent: :destroy
  
  validates :user_id, presence: true
  validates :verification_text, presence: true, length: { minimum: 8 }

  VALID_DOMAIN_REGEX  = /\A[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,6}\z/ix
  validates :base_domain, presence: true, format: { with: VALID_DOMAIN_REGEX },
		uniqueness: { case_sensitive: false }

  def confirmation_url(full=false)
	s=""
   	s = self.base_domain+'/' if full
        s+=sha256(self.base_domain+'odmainpepp3r') + '.html'
	s
  end

  def confirmed?
	self.confirmed==true
  end
end
