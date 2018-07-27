module HomeHelper
  def test1(models)
    unless models.size < 1
      output = {}
      # number of patients with samples of the various types
      s_types = %w(plasma serum dna)
      pop_types = ["cases", "unrelated controls", "related unaffected"]
      output[:samples] = []
      s_types.each do |sam_type|
        bundle = {sampleType: sam_type, values:[]}
        pop_types.each do |pop|
          val_bundle = {population:pop}
          count = 0
          if pop == "cases"
            count = models.where.not("#{sam_type}":nil).where("disease != 'Control' OR disease NOT LIKE ?", "Not MS%").count
          elsif pop == "unrelated controls"
            count = models.where.not("#{sam_type}":nil).where("disease =='Control' OR disease == 'Not MS - Unaffected - Unrelated'").count
          else
            count = models.where.not("#{sam_type}":nil).where("disease == ? OR disease == ?", "Not MS - Unaffected - Related", "Not MS - unaffected - related" ).count
          end
          val_bundle[:count] = count
          bundle[:values].push(val_bundle)
        end
        output[:samples].push(bundle)
      end
      # N of patients by sex
      output[:sex] = []
      sexes = Subject.pluck(:sex).uniq
      unknown_sex_count = 0
      sexes.each do |sex|
        sex_count = models.where(sex:sex).count
        long_value = nil
        if sex == "M"
          long_value = "Male"
          output[:sex].push({sex:long_value, count:sex_count})
        elsif sex == "F"
          long_value = "Female"
          output[:sex].push({sex:long_value, count:sex_count})
        else
          unknown_sex_count += sex_count
        end
      end
      output[:sex].push({sex:"Unknown", count:unknown_sex_count})
      # N of subjects by race
      output[:race] = []
      races = Subject.pluck(:race).uniq.sort
      races.each do |r|
        race_count = models.where(race:r).count
        output[:race].push({race:r, count:race_count})
      end
      # N of subjects by Hispanic ethnicity
      output[:hispanic] = []
      hispanic_status = Subject.pluck(:hispanic).uniq
      hispanic_status.each do |hs|

        hs_count = models.where(hispanic:hs).count
        if hs == "" || !hs
          hs = "No"
        end
        output[:hispanic].push({is_hispanic:hs, count:hs_count})
      end
      # N of subjects by disease course
      output[:disease_course] = []
      courses = Subject.pluck(:disease_course).uniq
      courses.each do |course|
          unless course == "" || !course
            course_count = Subject.where(disease_course:course).count
            output[:disease_course].push({disease_course:course, count:course_count})
          end
      end
      # N of subjects by EDSS - converting scores of "<3.0" to 1.5 and "<6.0" to 4.5
      output[:edss_scores] = []
      edsses = Subject.where.not(recent_edss:nil).pluck(:recent_edss).uniq
      edsses = edsses.sort
      edsses.each do |e|
        count = Subject.where(recent_edss:e).count
        output[:edss_scores].push({score: e, count:count})
      end
      # edsses = [0,2,4,6,8]
      # edsses.each_with_index {|edss, idx|
      #   if edsses[idx + 1] == nil
      #     scores = models.where("recent_edss >= ?", edss).count
      #     if scores > 0
      #       output[:edss_scores].push({score:"> #{edss}.0", count:scores})
      #     end
      #   else
      #     high_score = edsses[idx+1]
      #     scores = models.where("recent_edss >= ?", edss).where("recent_edss < ?", high_score).count
      #     output[:edss_scores].push({score: "#{edss}.0 - #{high_score}.0", count: scores})
      #   end
      # }
      # N of subjects by age_onset range
      output[:age_onset] = []
      ages = [10, 20, 30, 40, 50, 60, 70]
      ages.each_with_index {|val, idx|
          if idx + 1 == ages.size + 2
            onsets = models.where("age_onset >= ?", val)
            if onsets.size > 0
              output[:age_onset].push({age_range:">#{val}", count:onsets.size})
            end
          else
            end_age = ages[idx+1]
            onsets = models.where("age_onset >= ?", val).where("age_onset < ?", end_age)
            if onsets.size > 0
              output[:age_onset].push({age_range:"#{val} - #{end_age}", count:onsets.size})
            end
          end
      }
    end
    output
  end
end
