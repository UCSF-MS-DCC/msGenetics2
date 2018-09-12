Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'home#index2'
  get '/biorepository', to: 'home#biorepository', as: 'biorepository' #this formats the request. get "URL in address bar", to "controller/action", as "rails path name"
  get '/dashboard', to: 'home#dashboard', as: 'dashboard'
  get '/home/biorepo_data'
  get '/home/biorepo_update'
  get '/home/biorepo_update_unrelated'
  get '/about', to: 'home#about', as: 'about'
  get '/research', to: 'home#research', as: 'research'
  post '/home/accept'
end
