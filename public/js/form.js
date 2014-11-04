//When DOM is ready
$(document).ready(function(){

 //Starting globals
  var weapon_prof = [];
  var skill_prof = [];
  var race_features = [];
  var class_features = [];
  var class_savingthrows = [];
  var race_selection = "";
  var class_equip = [];
  var class_skills = [];
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
    //console.log( $("input#ch_class").val() );
    
    var total_hp = (base + parseInt($("input#ch_con").val()) + window.bonus_hp);
    $("input#ch_hp").val(total_hp);
    //console.log(window.bonus_hp);
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

  //Reset stats 
  //Need to run on all main classes to clear bonuses from previous selections
  function resetStats(){
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
  resetStats();
  
  //Assign race features with delimeter of ^
  function assignRaceFeatures() {
    $("input#ch_race_features").val(race_features.join("^"));
  }
  
  //Hidden things
  $("input.ch_skillprof").hide();


//////////////////////////////////////
////  BEGIN RACE DEFENITIONS&LOGIC // 
////////////////////////////////////

  //Human racial  
  $("#panel_hum").click(function(event){
    resetStats();
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
    resetStats();
    event.preventDefault();
    race_selection = "dwa";
    window.bonus_con = 2;
    $("input#ch_race_languages").val("Common & Dwarvish");
    $("input#ch_size").val("Medium");
    $("input#ch_speed").val("25 ft.*");
    $("input#ch_race_weapon_prof").val("battleaxe^handaxe^throwing hammer^warhammer");
  });

  //Mountain Dwarf
  $("#dwarf_desc").on("click","#panel_mdwa", function(){
    race_selection = "mdwa";
    resetStats();
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
    $(".feature_"+ race_selection ).each(function(  ) {
      race_features.push( $(this).text());
    });
    assignRaceFeatures(); 
    getTotalHp();
  });

  //Hill Dwarf
  $("#dwarf_desc").on("click","#panel_hdwa", function(){
    race_selection = "hdwa";
    resetStats();
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
    $(".feature_"+ race_selection ).each(function(  ) {
      race_features.push( $(this).text());
    });
    //Note to add 1 each level
    race_features.push("Dwarven Toughness. Your maximum HP increased by 1 each level (already added).")
    assignRaceFeatures();
    getTotalHp();
  });
  
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
  
  


  //Elf racial preloads
  $("#panel_elf").click(function(event){
    resetStats();
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
    resetStats();
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
    assignRaceFeatures(); 
    //Helf no speed increase
    $("input#ch_speed").val("30 ft.");
    $("input#ch_race_skill_prof").val("Perception");
    getTotalHp();
  }); 

  //Wood Elf
  $("#elf_desc").on("click","#panel_welf", function(){
    resetStats();
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
    assignRaceFeatures(); 
    $("input#ch_race_skill_prof").val("Perception");
    getTotalHp();
  }); 

  //Dark Elf
  $("#elf_desc").on("click","#panel_delf", function(){
    resetStats();
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
    assignRaceFeatures();
    $("input#ch_race_skill_prof").val("Perception");
    getTotalHp();
  }); 


  //Halfling racial preloads
  $("#panel_hal").click(function(event){
    resetStats();
    event.preventDefault();
    race_selection = "hal";

    window.bonus_dex = 2;
    $("input#ch_race_languages").val("Common^Halfling");
    $("input#ch_size").val("Small");
    $("input#ch_speed").val("25 ft.");
  });

  //Lightfood Halfling preloads
  $("#halfling_desc").on("click","#panel_lhal", function(){
    resetStats();
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
    assignRaceFeatures(); 
    getTotalHp();
  });

  //Stout Halfling preloads
  $("#halfling_desc").on("click","#panel_shal", function(){
    resetStats();
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
    alt_button = $( "#panel_shal" ).css( "class" );
    getTotalHp();
  });

  //When a race option is selected
  $(".race_click").click(function(event){
    $(".race_click" ).removeClass( "secondary" ); //Clear button highlights
    race_features = [];
    $(".feature_"+ race_selection ).each(function(  ) {
     race_features.push( $(this).text());
    });

    assignRaceFeatures();
    $("input#ch_race").val($(this).html());
    getTotalHp();
  });



/////////////////////////////////////////
//////  CLASS DEFENITIONS & LOGIC  ///// 
///////////////////////////////////////

  $(".class_click").click(function(event){
    $("input#ch_class").val($(this).html());
    $("#class_msg").empty();
    $("#class_msg").append($(this).html());


    //If rogue
    if ($("input#ch_class").val() == "Rogue") {
      getTotalHp();
      
      $("input#ch_classtool").val("Thieves' Tools");
      $("input#ch_armp").val("Light Armor");
      $("input#ch_wepp").val("Simple weapons^hand crossbows^longswords^rapiers^shortswords");
      $("input#ch_hd").val("1d8");
      $("input#ch_stp").val("Dexterity^Intelligence");
      $("input#ch_skillcount").val(4);
      $("input#ch_spellcount").val(0);
      window.class_equip = "Leather Armor^Two Daggers^Thieve's Tools";
      $("input#ch_classequip").val(window.class_equip);
      $("input#ch_classfeat").val("Thieves' Cant: A secret language known only to thieves.^ Sneak Attack: Once per turn you can deal an extra 1d6 damage to one creature you hit with an attack if you have advantage on the attack roll.");
      class_skills = ["Acrobatics", "Athletics", "Deception", "Insight", "Intimidation", "Investigation","Perception", "Performance", "Persuasion", "Sleight of Hand", "Stealth"];
    }
    //If Fighter
    if ($("input#ch_class").val() == "Fighter") {
      getTotalHp();
      window.fighter_features = "Second Wind: You have a limited well of stamina that you can draw on to protect yourself from harm. On your turn you can use a bonus action to regain hit points equal to 1d10 + your fighter level. (Daily)";
      $("input#ch_classtool").val("");
      $("input#ch_armp").val("All armor, shields");
      $("input#ch_wepp").val("Simple weapons, martial weapons");
      $("input#ch_hd").val("1d10");
      $("input#ch_stp").val(["Strength", "Constitution"]);
      $("input#ch_skillcount").val(2);
      $("input#ch_spellcount").val(0);
      window.class_equip = [];
      $("input#ch_classequip").val(window.class_equip);
      $("input#ch_classfeat").val(window.fighter_features);
      class_skills = ["Acrobatics", "Animal Handling", "Athletics", "History", "Insight", "Intimidation", "Perception", "Survival"];
    }

    //If wizard
    if ($("input#ch_class").val() == "Wizard") {
      getTotalHp();
      $("input#ch_classtool").val("");
      $("input#ch_armp").val("");
      $("input#ch_wepp").val("Daggers^Darts^Slings^Quarterstaffs^Light Crossbows");
      $("input#ch_hd").val("1d6");
      $("input#ch_stp").val(["Wisdom", "Intelligence"]);
      $("input#ch_skillcount").val(2);
      $("input#ch_spellcount").val(3);
      window.class_equip = [];
      $("input#ch_classequip").val(window.class_equip);
      $("input#ch_classfeat").val("Spellcasting: You have a spellbook containing six, 1st-level wizard spells. You know three wizard cantrips and two 1st level wizard spells of your choice.");
      class_skills = ["Arcana", "History", "Insight", "Investigation", "Medicine", "Religion"];
    }


    //If cleric
    if ($("input#ch_class").val() == "Cleric") {
      getTotalHp();
      $("input#ch_classtool").val("");
      $("input#ch_armp").val("Light Armor^Medium Armor^Shields");
      $("input#ch_wepp").val("All Simple Weapons");
      $("input#ch_hd").val("1d8");
      $("input#ch_stp").val(["Wisdom", "Charisma"]);
      $("input#ch_skillcount").val(2);
      $("input#ch_spellcount").val(3);
      window.class_equip = [];
      $("input#ch_classequip").val(window.class_equip);
      $("input#ch_classfeat").val("Spellcasting: As a conduit for divine power, you can cast cleric spells. You have two, 1st level spell slots and know up to three cantrips.");
      class_skills = ["History", "Insight", "Medicine", "Persuasion", "Religion"];
    }

    //Append the notice for the skill list based on class
    $("#skill_count_msg").empty();
    $("#skill_count_msg").append( $("input#ch_skillcount").val() );

  });

  //Fighting style selection for fighter
    $("#fighter_desc").on("change",".ch_fighter_style[type='radio']", function(){
      //alert($(this).val());
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
  }
  
	$("#attr_type").change(function() {

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
  
//When class is selected Clickable tab links populate class field
//Also enable only those skill options applicable to that class
$("a.class_click").click(function(event){
  $("input.ch_skillprof").hide();
  event.preventDefault();
  $("input#ch_class").val($(this).html());
  $(".skill_label").hide(); //Hide all labels for skills
  
  
  
  
  //Uncheck item selections on class tab
  $("input.item_click").each(function(  ) {
      $(this).attr('checked', false)
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
  //$('input.ch_skillprof').hide();
  
  $('input.ch_skillprof').on('change', function(evt) {

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
    });
    
      //Not sure why I added this
      $('input.ch_rogue_skillprof').each(function() {
        if ($(this).is(':checked')) {

            var checked_option = $(this).val();  
            $('input.ch_rogue_expert').each(function() {
              if ($(this).val() == checked_option) {
                $(this).show();
              }
            });

        }
        else {
          var unchecked_option = $(this).val(); 
          $('input.ch_rogue_expert').each(function() {
              if ($(this).val() == unchecked_option) {
                $(this).hide();
              }
            });
        }
    });
  });
  
  

  
});