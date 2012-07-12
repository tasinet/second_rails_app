class CreateFeedbacks < ActiveRecord::Migration
  def change
    create_table :feedbacks do |t|
      t.integer :domain_id
      t.string :type
      t.string :email
      t.string :message
      t.string :fbid

      t.timestamps
    end
  end
end
