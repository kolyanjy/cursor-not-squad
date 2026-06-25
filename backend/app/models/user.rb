class User < ApplicationRecord
  has_secure_password

  generates_token_for :auth, expires_in: 2.weeks

  normalizes :email, with: ->(email) { email.strip.downcase }

  validates :email, presence: true, uniqueness: true,
                    format: { with: URI::MailTo::EMAIL_REGEXP }
end
