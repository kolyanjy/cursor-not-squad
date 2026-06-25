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
end
