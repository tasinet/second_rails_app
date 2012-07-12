class AddVerificationTextToDomains < ActiveRecord::Migration
  def change
    add_column :domains, :verification_text, :string
  end
end
