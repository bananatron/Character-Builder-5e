///////////////////////////////////////////////////
//                                               //
//    .sSSSSs.     SSSSSSSSSs.  .sSSSSs.         //
//    SSSSSSSSSs.  SSSSS SSSS'  SSSSSSSSSs.      //
//    S SSS SSSSS  S SSS        S SSS SSSSS      //
//    S  SS SSSSS  SSSSSsSSSs.  S  SS SSSS'      //
//    S..SS SSSSS        SSSSS  S..SSsSSSa.      //
//    S:::S SSSSS  .sSSS SSSSS  S:::S SSSSS      //
//    S;;;S SSSSS  S;;;S SSSSS  S;;;S SSSSS      //
//    S%%%S SSSS'  S%%%S SSSSS  S%%%S SSSSS      //
//    SSSSSsS;:'   `:;SSsSS;:'  SSSSSsSSSS'      //
//                                               //
//         DND 5E Character Builder              //
///////////////////////////////////////////////////

// This file manipulates the index.erb (main form page)
// Reference sheet.js for the sheet.erb (results / sheet page)

//HOW THIS WORKS
// This is basicall a giant form with a lot of jquery selectors filling out hidden input elements as you select/change things. Because it's designed to factor all character
// choices into the final page (race/class/bg bonuses, etc.), some of the race/class logic gets stupid/complicated (this is also due to the unique nature of how 5E
// isn't very standardized (good for gameplay imo, bad for programming)). Adding/editing backgrounds and spells, however, should be much easier as they are 
// generated in the erb files using ruby objects (usually hashes or arrays of hashes, etc.). They were made towards the end of the project, when I had more insight.

//Sinatra takes the hidden form values(referenced in base.rb), which are populated based on user selection and hands them over to sheet.erb for the final output.

// I try to use ^ as a delimeter where I can in strings, as commas get messy with long, already comm-filled strings. The exception to this is equipment because it's 
// array based. In addition, window.x is used for global variables.

// This is my first jquery/js heavy app so I'm sure a lot of this could be refactored/restructured.
//
// ~110 - Race Logic
// ~400 - Class Logic
// ~540 - Roll Generator 
// ~640 - Point buy logic
// ~800 - Alignment
// ~850 - Background logic
// ~900 - Skills
// ~1000 - Spells
// ~1050 - Form Validations

//When DOM is ready
$(document).ready(function(){
  
 //Starting globals
  window.bonus_str = 0;
  window.bonus_int = 0;
  window.bonus_wis = 0;
  window.bonus_cha = 0;
  window.bonus_dex = 0;
  window.bonus_con = 0;
  window.bonus_hp = 0;
  
  function getTotalHp() {
    var base = 0;
    if ($("input#ch_class").val() == "Fighter") { base = 10; }
    if ($("input#ch_class").val() == "Rogue") { base = 8; }
    if ($("input#ch_class").val() == "Cleric") { base = 8; }
    if ($("input#ch_class").val() == "Wizard") { base = 6; }
    
    var total_hp = (base + parseInt($("input#ch_con").val()) + window.bonus_hp);
    $("input#ch_hp").val(total_hp);
  }
  
  //Reset class features before defining new features on class selection. 
  //Call this before filling out class detail to prevent from having to redefine EVERY field
  function resetClass() {
    $("input#ch_classtool").val(""); //Default class tools
    $("input#ch_armp").val(""); //Armor  proficiency
    $("input#ch_wepp").val(""); //Weapon proficiency
    $("input#ch_hd").val(""); //Hit die
    $("input#ch_stp").val(""); //Saving throw proficiency
    $("input#ch_skillcount").val(0); //# of skills class can choose
    $("input#ch_spellcount").val(0); //# of 1st level spells
    $("input#ch_cantripcount").val(0); //# of cantraips @ 1st level
    window.class_equip = ""; //Default class equipment
    $("input#ch_classequip").val(window.class_equip); //Set class equipment
    $("input#ch_classfeat").val("");  //Class features
    $('#ch_cantrips_selected').val(""); //Cantrips selected
    $('#ch_spells_selected').val(""); //Spells selected
    class_skills = [""]; //Skills this class has available to them
  }
  
  function updatepbStats(){
    $("input#ch_str").val( parseInt($("#pb_str").text())+window.bonus_str );
    $("input#ch_dex").val( parseInt($("#pb_dex").text())+window.bonus_dex );
    $("input#ch_con").val( parseInt($("#pb_con").text())+window.bonus_con );
    $("input#ch_int").val( parseInt($("#pb_int").text())+window.bonus_int );
    $("input#ch_wis").val( parseInt($("#pb_wis").text())+window.bonus_wis );
    $("input#ch_cha").val( parseInt($("#pb_cha").text())+window.bonus_cha );
    getTotalHp();
  }

  //Reset stats for race selection - Same idea as resetClass
  //Need to run on all main classes to clear bonuses from previous selections
  function resetRace(){
    window.bonus_str = 0;
    window.bonus_int = 0;
    window.bonus_wis = 0;
    window.bonus_cha = 0;
    window.bonus_dex = 0;
    window.bonus_con = 0;
    window.bonus_hp = 0;
    $("input#ch_race_armor_prof").val([]);
    $("input#ch_race_skill_prof").val("");
    $("input#ch_race_weapon_prof").val([]);
    $("input#ch_race_langcount").val(0);
    $(".tool_click").attr('checked',false);
  }
  resetRace();
  
  //Assign race features with delimeter of ^ so the controller (base.rb) can split them into a meaningful array
  function assignRaceFeatures() {
    $("input#ch_race_features").val(race_features.join("^"));
  }
  
  //Hidden things
  $("input.ch_skillprof").hide();
  $("#step_3").hide();
  $("#step_35").hide();
  $("#step_4").hide();


//////////////////////////////////////
////  BEGIN RACE DEFENITIONS&LOGIC // 
////////////////////////////////////
  
  //Race-click change color
  function lightClassButton(panel) {
    $(panel).on("click",".race_click", function(){
      if ( $(this).text().toLowerCase().lastIndexOf(  $.trim($(this).data("subrace")) ) != -1 ){
        //$("this").attr("class", "button secondary race_click");
        $(".race_click" ).removeClass( "secondary" );
        $(this).addClass( "secondary" );
        }
      else {
        $(this).removeClass( "secondary" );
      }
    });
  }
  //Each race panel added in the future will need to call the lightClassButton
  // function on it in order for the buttons to work
  lightClassButton("#dwarf_desc");
  lightClassButton("#elf_desc");
  lightClassButton("#human_desc");
  lightClassButton("#halfling_desc");
  
  
  function scrollToStats() {
    $('html, body').animate({
      scrollTop: $('#attr_type').offset().top-60
    }, 500);
  };

  //Human racial  
  $("#panel_hum").click(function(event){
    resetRace();
    event.preventDefault();
    race_selection = "hum";
    $("input#ch_race_langcount").val(1);
    window.bonus_str = 1;
    window.bonus_int = 1;
    window.bonus_wis = 1;
    window.bonus_cha = 1;
    window.bonus_dex = 1;
    window.bonus_con = 1;
    $("input#ch_race_languages").val("Common");
    $("input#ch_size").val("Medium");
    $("input#ch_speed").val("30 ft.");
  });
  
  //Dwarf racial preloads
  $("#panel_dwa").click(function(event){
    resetRace();
    event.preventDefault();
    race_selection = "dwa";
    window.bonus_con = 2;
    $("input#ch_race_languages").val("Common^Dwarvish");
    $("input#ch_size").val("Medium");
    $("input#ch_speed").val("25 ft.*");
    $("input#ch_race_weapon_prof").val("battleaxe^handaxe^throwing hammer^warhammer");
  });

  //Mountain Dwarf
  $("#dwarf_desc").on("click","#panel_mdwa", function(){
    race_selection = "mdwa";
    resetRace();
    $("input#ch_race").val("Dwarf (Mountain Dwarf)");
    window.bonus_str = 2;
    window.bonus_con = 2;
    $("input#ch_race_armor_prof").val("light^medium");
    //Add features for dwarf and mdwarf
    $("input#ch_race_weapon_prof").val("battleaxe^handaxe^throwing hammer^warhammer");
    var race_features = [];
    $(".feature_dwa").each(function(  ) {
      race_features.push( $(this).text());
    });
    $("#attr_type").val(0); //Reset attr selection dropdown
    $(".name_wrap").hide(); //Hide attr so user knows to repick
    $(".feature_"+ race_selection ).each(function(  ) {
      race_features.push( $(this).text());
    });
    assignRaceFeatures(); 
    getTotalHp();
    scrollToStats();
  });

  //Hill Dwarf
  $("#dwarf_desc").on("click","#panel_hdwa", function(){
    race_selection = "hdwa";
    resetRace();
    $("input#ch_race").val("Dwarf (Hill Dwarf)");
    window.bonus_wis = 1;
    window.bonus_con = 2;
    window.bonus_hp = 1;
    //Add features for dwarf and mdwarf
    $("input#ch_race_weapon_prof").val("battleaxe^handaxe^throwing hammer^warhammer");
    race_features = [];
    $(".feature_dwa").each(function(  ) {
      race_features.push( $(this).text());
    });
    $("#attr_type").val(0); //Reset attr selection dropdown
    $(".name_wrap").hide(); //Hide attr so user knows to repick
    $(".feature_"+ race_selection ).each(function(  ) {
      race_features.push( $(this).text());
    });
    //Note to add 1 each level
    race_features.push("Dwarven Toughness. Your maximum HP increased by 1 each level (already added).")
    assignRaceFeatures();
    getTotalHp();
    scrollToStats();
  });

  //Elf racial preloads
  $("#panel_elf").click(function(event){
    resetRace();
    event.preventDefault();
    race_selection = "elf";

    window.bonus_int = 1;
    $("input#ch_race_languages").val("Common^Elvish");
    $("input#ch_size").val("Medium");
    $("input#ch_speed").val("30 ft.");
    $("input#ch_race_skill_prof").val("Perception");
  });

  //High Elf
  $("#elf_desc").on("click","#panel_helf", function(){
    resetRace();
    race_selection = "helf";
    $("input#ch_race").val("Elf (High Elf)");
    //Helf gets 1 extra language & 2 int
    $("input#ch_race_langcount").val(1);
    window.bonus_int = 3;
    //Helf weapon prof
    $("input#ch_race_weapon_prof").val("longsword^shortsword^shortbow^longbow");
    //Adds features for elf and helf
    race_features = [];
    $(".feature_elf").each(function(  ) {
     race_features.push( $(this).text());
    });
    $(".feature_"+ race_selection ).each(function(  ) {
     race_features.push( $(this).text());
    });
    $("#attr_type").val(0); //Reset attr selection dropdown
    $(".name_wrap").hide(); //Hide attr so user knows to repick
    assignRaceFeatures(); 
    //Helf no speed increase
    $("input#ch_speed").val("30 ft.");
    $("input#ch_race_skill_prof").val("Perception");
    getTotalHp();
    scrollToStats();
  }); 

  //Wood Elf
  $("#elf_desc").on("click","#panel_welf", function(){
    resetRace();
    race_selection = "welf";
    $("input#ch_race").val("Elf (Wood Elf)");
    //Welf gets +1 wis
    window.bonus_wis = 1;
    window.bonus_int = 2;
    //Welf speed increase
    $("input#ch_speed").val("35 ft.");
    //Welf weapon prof
    $("input#ch_race_weapon_prof").val(["longsword^shortsword^shortbow^longbow"]);
    //Adds features for elf and helf
    race_features = [];
    $(".feature_elf").each(function(  ) {
     race_features.push( $(this).text());
    });
    $(".feature_"+ race_selection ).each(function(  ) {
     race_features.push( $(this).text());
    });
    $("#attr_type").val(0); //Reset attr selection dropdown
    $(".name_wrap").hide(); //Hide attr so user knows to repick
    assignRaceFeatures(); 
    $("input#ch_race_skill_prof").val("Perception");
    getTotalHp();
    scrollToStats();
  }); 

  //Dark Elf
  //Oops, not in basic rules
  $("#elf_desc").on("click","#panel_delf", function(){
    resetRace();
    race_selection = "delf";
    $("input#ch_race").val("Elf (Dark Elf)");
    //Delf gets +1 wis
    window.bonus_int = 1;
    window.bonus_cha = 1;
    //Delf no speed increase
    $("input#ch_speed").val("30 ft.");
    //Delf weapon prof
    $("input#ch_race_weapon_prof").val("rapiers^shortswords^hand crossbows");
    //Adds features for elf and helf
    race_features = [];
    $(".feature_elf").each(function(  ) {
     race_features.push( $(this).text());
    });
    $(".feature_"+ race_selection ).each(function(  ) {
     race_features.push( $(this).text());
    });
    $("#attr_type").val(0); //Reset attr selection dropdown
    $(".name_wrap").hide(); //Hide attr so user knows to repick
    assignRaceFeatures();
    $("input#ch_race_skill_prof").val("Perception");
    getTotalHp();
    scrollToStats();
  }); 

  //Halfling racial preloads
  $("#panel_hal").click(function(event){
    resetRace();
    event.preventDefault();
    race_selection = "hal";
    window.bonus_dex = 2;
    $("input#ch_race_languages").val("Common^Halfling");
    $("input#ch_size").val("Small");
    $("input#ch_speed").val("25 ft.");
  });

  //Lightfood Halfling preloads
  $("#halfling_desc").on("click","#panel_lhal", function(){
    resetRace();
    event.preventDefault();
    race_selection = "lhal";
    $("input#ch_race").val("Halfling (Lightfoot)");
    window.bonus_dex = 2;
    window.bonus_cha = 1;
     //Adds features for normal half
    race_features = [];
    $(".feature_hal").each(function(  ) {
     race_features.push( $(this).text());
    });
    $(".feature_"+ race_selection ).each(function(  ) {
     race_features.push( $(this).text());
    });
    $("#attr_type").val(0); //Reset attr selection dropdown
    $(".name_wrap").hide(); //Hide attr so user knows to repick
    assignRaceFeatures(); 
    getTotalHp();
    scrollToStats();
  });

  //Stout Halfling preloads
  $("#halfling_desc").on("click","#panel_shal", function(){
    resetRace();
    event.preventDefault();
    race_selection = "shal";
    $("input#ch_race").val("Halfling (Stout)");
    window.bonus_dex = 2;
    window.bonus_con = 1;
   //Adds features for normal half
    race_features = [];
    $(".feature_hal").each(function(  ) {
     race_features.push( $(this).text());
    });
    $(".feature_"+ race_selection ).each(function(  ) {
     race_features.push( $(this).text());
    });
    assignRaceFeatures(); 
    var alt_button = "button secondary race_click"
    $("#attr_type").val(0); //Reset attr selection dropdown
    $(".name_wrap").hide(); //Hide attr so user knows to repick
    alt_button = $( "#panel_shal" ).css( "class" );
    getTotalHp();
    scrollToStats();
  });

  //When a race option is selected
  //Note that although subraces are race_click class, they don't conform to this function due
  //to be being embeded in another file - note how jquery requires to call them above
  $(".race_click").click(function(event){
    $(".race_click" ).removeClass( "secondary" ); //Clear button highlights
    race_features = [];
    $(".feature_"+ race_selection ).each(function(  ) {
     race_features.push( $(this).text());
    });
    $("#attr_type").val(0); //Reset attr selection dropdown
    $(".name_wrap").hide(); //Hide attr so user knows to repick
    assignRaceFeatures();
    $("input#ch_race").val($(this).html()); //Fill in race value
    getTotalHp(); //Recalculate HP based on current stats - somewhat depreciated
  });


/////////////////////////////////////////
//////  CLASS DEFENITIONS & LOGIC  ///// 
///////////////////////////////////////
  
  //Cleric spellcount recalculate
  function clericSpellcount(){
      //If cleric is selected, recalculates spellcount based on new wisdom
      if ($("input#ch_class").val() == "Cleric") {
        if (Math.floor((parseInt($("input#ch_wis").val())-10)/2) > 0) {
          $("input#ch_spellcount").val( Math.floor((parseInt($("input#ch_wis").val())-10)/2) + 1 );
        }
        else {
          $("input#ch_spellcount").val(1);
        }
      }
      //Uncheck any existing spell/cantrip selections
      $("input.ch_spells_cleric").each(function(  ) {
        $(this).attr('checked', false);
      });
      $("#cleric_spellcount_msg").html( $("input#ch_spellcount").val() ); //Set message notice to current spell limit
  }
 
  $(".class_click").click(function(event){
    resetClass();
    $("input#ch_class").val($(this).html());
    $("#class_msg").empty();
    $("#class_msg").append($(this).html());
    $("#rogue_exp").hide(); //Hide rogue expertise skill div

    //If rogue
    if ($("input#ch_class").val() == "Rogue") {
      getTotalHp();
      $("input#ch_classtool").val("Thieves' Tools");
      $("input#ch_armp").val("Light Armor");
      $("input#ch_wepp").val("Simple weapons^hand crossbows^longswords^rapiers^shortswords");
      $("input#ch_hd").val("1d8");
      $("input#ch_stp").val("Dexterity^Intelligence");
      $("input#ch_skillcount").val(4);
      window.class_equip = "Leather Armor, Two Daggers^Thieve's Tools";
      $("input#ch_classequip").val(window.class_equip);
      $("input#ch_classfeat").val("Thieves' Cant: A secret language known only to thieves.^ Sneak Attack: Once per turn you can deal an extra 1d6 damage to one creature you hit with an attack if you have advantage on the attack roll.");
      class_skills = ["Acrobatics", "Athletics", "Deception", "Insight", "Intimidation", "Investigation","Perception", "Performance", "Persuasion", "Sleight of Hand", "Stealth"];
      $("#rogue_exp").show(); //Show   rogue expertise skill div
    }
    
    //If Fighter
    if ($("input#ch_class").val() == "Fighter") {
      getTotalHp();
      window.fighter_features = "Second Wind: You have a limited well of stamina that you can draw on to protect yourself from harm. On your turn you can use a bonus action to regain hit points equal to 1d10 + your fighter level. (Daily)";
      $("input#ch_armp").val("All armor, shields");
      $("input#ch_wepp").val("Simple weapons, martial weapons");
      $("input#ch_hd").val("1d10");
      $("input#ch_stp").val("Strength^Constitution");
      $("input#ch_skillcount").val(2);
      $("input#ch_classfeat").val(window.fighter_features);
      class_skills = ["Acrobatics", "Animal Handling", "Athletics", "History", "Insight", "Intimidation", "Perception", "Survival"];
      $(".ch_fighter_style").prop('checked', false); //Uncheck fighter style
    }

    //If wizard
    if ($("input#ch_class").val() == "Wizard") {
      getTotalHp();
      $("input#ch_wepp").val("Daggers^Darts^Slings^Quarterstaffs^Light Crossbows"); //Weapon proficiencies
      $("input#ch_hd").val("1d6"); //Hit die
      $("input#ch_stp").val("Wisdom^Intelligence"); //Saving throw proficiencies
      $("input#ch_skillcount").val(2); //Skills allowed
      $("input#ch_spellcount").val(6); //1st level spells
      $("input#ch_cantripcount").val(3); //Cantrips @ 1st level
      $("input#ch_classfeat").val("Spellcasting: You have a spellbook containing six, 1st-level wizard spells. You know three wizard cantrips and two 1st level wizard spells of your choice.");
      class_skills = ["Arcana", "History", "Insight", "Investigation", "Medicine", "Religion"];
    }

    //If cleric
    if ($("input#ch_class").val() == "Cleric") {
      getTotalHp();
      window.cleric_features = "Spellcasting: As a conduit for divine power, you can cast cleric spells.^Ritual Casting: You can cast a cleric spell as a ritual if that spell has the ritual tag and you have the spell prepared.^Spellcasting Focus:You can use a holy symbol as a spellcasting focus";
      $("input#ch_classtool").val("");
      $("input#ch_armp").val("Light Armor^Medium Armor^Shields");
      $("input#ch_wepp").val("All Simple Weapons");
      $("input#ch_hd").val("1d8");
      $("input#ch_stp").val("Wisdom^Charisma");
      $("input#ch_skillcount").val(2);
      clericSpellcount();
      //end cleric spell count
      $("input#ch_cantripcount").val(3); //Cantrip count
      window.class_equip = [];
      $("input#ch_classequip").val(window.class_equip);
      $("input#ch_classfeat").val(window.cleric_features);
      class_skills = ["History", "Insight", "Medicine", "Persuasion", "Religion"];
      $(".ch_cleric_style").prop('checked', false); //Uncheck cleric domain
    }

    //Append the notice for the skill list based on class
    $("#skill_count_msg").empty();
    $("#skill_count_msg").append( $("input#ch_skillcount").val() );

    //Spell hider
    $("#cleric_spell_select, #wizard_spell_select").hide();
    if ($("input#ch_class").val() == "Cleric") {
      $("#cleric_spell_select").show();
    }
    else if ($("input#ch_class").val() == "Wizard") {
      $("#wizard_spell_select").show();
    }
  });

  //Cleric domain selection
  $("#cleric_desc").on("change",".ch_cleric_style[type='radio']", function(){
      $("input#ch_classfeat").val(window.cleric_features + "^" + $(this).val());
    });
  
  //Fighting style selection for fighter
    $("#fighter_desc").on("change",".ch_fighter_style[type='radio']", function(){
      $("input#ch_classfeat").val(window.fighter_features + "^" + $(this).val());
    });

  //Class Equipment adding
  $("#fighter_desc, #rogue_desc, #cleric_desc, #wizard_desc").on("change",".item_click[type='radio']", function(){
    var equip_add = []

    $("input.item_click").each(function(  ) {
        if($(this).is(':checked')) {
          equip_add.push( $(this).val());
        }
    });

    $("input#ch_classequip").val(window.class_equip.concat(equip_add)); 
  });  

  
//////////////////////////////////
////// RANDOM ROLL GENERATION /// 
//////////////////////////////// 
  
  //Emulates 4d6 - dropping lowest
  function randomScore() {
    var rolls = [];
    rolls.push(Math.round((Math.random()*5) + 1));
    rolls.push(Math.round((Math.random()*5) + 1));
    rolls.push(Math.round((Math.random()*5) + 1));
    rolls.push(Math.round((Math.random()*5) + 1));
    rolls.sort();
    rolls.splice(0, 1);

    //Adds sum of array values
    var rollsum = rolls.reduce(function(a, b) {
      return a + b;
    });
    return rollsum;
  }

  //Loops through all attributes and assigns randomly
  for (i=0; i <= 6; i++) {
    var uniqueRandom = randomScore();
    $("#liran" + [i]).text(uniqueRandom);
    $("#liran" + [i]).attr("id","rr" + uniqueRandom);
  }

	// Hide stuff with the JavaScript. If JS is disabled, the form will still be usable.
	$(".name_wrap").hide();
  
	// When a dropdown selection is made
  function updateStats(sa) {
    $("input#ch_stats").val(sa);
    $("input#ch_str").val( parseInt(sa[0].slice(2,4)) + window.bonus_str );
    $("input#ch_dex").val( parseInt(sa[1].slice(2,4)) + window.bonus_dex ) ;
    $("input#ch_con").val( parseInt(sa[2].slice(2,4)) + window.bonus_con );
    $("input#ch_int").val( parseInt(sa[3].slice(2,4)) + window.bonus_int );
    $("input#ch_wis").val( parseInt(sa[4].slice(2,4)) + window.bonus_wis );
    $("input#ch_cha").val( parseInt(sa[5].slice(2,4)) + window.bonus_cha );
    getTotalHp();
    clericSpellcount();
  }
  
	$("#attr_type").change(function() {
    $("#step_3").show();
		$(".name_wrap").slideUp().find("input").removeClass("active_name_field");
        var numAttendees = $("#attr_type option:selected").text();
    
        if (numAttendees == "Standard Array") {
         $("#standard_array_wrap").slideDown();
          
          $( '.sasortable' ).sortable({
              create: function() {
                var statArray = $(this).sortable('toArray');
                updateStats(statArray);
              },
              update: function () {
                var statArray = $(this).sortable('toArray');
                updateStats(statArray);
              }
          });
      
        //Refresh and apply values if seleted this option
        $( ".sasortable" ).on('sortupdate', function(){
            var statArray = $( ".sasortable" ).sortable('toArray');
            updateStats(statArray);
      });
      $(".sasortable").trigger('sortupdate');    
			$( ".sasortable" ).disableSelection();
        }
		
        if (numAttendees == "Dice Roll") {
         $("#dice_roll_wrap").slideDown();
          
        	$( '.drsortable' ).sortable({
            create: function() {
              var statArray = $(this).sortable('toArray');
              updateStats(statArray);
            },
            update: function () {
              var statArray = $(this).sortable('toArray');
              updateStats(statArray);
          }
      });
          
      //Refresh and apply values if seleted this option
      $( ".drsortable" ).on('sortupdate', function(){
        var statArray = $( ".drsortable" ).sortable('toArray');
        updateStats(statArray);
      });
            
      $(".drsortable").trigger('sortupdate'); 
			$( ".drsortable" ).disableSelection();
        }
        
		if (numAttendees == "Point Buy") {
		  $("#point_buy_wrap").slideDown().find("input").addClass("active_name_field");
      updatepbStats();
		}
    
	});
  
/////////////////////////////////
////// BEGIN POINT-BUY STUFF /// 
///////////////////////////////

  //PB Strength Plus 
	$("#pb_str_plus").click(function(){
    if ($("#pb_str").html() < 15 && $("#pb_total").html() > 0){
      if ($("#pb_str").html() > 12 && $("#pb_total").text()-2 >= 0) {
        $("#pb_total").text($("#pb_total").text()-2);
        $("#pb_str").text(parseInt($("#pb_str").text())+1);
      }
      else if ($("#pb_str").html() > 7 && $("#pb_total").text()-1 >= 0 ) {
        $("#pb_total").text($("#pb_total").text()-1);
        $("#pb_str").text(parseInt($("#pb_str").text())+1);
      }
    }
	});
  //PB Strength Minus
	$("#pb_str_min").click(function(){
    if ($("#pb_str").html() >= 9) {
        $("#pb_str").text(parseInt($("#pb_str").text())-1);
        $("#pb_total").text(parseInt($("#pb_total").text())+1);
      }
      if ($("#pb_str").html() >= 13) {
        $("#pb_total").text(parseInt($("#pb_total").text())+1);
        }
	});
  
   //PB Dexterity Plus 
	$("#pb_dex_plus").click(function(){
    if ($("#pb_dex").html() < 15 && $("#pb_total").html() > 0){
      
      if ($("#pb_dex").html() > 12 && $("#pb_total").text()-2 >= 0) {
        $("#pb_total").text($("#pb_total").text()-2);
        $("#pb_dex").text(parseInt($("#pb_dex").text())+1);
      }
      else if ($("#pb_dex").html() > 7 && $("#pb_total").text()-1 >= 0 ) {
        $("#pb_total").text($("#pb_total").text()-1);
        $("#pb_dex").text(parseInt($("#pb_dex").text())+1);
      }
    }
	});
  //PB Dexterity Minus
	$("#pb_dex_min").click(function(){
    if ($("#pb_dex").html() >= 9) {
        $("#pb_dex").text(parseInt($("#pb_dex").text())-1);
        $("#pb_total").text(parseInt($("#pb_total").text())+1);
      }
      if ($("#pb_dex").html() >= 13) {
        $("#pb_total").text(parseInt($("#pb_total").text())+1);
        }
	});

  //PB Intelligence Plus 
	$("#pb_int_plus").click(function(){
    if ($("#pb_int").html() < 15 && $("#pb_total").html() > 0){
      
      if ($("#pb_int").html() > 12 && $("#pb_total").text()-2 >= 0) {
        $("#pb_total").text($("#pb_total").text()-2);
        $("#pb_int").text(parseInt($("#pb_int").text())+1);
      }
      else if ($("#pb_int").html() > 7 && $("#pb_total").text()-1 >= 0 ) {
        $("#pb_total").text($("#pb_total").text()-1);
        $("#pb_int").text(parseInt($("#pb_int").text())+1);
      }
    }
	});
  //PB Intelligence Minus
	$("#pb_int_min").click(function(){
    if ($("#pb_int").html() >= 9) {
        $("#pb_int").text(parseInt($("#pb_int").text())-1);
        $("#pb_total").text(parseInt($("#pb_total").text())+1);
      }
      if ($("#pb_int").html() >= 13) {
        $("#pb_total").text(parseInt($("#pb_total").text())+1);
        }
	});
  
  //PB Wisdom Plus 
	$("#pb_wis_plus").click(function(){
    if ($("#pb_wis").html() < 15 && $("#pb_total").html() > 0){
      if ($("#pb_wis").html() > 12 && $("#pb_total").text()-2 >= 0) {
        $("#pb_total").text($("#pb_total").text()-2);
        $("#pb_wis").text(parseInt($("#pb_wis").text())+1);
      }
      else if ($("#pb_wis").html() > 7 && $("#pb_total").text()-1 >= 0 ) {
        $("#pb_total").text($("#pb_total").text()-1);
        $("#pb_wis").text(parseInt($("#pb_wis").text())+1);
      }
    }
    clericSpellcount();
	});
  //PB Widsom Minus
	$("#pb_wis_min").click(function(){
    if ($("#pb_wis").html() >= 9) {
        $("#pb_wis").text(parseInt($("#pb_wis").text())-1);
        $("#pb_total").text(parseInt($("#pb_total").text())+1);
      }
      if ($("#pb_wis").html() >= 13) {
        $("#pb_total").text(parseInt($("#pb_total").text())+1);
        }
    clericSpellcount();
	});
  
  //PB Charisma Plus 
	$("#pb_cha_plus").click(function(){
    if ($("#pb_cha").html() < 15 && $("#pb_total").html() > 0){
      
      if ($("#pb_cha").html() > 12 && $("#pb_total").text()-2 >= 0) {
        $("#pb_total").text($("#pb_total").text()-2);
        $("#pb_cha").text(parseInt($("#pb_cha").text())+1);
      }
      else if ($("#pb_cha").html() > 7 && $("#pb_total").text()-1 >= 0 ) {
        $("#pb_total").text($("#pb_total").text()-1);
        $("#pb_cha").text(parseInt($("#pb_cha").text())+1);
      }
    }
	});
  //PB Charisma Minus
	$("#pb_cha_min").click(function(){
    if ($("#pb_cha").html() >= 9) {
        $("#pb_cha").text(parseInt($("#pb_cha").text())-1);
        $("#pb_total").text(parseInt($("#pb_total").text())+1);
      }
      if ($("#pb_cha").html() >= 13) {
        $("#pb_total").text(parseInt($("#pb_total").text())+1);
        }
	});
  
  //PB Con Plus 
	$("#pb_con_plus").click(function(){
    if ($("#pb_con").html() < 15 && $("#pb_total").html() > 0){
      
      if ($("#pb_con").html() > 12 && $("#pb_total").text()-2 >= 0) {
        $("#pb_total").text($("#pb_total").text()-2);
        $("#pb_con").text(parseInt($("#pb_con").text())+1);
      }
      else if ($("#pb_con").html() > 7 && $("#pb_total").text()-1 >= 0 ) {
        $("#pb_total").text($("#pb_total").text()-1);
        $("#pb_con").text(parseInt($("#pb_con").text())+1);
      }
    }
	});
  //PB Con Minus
	$("#pb_con_min").click(function(){
    if ($("#pb_con").html() >= 9) {
        $("#pb_con").text(parseInt($("#pb_con").text())-1);
        $("#pb_total").text(parseInt($("#pb_total").text())+1);
      }
      if ($("#pb_con").html() >= 13) {
        $("#pb_total").text(parseInt($("#pb_total").text())+1);
        }
	});
  
  //Any time a pb button is clicked, it updates form
  $(".pointbuy").click(function(){
    updatepbStats();
  });
  
/////////////////////////
//// ALIGNMENT STUFF ///
///////////////////////
    
  $('[data-slider]').on('change.fndtn.slider', function(){
    var current = $('#alignslider').attr('data-slider');
    var translation = "Neutral";

    if (current == 1){
      translation = "Lawful Good (LG)";
    }
    else if (current == 2){
      translation = "Neutral good (NG)";
    }
    else if (current == 3){
      translation = "Chaotic good (CG)";
    }
    else if (current == 4){
      translation = "Lawful Neutral (LN)";
    }
    else if (current == 5){
      translation = "Neutral (N)";
    }
    else if (current == 6){
      translation = "Chaotic Neutral (CN)";
    }
    else if (current == 7){
      translation = "Lawful Evil (LE)";
    }
    else if (current == 8){
      translation = "Neutral Evil (NE)";
    }
    else if (current == 9){
      translation = "Chaotic Evil (CE)";
    }

    $("input#ch_alignment").val(translation);
  });
  
  
/////////////////////////////////
////// BACKGROUND SELECTION  /// 
///////////////////////////////

function resetBg(){
  $("input#ch_trait, input#ch_bond, input#ch_ideal, input#ch_flaw").val("");
  $("input#ch_bg_skills, input#ch_bg_equip, input#ch_bg_tools, input#ch_bg_features, input#ch_bg_lang").val("");
}

$(".bg_click").click(function(event){
  resetBg(); //Reset everything before form gets filled
  $("input#ch_background").val($(this).text());  //Background name
  $("input#ch_bg_skills").val( $('#' + $(this).text().toLowerCase() + '_bg_skills').text() ); //Bg Skills
  $("input#ch_bg_equip").val( $('#' + $(this).text().toLowerCase() + '_bg_equip').text() ); //Bg Equipment
  $("input#ch_bg_features").val( $('#' + $(this).text().toLowerCase() + '_bg_features').text() ); //Bg Features
  $("input#ch_bg_tools").val( $('#' + $(this).text().toLowerCase() + '_bg_tools').text() ); //Bg Tools
  $("input#ch_bg_lang").val( $('#' + $(this).text().toLowerCase() + '_bg_lang').text() ); //Bg Lang
});  
  
$(".trait_click").click(function(event){
  click_id = $(this).attr('id');
  $("input#ch_trait").val($('label[for=' + click_id + ']').text());
});  
  
$(".ideal_click").click(function(event){
  click_id = $(this).attr('id');
  $("input#ch_ideal").val($('label[for=' + click_id + ']').text());
});  
  
$(".flaw_click").click(function(event){
  click_id = $(this).attr('id');
  $("input#ch_flaw").val($('label[for=' + click_id + ']').text());
});  
  
$(".bond_click").click(function(event){
  click_id = $(this).attr('id');
  $("input#ch_bond").val($('label[for=' + click_id + ']').text());
});  
  
//////////////////////////////////////
//// SKILL VALIDATION / SELECTION ///
////////////////////////////////////
  
//Also enable only those skill options applicable to that class
$("a.class_click").click(function(event){
  event.preventDefault();
  $("#step_35").show();
  $("#step_4").show();
  $(window).trigger('resize'); //Force resize so alignment slider isn't broken for big screens
  $("input.ch_rogue_skillprof").hide();
  $("input.ch_skillprof").hide();
  $(".skill_label").hide(); //Hide all labels for skills
  $(".rogue_skill_label").hide(); //Hide rogue labels
  
  //Uncheck all spells
  $("input.ch_spells_wizard, input.ch_cantrips_wizard, input.ch_cantrips_cleric, input.ch_spells_cleric").each(function(  ) {
    $(this).attr('checked', false);
  });
  
  //Uncheck item selections on class tab
  $("input.item_click").each(function(  ) {
      $(this).attr('checked', false);
  });
  
  //Iterate over class skills and hide/show appropriate skills for selection
  $.each (class_skills, function( index, value ){

    //Show all labels for applicable class skills
    $('label[for='+'"'+String(value).toLowerCase()+'_id"'+']').show();
    $("input.ch_skillprof").each(function(i, obj) {
      //Uncheck all options to prevent hidden from being checked
      $(this).attr('checked', false);

      //Show checkbox if skill is on class_skills    
      if (value == $(this).val()) {
        $(this).toggle();
        //$('label[for='+'"'+$(this).attr('id')+'"'+']').show();

        //console.log($('label[for='+'"'+$(this).attr('id')+'"'+']'));
        //console.log(class_skills);
      }
    });
  });

  // Hide perception if they're an elf
  if ($('input#ch_race').val().indexOf("Elf") != -1){
    $("label[for='perception_id']").hide();
    $("input#perception_id").hide(); //Hide perception since elves already get it
  }
  
});

  //Limit # of  skills based on character class
  $('input.ch_skillprof').on('change', function(evt) {
    var selected_skills = []; //Needed for rogue expertise
    //Define skill limit based on class selection
    var prof_limit = $('#ch_skillcount').val();
    //Limit skill checks based on character class
     if($('.ch_skillprof:checkbox:checked').length > prof_limit) {
         this.checked = false;
     }
    
    //Append skill prompt letting user know how many skills they have left
    $('#skill_count_msg').empty();
    if ($('#ch_skillcount').val()-$('.ch_skillprof:checkbox:checked').length > 0){
      $("#skill_count_msg").append( $('#ch_skillcount').val()-$('.ch_skillprof:checkbox:checked').length );
    }
    else {
      $("#skill_count_msg").append( "0" );
    }
    
    //Add all checked to input field
    //$('#ch_class_skills').val($('.ch_skillprof:checkbox:checked'));
    $('#ch_class_skills').val("");
    
    $('.ch_skillprof:checkbox:checked').each(function( index ) {
      $('#ch_class_skills').val( $('#ch_class_skills').val() + $("label[for='"+$(this).attr("id")+"']").text() + "^" );
      selected_skills.push( $(this).val() ); //Push all selected skills to array for rogue expertise to iterate through below
    });
    
    //Rogue expertise enable inputs and labels
    $(".rogue_skill_label").hide(); //hide before iteration
    $(".ch_rogue_skillprof").hide(); //hide before iteration
    $("#rogue_thtools_id").show(); //Thieves tools are unique
    //Iterate and show only the skill inputs for selected skills
    $.each (selected_skills, function( index, value ){
      $('label[for='+'"rogue_'+ value.toLowerCase() +'_id"'+']').show();
      $('input[id='+'"rogue_'+ value.toLowerCase() +'_id"'+']').show();
      //Had to use attribute selector becuase one or more ids had spaces in them
    });
    
    //Rogue expertise form functionality
    
    $('input.ch_rogue_skillprof').on('change', function(evt) {
      //Can only choose 2 skills for expertise 
      if($('.ch_rogue_skillprof:checkbox:checked').length > 2) {
        this.checked = false;
       }
      //Add selections to hidden form field
      $('#ch_rogue_expertise').val("");
      $('input.ch_rogue_skillprof:checkbox:checked').each(function( index ) {
        $('#ch_rogue_expertise').val( $('#ch_rogue_expertise').val() + $("label[for='"+$(this).attr("id")+"']").text() + "^" );
      });
    });
      
  });
  
//////////////////////////////////////
//// SPELL VALIDATION / SELECTION ///
////////////////////////////////////

  //WIZARD LVL 1 SPELLS
  $('input.ch_spells_wizard').on('change', function(evt) {
    var spell_limit = $('#ch_spellcount').val();
    if($('.ch_spells_wizard:checkbox:checked').length > spell_limit) {
         this.checked = false;
     }
    $('#ch_spells_selected').val(""); //Empty field
    $('.ch_spells_wizard:checkbox:checked').each(function( index ) {
      $('#ch_spells_selected').val( $('#ch_spells_selected').val() + $("label[for='"+$(this).attr("id")+"']").text() + "^" ); 
    }); //Add selections to hidden form field
  });
  
  $('input.ch_cantrips_wizard').on('change', function(evt) {
    var cantrip_limit = $('#ch_cantripcount').val();
    if($('.ch_cantrips_wizard:checkbox:checked').length > cantrip_limit) {
         this.checked = false;
     }
    $('#ch_cantrips_selected').val(""); //Empty field
    $('.ch_cantrips_wizard:checkbox:checked').each(function( index ) {
      $('#ch_cantrips_selected').val( $('#ch_cantrips_selected').val() + $("label[for='"+$(this).attr("id")+"']").text() + "^" ); 
    }); //Add selections to hidden form field
  });
  //CLERIC LVL 1 SPELLS
  $('input.ch_spells_cleric').on('change', function(evt) {
    var spell_limit = $('#ch_spellcount').val();
    if($('.ch_spells_cleric:checkbox:checked').length > spell_limit) {
         this.checked = false;
     }
    $('#ch_spells_selected').val(""); //Empty field
    $('.ch_spells_cleric:checkbox:checked').each(function( index ) {
      $('#ch_spells_selected').val( $('#ch_spells_selected').val() + $("label[for='"+$(this).attr("id")+"']").text() + "^" ); 
    }); //Add selections to hidden form field
  });
  //CLERIC CANTRIPS
  $('input.ch_cantrips_cleric').on('change', function(evt) {
    var cantrip_limit = $('#ch_cantripcount').val();
    if($('.ch_cantrips_cleric:checkbox:checked').length > cantrip_limit) {
         this.checked = false;
     }
    $('#ch_cantrips_selected').val(""); //Empty field
    $('.ch_cantrips_cleric:checkbox:checked').each(function( index ) {
      $('#ch_cantrips_selected').val( $('#ch_cantrips_selected').val() + $("label[for='"+$(this).attr("id")+"']").text() + "^" ); 
    }); //Add selections to hidden form field
  });
  
  
//////////////////////////////////////
////   SUBMIT FINAL VALIDATIONS   ///
////////////////////////////////////  
  
  $('#submit_button').click(function(e) {
    console.log($('#ch_classequip').val());
    
    //Name validation
    if ( $('#ch_name').val() === "" ){
      swal({   title: "Whoah there!",   
               text: "Your character needs a name first!", 
               type: "error",confirmButtonText: "Ok" });
      $('html, body').animate({
              scrollTop: $('#ch_name').offset().top-100
          }, 500);
    }
    //Race validation
    else if ( $('#ch_race').val() === "" ){
      swal({   title: "Whoah there!",   
               text: "You need to pick a race first!", 
               type: "error",confirmButtonText: "Ok" });
      $('html, body').animate({
              scrollTop: $('#ch_race').offset().top-100
          }, 500);
    }
    //Stat validation
    else if ( $('#attr_type').val() == 0 ){
      swal({   title: "Whoah there!",   
               text: "You need some stats!", 
               type: "error",confirmButtonText: "Ok" });
      $('html, body').animate({
              scrollTop: $('#attr_type').offset().top-100
          }, 500);
    }
    //Class validation
    else if ( $('.item_click').val() === "" ){
      swal({   title: "Whoah there!",   
               text: "You need to pick a class first!", 
               type: "error",confirmButtonText: "Ok" });
      $('html, body').animate({
              scrollTop: $('#ch_class').offset().top-100
          }, 500);
    }
    //Class Equip validation
    else if ( $('#ch_classequip').val() === "" ){
      swal({   title: "Whoah there!",   
               text: "You need to get some gear first!", 
               type: "error",confirmButtonText: "Ok" });
      $('html, body').animate({
              scrollTop: $('#ch_class').offset().top-100
          }, 500);
    }
    //Skills validation
    else if ( $('#ch_class_skills').val() === "" ){
      swal({   title: "Whoah there!",   
               text: "You need to pick some skills first!", 
               type: "error",confirmButtonText: "Ok" });
      $('html, body').animate({
              scrollTop: $('#ch_class_skills').offset().top-100
          }, 500);
    }
    //Background validation
    else if ( $('#ch_background').val() === "" ){
      swal({   title: "Whoah there!",   
               text: "You need to pick a background!", 
               type: "error",confirmButtonText: "Ok" });
      $('html, body').animate({
              scrollTop: $('#ch_background').offset().top-100
          }, 500);
    }
    else {
      $("#character_form").submit();
    }
  });
  
});