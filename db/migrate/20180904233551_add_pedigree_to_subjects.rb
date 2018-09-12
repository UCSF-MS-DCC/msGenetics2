class AddPedigreeToSubjects < ActiveRecord::Migration[5.2]
  def change
    add_column :subjects, :pedigree, :integer
  end
end
