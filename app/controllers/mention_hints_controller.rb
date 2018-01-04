# Autocomplete for mentioned users
class MentionHintsController < ApplicationController
  def index
    users = User.where(['login ILIKE ?', "#{params[:term]}%"])
    groups = Group.where(['lastname ILIKE ?', "#{params[:term]}%"])
    json = (users + groups).map do |user|
      {
        value: user.login.blank? ? user.lastname : user.login,
        uid: "#{user.class.to_s.downcase}:#{user.id}"
      }
    end

    render json: json
  end
end
