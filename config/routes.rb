Rails.application.routes.draw do
  resources :locations
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  get 'coordinates', to: 'google_maps#coordinates'
  get 'simple_map', to: 'google_maps#simple_map'
  get 'pixel_tile', to: 'google_maps#pixel_tile'
  get 'geolocation', to: 'google_maps#geolocation'
  get 'localizing', to: 'google_maps#localizing'
  get 'right_to_left', to: 'google_maps#right_to_left'
  get 'custom', to: 'google_maps#custom'
  get 'literal', to: 'google_maps#literal'
  get 'simple_click', to: 'google_maps#simple_click'
  get 'properties', to: 'google_maps#properties'
  get 'lat_lng', to: 'google_maps#lat_lng'
  get 'bounds', to: 'google_maps#bounds'
  get 'advanced_marker', to: 'google_maps#advanced_marker'
  get 'centered_marker', to: 'google_maps#centered_marker'
  get 'cluster_markers', to: 'google_maps#cluster_markers'
  get 'html_marker', to: 'google_maps#html_marker'
  get 'customize_advanced_marker', to: 'google_maps#customize_advanced_marker'
  get 'interactive_marker', to: 'google_maps#interactive_marker'
  get 'circles', to: 'google_maps#circles'
  get 'info_windows', to: 'google_maps#info_windows'
  # Defines the root path route ("/")
  root "locations#index"
end
