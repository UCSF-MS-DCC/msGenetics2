module HomeHelper

  def test1(subjects, relateds, unrelateds)
      output = {}
      # N of subjects and relateds by sex
      output[:sex] = []
      sexes = %w(F M U)
      sexes.each do |sex|
        sex_count = subjects.where(sex:sex).count
        long_value = nil
        if sex == "M"
          long_value = "Male"
        elsif sex == "F"
          long_value = "Female"
        elsif sex == "U"
          long_value = "Unknown"
        end
        output[:sex].push({sex:long_value, count:sex_count})
      end

      # N of subjects and relateds by race
      output[:race] = []
      races = Subject.pluck(:race).uniq.sort
      races.each do |r|
        race_count = subjects.where(race:r).count
        output[:race].push({race:r, count:race_count})
      end
      # N of subjects by disease course
      output[:disease_course] = []
      courses = ["RIS", "CIS", "RR", "UNC", "SP", "PP", "PR", "UNK"]
      courses.each do |course|
          unless course == "" || !course
            course_count = subjects.where(disease_course:course).count
            if course_count.size > 0
              output[:disease_course].push({disease_course:course, count:course_count})
            end
          end
      end
      # N of subjects by age_onset range
      output[:age_onset] = []
      ages = [10, 20, 30, 40, 50, 60]
      ages.each_with_index {|val, idx|
        if val == ages.last
          onsets = subjects.where("age_onset >= ?", val)
          output[:age_onset].push({age_range:"#{val} and up", count:onsets.size})
        else
          end_age = ages[idx+1]
          onsets = subjects.where("age_onset >= ?", val).where("age_onset < ?", end_age)
          output[:age_onset].push({age_range:"#{val} - #{end_age}", count:onsets.size})
        end
      }
      #N of UnrelatedUnaffected by sex
      output[:unrelated_sex] = []
      sexes = %w(F M U)
      sexes.each do |sex|
        sex_count = unrelateds.where(sex:sex).count
        long_value = nil
        if sex == "M"
          long_value = "Male"
        elsif sex == "F"
          long_value = "Female"
        elsif sex == "U"
          long_value = "Unknown"
        end
        output[:unrelated_sex].push({sex:long_value, count:sex_count})
      end
      #N of UnrelatedUnaffected by race
      output[:unrelated_race] = []
      races = UnrelatedUnaffected.pluck(:race).uniq.sort
      races.each do |r|
        race_count = subjects.where(race:r).count
        output[:unrelated_race].push({race:r, count:race_count})
      end
    puts output.to_json
    output
  end

  def filter_subjects(models, params)
    puts params
    puts "BEFORE FILTER: #{models.size} subjects"
    if params[:sex]
      where_clause_sex = []
      params[:sex].each do |s|
        s = s[0]
        where_clause_sex.push("(sex == '#{s}')")
      end
      where_clause_sex = where_clause_sex.join(" OR ")
      models = models.where.not(where_clause_sex)
    end
    if params[:age_range]
      where_clause_age = []
      params[:age_range].each do |age_onset|
        if age_onset.include? "and up"
          start = age_onset.split(" ")[0]
          where_clause_age.push("(age_onset >= #{start})")
        else
          start = age_onset.split(' ')[0]
          stop = age_onset.split(' ')[2]
          where_clause_age.push("(age_onset >= #{start} AND age_onset < #{stop})")
        end
      end
      where_clause_age_stub = "(disease == 'CIS' OR disease == 'RIS' OR disease == 'MS' OR disease == 'MS - Reported' OR disease == 'MS - Confirmed' OR disease == 'Unknown') AND "
      where_clause_age ="#{where_clause_age_stub}(#{where_clause_age.join(" OR ")})"
      puts "WHERE CLAUSE AGE: #{where_clause_age}"
      models = models.where.not(where_clause_age)
    end
    if params[:course]
      where_clause_course = []
      params[:course].each do |c|
        where_clause_course.push("(disease_course == '#{c}')")
      end
      where_clause_course_stub = "(disease == 'CIS' OR disease == 'RIS' OR disease == 'MS' OR disease == 'MS - Reported' OR disease == 'MS - Confirmed' OR disease == 'Unknown') AND "
      where_clause_course = "#{where_clause_course_stub}(#{where_clause_course.join(" OR ")})"
      models = models.where.not(where_clause_course)
    end
    if params[:race]
      where_clause_race = []
      params[:race].each do |r|
        where_clause_race.push("(race == '#{r}')")
      end
      where_clause_race = where_clause_race.join(" OR ")
      models = models.where.not(where_clause_race)
    end
    puts "AFTER FILTER: #{models.size} subjects"
    models
  end
end
