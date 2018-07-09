Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'welcome#index'

  scope module: :registry do
    match '/:address' => 'carts#get',
      :via => :get,
      :requirements => {
        :address => /^0x.{6}$/
      }
  end
end
