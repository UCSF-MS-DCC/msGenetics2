class CreateFamilies < ActiveRecord::Migration[5.2]
  def change
    create_table :families do |t|
      t.references :subject, foreign_key: true
      t.references :related_unaffected, foreign_key: true
      t.integer :pedigree

      t.timestamps
    end
  end
end
