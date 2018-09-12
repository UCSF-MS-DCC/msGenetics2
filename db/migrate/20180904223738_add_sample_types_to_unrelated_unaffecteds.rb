class AddSampleTypesToUnrelatedUnaffecteds < ActiveRecord::Migration[5.2]
  def change
    add_column :unrelated_unaffecteds, :dna, :decimal, :precision => 8, :scale => 2
    add_column :unrelated_unaffecteds, :serum, :decimal, :precision => 8, :scale => 2
    add_column :unrelated_unaffecteds, :plasma, :decimal, :precision => 8, :scale => 2
    add_column :unrelated_unaffecteds, :pax, :decimal, :precision => 8, :scale => 2
    add_column :unrelated_unaffecteds, :blood, :decimal, :precision => 8, :scale => 2
    add_column :unrelated_unaffecteds, :hla, :decimal, :precision => 8, :scale => 2
  end
end
