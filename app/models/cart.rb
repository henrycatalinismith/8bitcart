class Cart < ActiveRecord::Base
  has_many_attached :snapshots
end
