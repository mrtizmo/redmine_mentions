class WikiTagsController < ApplicationController
  before_filter :find_project

  def index
    @tags = WikiContent.pluck(:tags).flatten.uniq.select { |x| x.present? }
  end

  def show
    @pages = WikiContent.where(['? = ANY (tags)', params[:id]])
  end

  private

  def find_project
    @project = Project.find(params[:project_id])
  end
end
