Redmine::Plugin.register :redmine_mentions do
  name 'Redmine Mentions plugin'
  author 'RedmineUP'
  description 'Adds mention support for issue notes'
  version '0.0.2'
  url 'https://redmineup.com'
  author_url 'https://redmineup.com'
  requires_redmine version_or_higher: '3.4.0'
  settings :default => {
    :include_body => true 
  }, :partial => 'settings/mentions/general'
end

require 'redmine_mentions'
