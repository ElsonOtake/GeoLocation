Rails.application.routes.draw do
  resources :locations
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  get 'map', to: 'google_maps#map'
  get 'simple_map', to: 'google_maps#simple_map'
  # Defines the root path route ("/")
  root "locations#index"
end
