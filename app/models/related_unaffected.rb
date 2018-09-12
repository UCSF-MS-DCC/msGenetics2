class RelatedUnaffected < ApplicationRecord
  has_many :families
  has_many :subjects, through: :families
end
