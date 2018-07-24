Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'home#index'
  get '/biorepository', to: 'home#biorepository', as: 'biorepository' #this formats the request. get "URL in address bar", to "controller/action", as "rails path name"

  get '/home/biorepo_data'
end
