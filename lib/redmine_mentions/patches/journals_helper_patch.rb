module RedmineMentions
  module Patches
    module JournalsHelperPatch
      def self.included(base) # :nodoc:
        base.send(:include, InstanceMethods)
        base.class_eval do
          unloadable
          alias_method_chain :render_notes, :mentions
        end
      end

      module InstanceMethods
        def render_notes_with_mentions(issue, journal, options)
          content = ''
          css_classes = "wiki"
          links = []
          if journal.notes.present?
            links << link_to(l(:button_quote),
                             quoted_issue_path(issue, :journal_id => journal),
                             :remote => true,
                             :method => 'post',
                             :title => l(:button_quote),
                             :class => 'icon-only icon-comment'
                            ) if options[:reply_links]

            if journal.editable_by?(User.current)
              links << link_to(l(:button_edit),
                               edit_journal_path(journal),
                               :remote => true,
                               :method => 'get',
                               :title => l(:button_edit),
                               :class => 'icon-only icon-edit'
                              )
              links << link_to(l(:button_delete),
                               journal_path(journal, :journal => {:notes => ""}),
                               :remote => true,
                               :method => 'put', :data => {:confirm => l(:text_are_you_sure)}, 
                               :title => l(:button_delete),
                               :class => 'icon-only icon-del'
                              )
              css_classes << " editable"
            end
          end
          content << content_tag('div', links.join(' ').html_safe, :class => 'contextual') unless links.empty?
          # Here we replace mentions with special intermediate notation
          # To avoid textile replacing @@ with <code> block
          journal.notes = journal.notes.gsub(
            /@\[([^\]]*)\]\(([^)^:]*):(\d*)\)/,
            '[[\1:\2:\3]]'
          ).html_safe
          textilizated = textilizable(journal, :notes, formatting: true)
          content << textilizated.gsub(
            /\[\[([^:]*):([^:]*):([^:]*)\]\]/,
            '<a href="/\2s/\3">@\1</a>'
          )
          content_tag('div', content.html_safe, :id => "journal-#{journal.id}-notes", :class => css_classes)
        end
      end
    end
  end
end

unless JournalsHelper.included_modules.include?(RedmineMentions::Patches::JournalsHelperPatch)
  JournalsHelper.send(:include, RedmineMentions::Patches::JournalsHelperPatch)
end
