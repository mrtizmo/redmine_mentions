module RedmineMentions
  module Patches
    module JournalPatch
      def self.included(base) # :nodoc:
        base.send(:include, InstanceMethods)
        base.class_eval do
          unloadable

          after_create :notify_mentioned
        end
      end

      module InstanceMethods
        def notify_mentioned
          Mailer.issue_edit_mention(self, mentioned_users).deliver
        end

        def mentioned_users
          users = notes.scan(
            /@\[([^\]]*)\]\(([^)^:]*):(\d*)\)/
          ).map do |_, klass, id|
            users(klass, id)
          end.flatten.compact
          users.reject do |user|
            user.preference&.no_mention_notified
          end
        end

        def users(klass, id)
          scope = klass.capitalize.constantize
          Rails.logger.info "scope = #{scope.inspect}"
          case klass
          when 'user'
            scope.find(id)
          when 'group'
            scope.find(id).users
          end
        end
      end
    end
  end
end

unless Journal.included_modules.include?(RedmineMentions::Patches::JournalPatch)
  Journal.send(:include, RedmineMentions::Patches::JournalPatch)
end
