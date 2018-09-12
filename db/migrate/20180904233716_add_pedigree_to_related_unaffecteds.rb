class AddPedigreeToRelatedUnaffecteds < ActiveRecord::Migration[5.2]
  def change
    add_column :related_unaffecteds, :pedigree, :integer
  end
end
