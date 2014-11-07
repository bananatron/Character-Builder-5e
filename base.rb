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
  
  #Basics
  @ch_name = params[:ch_name]
  @ch_age = params[:ch_age]
  @ch_height = params[:ch_height]
  @ch_weight = params[:ch_weight]
  
  #Race stuff
  @ch_race = params[:ch_race]
  @ch_size = params[:ch_size]
  @ch_speed = params[:ch_speed]
  @ch_race_languages = params[:ch_race_languages]
  @ch_race_features = params[:ch_race_features]
  @ch_race_armor_prof = params[:ch_race_armor_prof]
  @ch_race_weapon_prof = params[:ch_race_weapon_prof]
  @ch_race_skill_prof = params[:ch_race_skill_prof]
  @ch_race_langcount = params[:ch_race_langcount]
  
  #Stats
  @ch_str = params[:ch_str]
  @ch_dex = params[:ch_dex]
  @ch_con = params[:ch_con]
  @ch_int = params[:ch_int]
  @ch_cha = params[:ch_cha]
  @ch_wis = params[:ch_wis]
  
  #Class stuff
  @ch_class = params[:ch_class]
  @ch_hp = params[:ch_hp] #Hit points
  @ch_hd = params[:ch_hd] #Hit die
  @ch_stp = params[:ch_stp] #Saving throw prof.
  @ch_armp = params[:ch_armp] #Armor prof.
  @ch_wepp = params[:ch_wepp] # Weapon prof.
  @ch_classtool = params[:ch_classtool] #Class tool prof.
  @ch_spellcount = params[:ch_spellcount]
  @ch_skillcount = params[:ch_skillcount]
  @ch_classequip = params[:ch_classequip].gsub!(",",", ")
  @ch_classfeat = params[:ch_classfeat]
  
  #Alignemnt
  @ch_alignment = params[:ch_alignment]
  
  #Skills and Spells
  @ch_class_skills = params[:ch_class_skills]
  @ch_rogue_exp = params[:ch_rogue_expertise]
  
  #Background
  @ch_background = params[:ch_background]
  @ch_trait = params[:ch_trait]
  @ch_ideal = params[:ch_ideal]
  @ch_bond = params[:ch_bond]
  @ch_flaw = params[:ch_flaw]
  @ch_bg_tools = params[:ch_bg_tools]
  @ch_bg_features = params[:ch_bg_features]
  @ch_bg_skills = params[:ch_bg_skills]
  @ch_bg_equip = params[:ch_bg_equip]
  @ch_bg_lang = params[:ch_bg_lang] #extra bg languages
  
  #Equip concat
  @master_equip_list = @ch_bg_equip.strip + ", " + @ch_classequip.strip
  
  #Extra Languages
  @master_lang_count = @ch_race_langcount.to_i + @ch_bg_lang.to_i
  
  #Skill concat
  @master_skill_list = []
  @master_skill_list += @ch_bg_skills.split(",").reject(&:empty?) if @ch_bg_skills
  @master_skill_list += @ch_race_skill_prof.split(",").reject(&:empty?) if @ch_race_skill_prof
  @master_skill_list += @ch_class_skills.split(",").reject(&:empty?) if @ch_class_skills
  @master_skill_list.delete(" ")
  @master_skill_list.each { |skill| skill.strip! }
  

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

