class WikiTagsController < ApplicationController
  before_filter :find_project

  def index
    @tags = WikiContent.for_project(@project)
  end

  def show
    @pages = WikiContent.for_project(
      @project
    ).where(
      [
        '? = ANY (tags)',
        params[:id]
      ]
    )
  end

  private

  def find_project
    @project = Project.find(params[:project_id])
  end
end
