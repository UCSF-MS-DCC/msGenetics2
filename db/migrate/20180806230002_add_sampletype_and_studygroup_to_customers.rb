class AddSampletypeAndStudygroupToCustomers < ActiveRecord::Migration[5.2]
  def change
    add_column :customers, :sampletype, :text
    add_column :customers, :studygroup, :text
  end
end
