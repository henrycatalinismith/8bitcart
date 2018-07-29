class Cart < ApplicationRecord
  has_many :images

  def latest_image
    self.images.order("id").last
  end
end
