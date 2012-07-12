class Fixfeedbacktype < ActiveRecord::Migration
  def change
    rename_column :feedbacks, :type, :feedback_type
  end
end
