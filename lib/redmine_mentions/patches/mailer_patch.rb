module RedmineMentions
  module Patches
    module MailerPatch
      def self.included(base) # :nodoc:
        base.send(:include, InstanceMethods)
        base.class_eval do
          unloadable
        end
      end

      module InstanceMethods
        def issue_edit_mention(journal, to_users)
          issue = journal.journalized
          redmine_headers 'Project' => issue.project.identifier,
                          'Issue-Id' => issue.id,
                          'Issue-Author' => issue.author.login
          redmine_headers 'Issue-Assignee' => issue.assigned_to.login if issue.assigned_to
          message_id journal
          references issue
          @author = journal.user
          s = "You've been mentioned in [#{issue.project.name} - #{issue.tracker.name} ##{issue.id}] "
          s << "(#{issue.status.name}) " if journal.new_value_for('status_id')
          s << issue.subject
          @issue = issue
          @users = to_users
          @journal = journal
          @journal_details = journal.visible_details(@users.first)
          @issue_url = url_for(:controller => 'issues', :action => 'show', :id => issue, :anchor => "change-#{journal.id}")
          mail :to => to_users,
            :subject => s
        end
      end
    end
  end
end

unless Mailer.included_modules.include?(RedmineMentions::Patches::MailerPatch)
  Mailer.send(:include, RedmineMentions::Patches::MailerPatch)
end
