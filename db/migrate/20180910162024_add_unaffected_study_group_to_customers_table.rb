class AddUnaffectedStudyGroupToCustomersTable < ActiveRecord::Migration[5.2]
  def change
    add_column :customers, :studygroupunaffected, :string
  end
end
