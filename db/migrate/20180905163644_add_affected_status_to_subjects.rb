class AddAffectedStatusToSubjects < ActiveRecord::Migration[5.2]
  def change
    add_column :subjects, :affected_status, :string
  end
end
