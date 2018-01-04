module RedmineMentions
  module Hooks
    class ViewsLayoutsHook < Redmine::Hook::ViewListener
      def view_issues_form_details_bottom(_context = {})
        javascript_tag <<-JS
        $(function(){
          $('.jstEditor textarea').mentionsInput({
              source: '#{mention_hints_path}',
              showAtCaret: true
          });
        })
JS
      end
    end
  end
end
