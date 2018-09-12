class CreateUnrelatedUnaffecteds < ActiveRecord::Migration[5.2]
  def change
    create_table :unrelated_unaffecteds do |t|
      t.string :sex
      t.string :race

      t.timestamps
    end
  end
end
