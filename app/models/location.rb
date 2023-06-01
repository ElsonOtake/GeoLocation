class Location < ApplicationRecord
  geocoded_by :address
end
