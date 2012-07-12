class AddIpToFeedback < ActiveRecord::Migration
  def change
    add_column :feedbacks, :client_ip, :string
  end
end
