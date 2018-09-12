class Family < ApplicationRecord
  belongs_to :subject
  belongs_to :related_unaffected
end
