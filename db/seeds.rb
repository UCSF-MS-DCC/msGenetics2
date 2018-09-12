require 'csv'

Subject.delete_all
RelatedUnaffected.delete_all
UnrelatedUnaffected.delete_all

csv_text = File.read(Rails.root.join('lib', 'seeds', 'repo_inventory.csv'))
csv = CSV.parse(csv_text, :headers => true)
csv.each do |row|
  if row['affected_status'] && row['affected_status'] == 'case'
    @subject = Subject.new(sex:row['sex'], race:row['race'], disease_course:row['disease_course'], age_onset:row['age_onset'], pedigree:row['pedigree'], dna:row['dna'], plasma:row['plasma'], serum:row['serum'])
    if @subject.save
      puts "Subject saved"
    else
      puts "Subject not saved"
    end
  elsif row['affected_status'] && row['affected_status'] == 'related_unaffected'
    @related_unaffected = RelatedUnaffected.new(sex:row['sex'], race:row['race'], pedigree:row['pedigree'], dna:row['dna'], plasma:row['plasma'], serum:row['serum'])
    if @related_unaffected.save
      puts "Related saved"
    else
      puts "Related not saved"
    end
  elsif row['affected_status'] && row['affected_status'] == 'unrelated_unaffected'
    @unrelated_unaffected = UnrelatedUnaffected.new(sex:row['sex'], race:row['race'], dna:row['dna'], plasma:row['plasma'], serum:row['serum'])
    if @unrelated_unaffected.save
      puts "Unrelated saved"
    else
      puts "Unrelated not saved"
    end
  end
end
puts ".csv loaded, starting building pedigree assocations"
Subject.all.each do |s|
  ped = s.pedigree
  @related = RelatedUnaffected.where(pedigree:ped)
  @related.each do |r|
    @fam = Family.new(pedigree:ped, subject_id:s.id, related_unaffected_id:r.id)
    if @fam.save
      puts "Family saved"
    else
      puts "Family not saved"
    end
  end
end
