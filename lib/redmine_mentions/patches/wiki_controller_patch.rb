module RedmineMentions
  module Patches
    module WikiControllerPatch
      def self.included(base) # :nodoc:
        base.class_eval do
          def tag_index
            @tags = WikiContent.pluck(:tags).flatten.unique 
          end

          def update
            return render_403 unless editable?
            was_new_page = @page.new_record?
            @page.safe_attributes = params[:wiki_page]

            @content = @page.content || WikiContent.new(:page => @page)
            content_params = params[:content]
            if content_params.nil? && params[:wiki_page].present?
              content_params = params[:wiki_page].slice(:text, :comments, :version)
            end
            content_params ||= {}
            @content.comments = content_params[:comments]
            @text = content_params[:text]
            if params[:section].present? && Redmine::WikiFormatting.supports_section_edit?
              @section = params[:section].to_i
              @section_hash = params[:section_hash]
              @content.text = Redmine::WikiFormatting.formatter.new(@content.text).update_section(@section, @text, @section_hash)
            else
              @content.version = content_params[:version] if content_params[:version]
              @content.text = @text
            end
            @content.author = User.current
            @content.tags = content_params[:tags]

            if @page.save_with_content(@content)
              attachments = Attachment.attach_files(@page, params[:attachments] || (params[:wiki_page] && params[:wiki_page][:uploads]))
              render_attachment_warning_if_needed(@page)
              call_hook(:controller_wiki_edit_after_save, { :params => params, :page => @page})

              respond_to do |format|
                format.html {
                  anchor = @section ? "section-#{@section}" : nil
                  redirect_to project_wiki_page_path(@project, @page.title, :anchor => anchor)
                }
                format.api {
                  if was_new_page
                    render :action => 'show', :status => :created, :location => project_wiki_page_path(@project, @page.title)
                  else
                    render_api_ok
                  end
                }
              end
            else
              respond_to do |format|
                format.html { render :action => 'edit' }
                format.api { render_validation_errors(@content) }
              end
            end

          rescue ActiveRecord::StaleObjectError, Redmine::WikiFormatting::StaleSectionError
            # Optimistic locking exception
            respond_to do |format|
              format.html {
                flash.now[:error] = l(:notice_locking_conflict)
                render :action => 'edit'
              }
              format.api { render_api_head :conflict }
            end
          end
        end
      end
    end
  end
end

unless WikiController.included_modules.include?(RedmineMentions::Patches::WikiControllerPatch)
  WikiController.send(:include, RedmineMentions::Patches::WikiControllerPatch)
end



