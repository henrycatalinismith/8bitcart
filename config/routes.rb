Rails.application.routes.draw do
  scope module: :gallery do
    get "/", to: "welcome#index"
    get '/new', to: "carts#new"

    match '/:address.png' => 'carts#screenshot',
      :via => :get,
      :constraints => {
        :address => /0x[0-9A-F]{6}/
      }

    match '/:address' => 'carts#get',
      :via => :get,
      :constraints => {
        :address => /0x[0-9A-F]{6}/
      }
  end
end
