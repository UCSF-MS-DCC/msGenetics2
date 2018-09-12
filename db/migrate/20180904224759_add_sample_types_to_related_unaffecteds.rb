class AddSampleTypesToRelatedUnaffecteds < ActiveRecord::Migration[5.2]
  def change
    add_column :related_unaffecteds, :dna, :decimal, :precision => 8, :scale => 2
    add_column :related_unaffecteds, :serum, :decimal, :precision => 8, :scale => 2
    add_column :related_unaffecteds, :plasma, :decimal, :precision => 8, :scale => 2
    add_column :related_unaffecteds, :pax, :decimal, :precision => 8, :scale => 2
    add_column :related_unaffecteds, :blood, :decimal, :precision => 8, :scale => 2
    add_column :related_unaffecteds, :hla, :decimal, :precision => 8, :scale => 2
  end
end
