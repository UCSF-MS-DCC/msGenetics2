class CreateCustomers < ActiveRecord::Migration[5.2]
  def change
    create_table :customers do |t|
      t.string :email
      t.string :firstname
      t.string :lastname
      t.boolean :irb
      t.text :studyname
      t.text :studydescription
      t.text :institution
      t.string :telephone
      t.text :address
      t.boolean :contactemailok
      t.boolean :contacttelephoneok
      t.boolean :contactpapermail

      t.timestamps
    end
  end
end
