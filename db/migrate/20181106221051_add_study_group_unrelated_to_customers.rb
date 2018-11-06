class AddStudyGroupUnrelatedToCustomers < ActiveRecord::Migration[5.2]
  def change
    add_column :customers, :studygroupunrelated, :string
  end
end
