require "test_helper"

class ActivitiesTest < ActionDispatch::IntegrationTest
  setup do
    @outdoor = categories(:outdoor)
    @creative = categories(:creative)
    @hike = activities(:hike)
    @draw = activities(:draw)
  end

  test "returns a random activity from all categories" do
    get random_activities_url

    assert_response :success
    json = response.parsed_body
    assert_includes [ @hike.title, @draw.title ], json["title"]
    assert json["category"].key?("slug")
  end

  test "returns a random activity from a specific category" do
    get random_activities_url(category_slug: @outdoor.slug)

    assert_response :success
    json = response.parsed_body
    assert_equal @outdoor.slug, json["category"]["slug"]
    assert_equal @hike.title, json["title"]
  end

  test "returns not found for unknown category slug" do
    get random_activities_url(category_slug: "nonexistent")

    assert_response :not_found
    assert_equal "Category not found", response.parsed_body["error"]
  end

  test "returns not found when category has no activities" do
    empty_category = Category.create!(name: "Empty", slug: "empty")

    get random_activities_url(category_slug: empty_category.slug)

    assert_response :not_found
    assert_equal "No activities found", response.parsed_body["error"]
  end
end
