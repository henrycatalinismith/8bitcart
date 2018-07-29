module Gallery
  class CartsController < GalleryController
    def new
      @cart = Cart.new(
        :lua => [
          "-- hi there :)",
          "-- here's some code to get you started!",
          "line(0, 0, 127, 127, 12)",
          "",
          "-- hit ▶️ Run to see it in action!",
        ].join("\n")
      )
    end

    def get
      @address = params[:address][2 .. params[:address].length]
      @cart = Cart.find_by(address: @address)
    end
  end
end
