class AddInitialColsToSubjects < ActiveRecord::Migration[5.2]
  def change
    add_column :subjects, :sex, :string
    add_column :subjects, :disease_course, :string
    add_column :subjects, :age_onset, :integer
    add_column :subjects, :recent_edss, :string
    add_column :subjects, :phenotype_datasource, :string
    add_column :subjects, :race, :string
    add_column :subjects, :hispanic, :string
    add_column :subjects, :dna, :decimal, :precision => 8, :scale => 2
    add_column :subjects, :serum, :decimal, :precision => 8, :scale => 2
    add_column :subjects, :plasma, :decimal, :precision => 8, :scale => 2
    add_column :subjects, :pax, :decimal, :precision => 8, :scale => 2
    add_column :subjects, :blood, :decimal, :precision => 8, :scale => 2
    add_column :subjects, :hla, :decimal, :precision => 8, :scale => 2
  end
end
