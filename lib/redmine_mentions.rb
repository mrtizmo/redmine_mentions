ActionDispatch::Callbacks.to_prepare do
  require 'redmine_mentions/hooks/view_layouts_hook'
  require 'redmine_mentions/hooks/view_issues_form_details_bottom_hook'

  require 'redmine_mentions/patches/journals_helper_patch'
  require 'redmine_mentions/patches/journal_patch'
  require 'redmine_mentions/patches/mailer_patch'
  require 'redmine_mentions/patches/user_preference_patch'
  require 'redmine_mentions/patches/wiki_page_patch'
  require 'redmine_mentions/patches/wiki_controller_patch'
  require 'redmine_mentions/patches/wiki_helper_patch'
end

module RedmineMentions
  def self.settings() Setting[:plugin_redmine_mentions].blank? ? {} : Setting[:plugin_redmine_mentions]  end
end
