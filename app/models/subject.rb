class Subject < ApplicationRecord
  has_many:families
  has_many :related_unaffecteds, through: :families
end
