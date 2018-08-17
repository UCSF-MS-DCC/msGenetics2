require 'csv'

Subject.delete_all

csv_text = File.read(Rails.root.join('lib', 'seeds', 'repo_inventory.csv'))
csv = CSV.parse(csv_text, :headers => true)
csv.each do |row|
  @subject = Subject.new(row.to_hash)
  if !@subject.save
    puts @subject.errors
  end
end
