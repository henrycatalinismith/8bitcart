module Registry
  class CartsController < BaseController
    def get
      @address = params[:address][2 .. params[:address].length]
      @cart = Cart.find_by(address: @address)
    end
  end
end
