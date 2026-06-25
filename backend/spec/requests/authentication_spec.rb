require "rails_helper"

RSpec.describe "Authentication", type: :request do
  let(:valid_params) do
    { email: "alice@example.com", password: "secret123", password_confirmation: "secret123" }
  end

  describe "POST /signup" do
    it "registers a new user and returns a token" do
      expect {
        post "/signup", params: valid_params
      }.to change(User, :count).by(1)

      expect(response).to have_http_status(:created)
      json = response.parsed_body
      expect(json["user"]["email"]).to eq("alice@example.com")
      expect(json["token"]).to be_present
    end

    it "normalizes the email" do
      post "/signup", params: valid_params.merge(email: "  Alice@Example.com  ")

      expect(response).to have_http_status(:created)
      expect(User.last.email).to eq("alice@example.com")
    end

    it "rejects a mismatched password confirmation" do
      post "/signup", params: valid_params.merge(password_confirmation: "nope")

      expect(response).to have_http_status(:unprocessable_content)
      expect(response.parsed_body["errors"]).to be_present
    end

    it "rejects a duplicate email" do
      User.create!(valid_params)

      post "/signup", params: valid_params

      expect(response).to have_http_status(:unprocessable_content)
      expect(response.parsed_body["errors"]).to include(a_string_matching(/email/i))
    end

    it "rejects an invalid email" do
      post "/signup", params: valid_params.merge(email: "not-an-email")

      expect(response).to have_http_status(:unprocessable_content)
    end
  end

  describe "POST /login" do
    before { User.create!(valid_params) }

    it "authenticates with valid credentials and returns a token" do
      post "/login", params: { email: "alice@example.com", password: "secret123" }

      expect(response).to have_http_status(:ok)
      json = response.parsed_body
      expect(json["user"]["email"]).to eq("alice@example.com")
      expect(json["token"]).to be_present
    end

    it "is case-insensitive on email" do
      post "/login", params: { email: "ALICE@example.com", password: "secret123" }

      expect(response).to have_http_status(:ok)
    end

    it "rejects an invalid password" do
      post "/login", params: { email: "alice@example.com", password: "wrong" }

      expect(response).to have_http_status(:unauthorized)
      expect(response.parsed_body["error"]).to eq("Invalid email or password")
    end

    it "rejects an unknown email" do
      post "/login", params: { email: "nobody@example.com", password: "secret123" }

      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe "GET /me" do
    let(:user) { User.create!(valid_params) }
    let(:token) { user.generate_token_for(:auth) }

    it "returns the current user with a valid token" do
      get "/me", headers: { "Authorization" => "Bearer #{token}" }

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body["email"]).to eq("alice@example.com")
    end

    it "rejects a request without a token" do
      get "/me"

      expect(response).to have_http_status(:unauthorized)
    end

    it "rejects a request with an invalid token" do
      get "/me", headers: { "Authorization" => "Bearer garbage" }

      expect(response).to have_http_status(:unauthorized)
    end
  end
end
