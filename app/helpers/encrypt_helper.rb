module EncryptHelper
  SITE_SALT='xkm,jLKAS078!$\SA}{aj)(<F6>&YF!'
  def sha256(text)
        @text = ActiveSupport::Base64.encode64s(text)
        digest = OpenSSL::Digest::Digest.new('sha1')
        OpenSSL::HMAC.hexdigest(digest, SITE_SALT, @text)
  end
  def randomString(len)
	len = 64 if len.nil?
	s=""
	for i in 0..len
		x = rand 26
		x+=65
		x = x.chr
		s+=x
	end
	s
  end
end
