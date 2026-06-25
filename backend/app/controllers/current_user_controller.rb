class CurrentUserController < ApplicationController
  include Authentication

  # GET /me
  def show
    render json: { id: current_user.id, email: current_user.email }
  end
end
