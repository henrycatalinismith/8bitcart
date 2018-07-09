class CreateCarts < ActiveRecord::Migration[5.2]
  def change
    create_table :carts do |t|
      t.timestamps
      t.string :address, :limit => 6
      t.string :name, :limit => 32
      t.string :lua, :limit => 512
    end
    add_index :carts, :address, unique: true
  end
end
