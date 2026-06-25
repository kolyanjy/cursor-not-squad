class SessionsController < ApplicationController
  # POST /login
  def create
    user = User.authenticate_by(email: params[:email].to_s.strip.downcase, password: params[:password].to_s)

    if user
      render json: {
        user: { id: user.id, email: user.email },
        token: user.generate_token_for(:auth)
      }, status: :ok
    else
      render json: { error: "Invalid email or password" }, status: :unauthorized
    end
  end
end
