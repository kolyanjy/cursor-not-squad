class RegistrationsController < ApplicationController
  # POST /signup
  def create
    user = User.new(user_params)

    if user.save
      render json: {
        user: user_json(user),
        token: user.generate_token_for(:auth)
      }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_content
    end
  end

  private

  def user_params
    params.permit(:email, :password, :password_confirmation)
  end

  def user_json(user)
    { id: user.id, email: user.email }
  end
end
