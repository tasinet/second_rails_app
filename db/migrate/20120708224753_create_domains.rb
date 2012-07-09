class CreateDomains < ActiveRecord::Migration
  def change
    create_table :domains do |t|
      t.string :base_domain
      t.integer :user_id
      t.boolean :confirmed, default: false

      t.timestamps
    end
  end
end
