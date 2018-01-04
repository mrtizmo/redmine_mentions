module RedmineMentions
  module Patches
    module WikiPagePatch
      def self.included(base) # :nodoc:
        base.class_eval do
          def save_with_content(content)
            ret = nil
            transaction do
              ret = save
              if content.text_changed? || content.tags_changed?
                begin
                  self.content = content
                  ret = ret && content.changed?
                rescue ActiveRecord::RecordNotSaved
                  ret = false
                end
              end
              raise ActiveRecord::Rollback unless ret
            end
            ret
          end
        end
      end
    end
  end
end

unless WikiPage.included_modules.include?(RedmineMentions::Patches::WikiPagePatch)
  WikiPage.send(:include, RedmineMentions::Patches::WikiPagePatch)
end


