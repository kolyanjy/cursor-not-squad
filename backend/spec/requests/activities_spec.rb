require "rails_helper"

RSpec.describe "Activities", type: :request do
  fixtures :categories, :activities

  let(:outdoor) { categories(:outdoor) }
  let(:creative) { categories(:creative) }
  let(:hike) { activities(:hike) }
  let(:draw) { activities(:draw) }

  describe "GET /activities/random" do
    it "returns a random activity from all categories" do
      get random_activities_path

      expect(response).to have_http_status(:ok)
      json = response.parsed_body
      expect([ hike.title, draw.title ]).to include(json["title"])
      expect(json["category"]).to include("slug")
    end

    it "returns a random activity from a specific category" do
      get random_activities_path, params: { category_slug: outdoor.slug }

      expect(response).to have_http_status(:ok)
      json = response.parsed_body
      expect(json["category"]["slug"]).to eq(outdoor.slug)
      expect(json["title"]).to eq(hike.title)
    end

    it "returns not found for unknown category slug" do
      get random_activities_path, params: { category_slug: "nonexistent" }

      expect(response).to have_http_status(:not_found)
      expect(response.parsed_body["error"]).to eq("Category not found")
    end

    it "returns not found when category has no activities" do
      empty_category = Category.create!(name: "Empty", slug: "empty")

      get random_activities_path, params: { category_slug: empty_category.slug }

      expect(response).to have_http_status(:not_found)
      expect(response.parsed_body["error"]).to eq("No activities found")
    end
  end

  describe "POST /activities/:id/like" do
    let(:user) do
      User.create!(email: "liker@example.com", password: "secret123", password_confirmation: "secret123")
    end
    let(:token) { user.generate_token_for(:auth) }
    let(:auth_headers) { { "Authorization" => "Bearer #{token}" } }

    it "creates a like between the current user and the activity" do
      expect {
        post like_activity_path(hike), headers: auth_headers
      }.to change(Like, :count).by(1)

      expect(response).to have_http_status(:created)
      json = response.parsed_body
      expect(json["user_id"]).to eq(user.id)
      expect(json["activity_id"]).to eq(hike.id)
    end

    it "is idempotent and does not create a duplicate like" do
      post like_activity_path(hike), headers: auth_headers

      expect {
        post like_activity_path(hike), headers: auth_headers
      }.not_to change(Like, :count)

      expect(response).to have_http_status(:created)
    end

    it "returns not found for an unknown activity" do
      post like_activity_path(id: 0), headers: auth_headers

      expect(response).to have_http_status(:not_found)
      expect(response.parsed_body["error"]).to eq("Activity not found")
    end

    it "rejects a request without a token" do
      post like_activity_path(hike)

      expect(response).to have_http_status(:unauthorized)
    end
  end
end
