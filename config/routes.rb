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
  # Defines the root path route ("/")
  root "locations#index"
end
