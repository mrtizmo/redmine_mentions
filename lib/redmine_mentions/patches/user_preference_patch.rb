module RedmineMentions
  module Patches
    module UserPreferencePatch
      def self.included(base) # :nodoc:
        base.class_eval do
          safe_attributes 'hide_mail',
            'time_zone',
            'comments_sorting',
            'warn_on_leaving_unsaved',
            'no_self_notified',
            'textarea_font',
            'no_mention_notified'

          def initialize(attributes=nil, *args)
            super
            if new_record?
              unless attributes && attributes.key?(:hide_mail)
                self.hide_mail = Setting.default_users_hide_mail?
              end
              unless attributes && attributes.key?(:time_zone)
                self.time_zone = Setting.default_users_time_zone
              end
              unless attributes && attributes.key?(:no_self_notified)
                self.no_self_notified = true
              end
              unless attributes && attributes.key?(:no_mention_notified)
                self.no_mention_notified = true
              end
            end
            self.others ||= {}
          end

          def no_mention_notified; (self[:no_mention_notified] == true || self[:no_mention_notified] == '1'); end
          def no_mention_notified=(value); self[:no_mention_notified]=value; end
        end
      end
    end
  end
end

unless UserPreference.included_modules.include?(RedmineMentions::Patches::UserPreferencePatch)
  UserPreference.send(:include, RedmineMentions::Patches::UserPreferencePatch)
end

