class Activity < ApplicationRecord
  belongs_to :category
  has_many :likes, dependent: :destroy
  has_many :liked_by, through: :likes, source: :user

  validates :title, presence: true

  scope :random, -> { order(Arel.sql("RANDOM()")).limit(1) }

  def self.random_for_category(slug = nil)
    scope = all
    scope = scope.joins(:category).where(categories: { slug: slug }) if slug.present?
    scope.random.first
  end
end
