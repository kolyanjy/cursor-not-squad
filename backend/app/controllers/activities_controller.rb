class ActivitiesController < ApplicationController
  def random
    category_slug = params[:category_slug]

    if category_slug.present? && !Category.exists?(slug: category_slug)
      return render json: { error: "Category not found" }, status: :not_found
    end

    activity = Activity.random_for_category(category_slug)

    if activity.nil?
      return render json: { error: "No activities found" }, status: :not_found
    end

    render json: {
      id: activity.id,
      title: activity.title,
      description: activity.description,
      category: {
        id: activity.category.id,
        name: activity.category.name,
        slug: activity.category.slug
      }
    }
  end
end
