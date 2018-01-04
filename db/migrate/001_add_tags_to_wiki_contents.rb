class AddTagsToWikiContents < ActiveRecord::Migration
  def self.up
    add_column :wiki_contents, :tags, :text, array: true, default: []
  end

  def self.down
    remove_column :wiki_contents, :tags
  end
end
