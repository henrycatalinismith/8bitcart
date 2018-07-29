Rails.application.routes.draw do
  scope module: :gallery do
    get "/", to: "welcome#index"
    get '/new', to: "carts#new"

    match '/:address' => 'carts#get',
      :via => :get,
      :requirements => {
        :address => /^0x.{6}$/
      }
  end
end
