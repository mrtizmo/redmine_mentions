class WikiTagsController < ApplicationController
  before_filter :find_project

  def index
    @tags = WikiContent.for_project(@project)
  end

  def show
    @pages = WikiContent.joins(page: :wiki).where(
      wikis: {
        project_id: @project.id
      }
    ).where(
      [
        '? = ANY (tags)',
        params[:id]
      ]
    ).order('wiki_pages.title')
  end

  private

  def find_project
    @project = Project.find(params[:project_id])
  end
end
