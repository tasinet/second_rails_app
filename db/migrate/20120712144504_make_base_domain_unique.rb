class MakeBaseDomainUnique < ActiveRecord::Migration
  def change
    add_index :domains, :base_domain, :unique => true
  end
end
