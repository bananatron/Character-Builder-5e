require 'sinatra'

#format [name, casttime, range, components, duration, desc]
@cantrips = 
[{'name'=>'Guidance', 
  'casttime'=>'1 action',
  'range'=>'Touch',
  'components'=>['v', 's'],
  'duration'=>'Concentration, up to 1 minute',
  'desc'=>'You touch one willing creature. Once before the spell ends, the target can roll a d4 and add the number rolled to one ability check of its choice. It can roll the die before or after making the ability check. The spell then ends.'
  },]


# Set port for compatability with nitrous.io
configure :development do
  set :bind, '0.0.0.0'
  set :port, 3000
end

get '/' do
  erb :index
end

post '/sheet' do
  #Defines all the variables to be used in the /sheet erb
  @ch_background = params[:ch_background]
  
  erb :sheet
end

#get '/sheet' do
#  erb :sheet, :locals => {}
#end


get '/hello/:name' do
  # matches "GET /hello/foo" and "GET /hello/bar"
  # params[:name] is 'foo' or 'bar'
  "Hello #{params[:name]}!"
end

