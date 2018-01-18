module RedmineMentions
  module Patches
    module WikiHelperPatch
      def self.included(base) # :nodoc:
        base.class_eval do
          unloadable

          def insert_category_links(text, project)
            text.gsub(
              /category:"([^"]*)"/,
              '<a href="/wiki_tags/\1?project_id=' + project.to_param + '">\1</a>'
            )
          end
        end
      end
    end
  end
end

unless WikiHelper.included_modules.include?(RedmineMentions::Patches::WikiHelperPatch)
  WikiHelper.send(:include, RedmineMentions::Patches::WikiHelperPatch)
end
