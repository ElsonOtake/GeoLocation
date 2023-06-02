# json.extract! location, :id, :name, :address, :latitude, :longitude, :created_at, :updated_at
# json.url location_url(location, format: :json)
json.extract! location, :latitude, :longitude
json.label location.name
json.tooltip html_link_to(location)
