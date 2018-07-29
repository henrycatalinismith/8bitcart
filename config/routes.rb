Rails.application.routes.draw do
  root 'welcome#index'

  get '/new', to: 'welcome#index'
  get '/sign-up', to: 'welcome#index'

  scope module: :registry do
    match '/:address' => 'carts#get',
      :via => :get,
      :requirements => {
        :address => /^0x.{6}$/
      }
  end
end
