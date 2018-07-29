class CreateImages < ActiveRecord::Migration[5.2]
  def change
    create_table :images do |t|
      t.timestamps
      t.references :cart, foreign_key: true
    end
  end
end
