class AddDiseaseSourceColToSubjects < ActiveRecord::Migration[5.2]
  def change
    add_column :subjects, :disease, :string
  end
end
