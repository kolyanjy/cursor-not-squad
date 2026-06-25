Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  post "signup", to: "registrations#create"
  post "login", to: "sessions#create"
  get "me", to: "current_user#show"

  get "activities/random", to: "activities#random", as: :random_activities
  post "activities/:id/like", to: "activities#like", as: :like_activity
end
