class ActivitiesController < ApplicationController
  include Authentication
  skip_before_action :authenticate_user!, only: :random

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

  # POST /activities/:id/like
  def like
    activity = Activity.find_by(id: params[:id])

    if activity.nil?
      return render json: { error: "Activity not found" }, status: :not_found
    end

    like = current_user.likes.find_or_create_by(activity: activity)

    if like.persisted?
      render json: {
        id: like.id,
        user_id: like.user_id,
        activity_id: like.activity_id
      }, status: :created
    else
      render json: { errors: like.errors.full_messages }, status: :unprocessable_content
    end
  end
end
