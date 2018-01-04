module RedmineMentions
  module Hooks
    class ViewsLayoutsHook < Redmine::Hook::ViewListener
      def view_layouts_base_html_head(_context = {})
        javascript_include_tag(
          'jquery.mentions',
          plugin: 'redmine_mentions'
        ) +
          stylesheet_link_tag(
            'jquery.mentions',
            plugin: 'redmine_mentions'
          )
      end
    end
  end
end
