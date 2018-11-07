class HomeController < ApplicationController
  include HomeHelper

  def index

  end

  def index2

  end

  def about

  end

  def research

  end

  def dashboard
    @subjectsamples = { msc_serum: Subject.where.not(serum:nil).where.not(disease_course:nil).count, msc_plasma: Subject.where.not(plasma:nil).where.not(disease_course:nil).count, msc_dna: Subject.where.not(dna:nil).where.not(disease_course:nil).count,
                        ru_serum: RelatedUnaffected.where.not(serum:nil).count, ru_plasma: RelatedUnaffected.where.not(plasma:nil).count, ru_dna: RelatedUnaffected.where.not(dna:nil).count,
                        uu_serum: UnrelatedUnaffected.where.not(serum:nil).count, uu_plasma: UnrelatedUnaffected.where.not(plasma:nil).count, uu_dna: UnrelatedUnaffected.where.not(dna:nil).count }
    @samples_request = Customer.new
  end

  def accept
    @samples_request = Customer.new(accept_request_params)
    if @samples_request.save && verify_recaptcha
      BiorepositoryNotificationMailer.with(customer: @samples_request).samples_request_notification.deliver_now
    end
  end

  def biorepository
    @customer = Customer.new
  end

  def biorepository2

  end

  def biorepo_update
    affected_params = biorepo_data_params.slice(:sex, :race, :disease_course)
    non_affected_params = biorepo_data_params.slice(:sex, :race)
    result = {:serum => {:cases => Subject.where.not(serum:nil).count, :related_unaffected => RelatedUnaffected.where.not(serum:nil).count}, :plasma => {:cases => Subject.where.not(plasma:nil).count, :related_unaffected => RelatedUnaffected.where.not(plasma:nil).count}, :dna => {:cases => Subject.where.not(dna:nil).count, :related_unaffected => RelatedUnaffected.where.not(dna:nil).count} }
    if biorepo_data_params.to_hash.size > 0
      @cases = Subject.all
      @controls = UnrelatedUnaffected.all
      if biorepo_data_params.include?(:age_range)
        filter_clauses = []
        biorepo_data_params[:age_range].each do |range|
          start = range.split(" ")[0]
          stop = range.split(" ")[2]
          if !!/\A[+-]?\d+(\.\d+)?\z/.match(stop)
            filter_clauses.push("(age_onset >= #{start} AND age_onset < #{stop})")
          else
            filter_clauses.push("(age_onset >= #{start})")
          end
        end
        age_filter = filter_clauses.join(" OR ")
        @cases = @cases.where(age_filter)
      end
      ["serum", "plasma", "dna"].each do |sam_type|
        @cases = @cases.where(affected_params).where.not("#{sam_type}":nil).where.not(sex:nil).where.not(race:nil).where.not(age_onset:nil).where.not(disease_course:nil)
        cases_ids = @cases.pluck(:id)
        @fams = Family.where(subject_id:cases_ids)
        relateds_ids = @fams.pluck(:related_unaffected_id).uniq
        @relateds = RelatedUnaffected.where(id:relateds_ids)
        result[sam_type.to_sym][:cases] = @cases.count
        result[sam_type.to_sym][:related_unaffected] = non_affected_params.to_hash.size > 0 ? @relateds.where(biorepo_data_params.slice(:sex, :race)).where.not("#{sam_type}":nil).where.not(sex:nil).where.not(race:nil).count : @relateds.where.not("#{sam_type}":nil).where.not(sex:nil).where.not(race:nil).count;
      end
    end
    render json: result, status: :ok
  end

  def biorepo_update_unrelated
    non_affected_params = biorepo_data_params.slice(:sex, :race)
    result = {:serum => UnrelatedUnaffected.where.not(serum:nil).count, :dna => UnrelatedUnaffected.where.not(plasma:nil).count, :plasma => UnrelatedUnaffected.where.not(dna:nil).count}

    if non_affected_params.to_hash.size > 0
      ["serum", "plasma", "dna"].each do |sam_type|
        result[sam_type.to_sym] = non_affected_params.to_hash.size > 0 ? UnrelatedUnaffected.where(biorepo_data_params.slice(:sex, :race)).where.not("#{sam_type}":nil).where.not(sex:nil).where.not(race:nil).count : UnrelatedUnaffected.where.not("#{sam_type}":nil).where.not(sex:nil).where.not(race:nil).count
      end
    end
    render json: result, status: :ok
  end

  def biorepo_data
    @subjects = Subject.all
    @relateds = RelatedUnaffected.all
    @unrelateds = UnrelatedUnaffected.all
    # @new_output = process_subjects(@subjects, biorepo_data_params)
    # puts "NEW OUTPUT: #{@new_output.to_json}"
    if biorepo_data_params
     @subjects = filter_subjects(@subjects, biorepo_data_params)
    end
    @output = test1(@subjects, @relateds, @unrelateds)

    render json: @output, status: :ok
  end

  private

    def biorepo_data_params
      params.permit(age_range: [], sex: [], race: [], disease_course: [])
    end

    def accept_request_params
      params.permit(:firstname, :lastname, :email, :institution, :studygroup, :studygroupunrelated, :studyname, :studydescription, :irb, :sampletype, :comments)
    end
end
