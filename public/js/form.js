
//When DOM is ready
$(document).ready(function(){

  
 //Sortable tutorial 
 //http://stackoverflow.com/questions/5131460/using-jqueryui-sortable-list-with-forms

 //Starting globals
  var weapon_prof = [];
  var skill_prof = [];
  var race_features = [];
  var class_features = [];
  var class_savingthrows = [];
  var race_selection = "";
  var class_equip = [];
  var class_skills = [];


  //Reset stats 
  //Need to run on all main classes to clear bonuses from previous selections
  function resetStats(){
    var bonus_str = 0;
    var bonus_int = 0;
    var bonus_wis = 0;
    var bonus_cha = 0;
    var bonus_dex = 0;
    var bonus_con = 0;
    var bonus_hp = 0;
    $("input#ch_race_armor_prof").val([]);
    $("input#ch_race_skill_prof").val("");
    $("input#ch_race_weapon_prof").val([]);
    $("input#ch_race_langcount").val(0);
    $(".tool_click").attr('checked',false);
  }
  resetStats();
  
//Hidden things
$("input.ch_skillprof").hide();
  
  
   ///////////////////////////////////
  //  BEGIN RACE DEFENITIONS&LOGIC // 
 ///////////////////////////////////
  
//Human racial  
$("#panel_hum").click(function(event){
  resetStats();
  event.preventDefault();
  race_selection = "hum";
  $("input#ch_race_langcount").val(1);
  bonus_str = 1;
  bonus_int = 1;
  bonus_wis = 1;
  bonus_cha = 1;
  bonus_dex = 1;
  bonus_con = 1;
  bonus_hp = 1;
  $("input#ch_race_languages").val("Common");
  $("input#ch_size").val("Medium");
  $("input#ch_speed").val("30 ft.");
});
  

//Dwarf racial preloads
$("#panel_dwa").click(function(event){
  resetStats();
  event.preventDefault();
  race_selection = "dwa";
  bonus_con = 2;
  $("input#ch_race_languages").val("Common & Dwarvish");
  $("input#ch_size").val("Medium");
  $("input#ch_speed").val("25 ft. (Not reduced by heavy armor.)");
  $("input#ch_race_weapon_prof").val(["battleaxe","handaxe","throwing hammer","warhammer"]);
});
  
//Mountain Dwarf
$("#dwarf_desc").on("click","#panel_mdwa", function(){
  race_selection = "mdwa";
  resetStats();
  
  $("input#ch_race").val("Dwarf (Mountain Dwarf)");
  bonus_str = 2;
  bonus_con = 2;
  $("input#ch_race_armor_prof").val(["light","medium"]);
  //Add features for dwarf and mdwarf
  race_features = [];
  $(".feature_dwa").each(function(  ) {
    race_features.push( $(this).text());
  });
  $(".feature_"+ race_selection ).each(function(  ) {
    race_features.push( $(this).text());
  });
  $("input#ch_race_features").val(race_features); 
});

//Hill Dwarf
$("#dwarf_desc").on("click","#panel_hdwa", function(){
  race_selection = "hdwa";
  resetStats();
  $("input#ch_race").val("Dwarf (Hill Dwarf)");
  bonus_wis = 1;
  bonus_con = 2;
  bonus_hp = 1;
  $("input#ch_race_armor_prof").val(["light","medium"]);
  //Add features for dwarf and mdwarf
  race_features = [];
  $(".feature_dwa").each(function(  ) {
    race_features.push( $(this).text());
  });
  $(".feature_"+ race_selection ).each(function(  ) {
    race_features.push( $(this).text());
  });
  //Note to add 1 each level
  race_features.push("Dwarven Toughness. Your maximum HP increased by 1 each level.")
  $("input#ch_race_features").val(race_features); 
});
  

//Elf racial preloads
$("#panel_elf").click(function(event){
  resetStats();
  event.preventDefault();
  race_selection = "elf";
  
  bonus_int = 1;
  $("input#ch_race_languages").val("Common & Elvish");
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
  bonus_int = 3;
  //Helf weapon prof
  $("input#ch_race_weapon_prof").val(["longsword", "shortsword", "shortbow", "longbow"]);
  //Adds features for elf and helf
  race_features = [];
  $(".feature_elf").each(function(  ) {
   race_features.push( $(this).text());
  });
  $(".feature_"+ race_selection ).each(function(  ) {
   race_features.push( $(this).text());
  });
  $("input#ch_race_features").val(race_features); 
  //Helf no speed increase
  $("input#ch_speed").val("30 ft.");
}); 

//Wood Elf
$("#elf_desc").on("click","#panel_welf", function(){
  resetStats();
  race_selection = "welf";
  $("input#ch_race").val("Elf (Wood Elf)");
  //Welf gets +1 wis
  bonus_wis = 1;
  bonus_int = 2;
  //Welf speed increase
  $("input#ch_speed").val("35 ft.");
  //Welf weapon prof
  $("input#ch_race_weapon_prof").val(["longsword", "shortsword", "shortbow", "longbow"]);
  //Adds features for elf and helf
  race_features = [];
  $(".feature_elf").each(function(  ) {
   race_features.push( $(this).text());
  });
  $(".feature_"+ race_selection ).each(function(  ) {
   race_features.push( $(this).text());
  });
  $("input#ch_race_features").val(race_features); 
}); 
  
//Dark Elf
$("#elf_desc").on("click","#panel_delf", function(){
  resetStats();
  race_selection = "delf";
  $("input#ch_race").val("Elf (Dark Elf)");
  //Delf gets +1 wis
  bonus_int = 1;
  bonus_cha = 1;
  //Delf no speed increase
  $("input#ch_speed").val("30 ft.");
  //Delf weapon prof
  $("input#ch_race_weapon_prof").val(["rapiers","shortswords","hand crossbows"]);
  //Adds features for elf and helf
  race_features = [];
  $(".feature_elf").each(function(  ) {
   race_features.push( $(this).text());
  });
  $(".feature_"+ race_selection ).each(function(  ) {
   race_features.push( $(this).text());
  });
  $("input#ch_race_features").val(race_features); 
}); 
  

//Halfling racial preloads
$("#panel_hal").click(function(event){
  resetStats();
  event.preventDefault();
  race_selection = "hal";
  
  bonus_dex = 2;
  $("input#ch_race_languages").val("Common & Halfling");
  $("input#ch_size").val("Small");
  $("input#ch_speed").val("25 ft.");
});
  
//Lightfood Halfling preloads
$("#halfling_desc").on("click","#panel_lhal", function(){
  resetStats();
  event.preventDefault();
  race_selection = "lhal";
  $("input#ch_race").val("Halfling (Lightfoot)");
  bonus_dex = 2;
  bonus_cha = 1;
   //Adds features for normal half
  race_features = [];
  $(".feature_hal").each(function(  ) {
   race_features.push( $(this).text());
  });
  $(".feature_"+ race_selection ).each(function(  ) {
   race_features.push( $(this).text());
  });
  $("input#ch_race_features").val(race_features); 
});
  
//Stout Halfling preloads
$("#halfling_desc").on("click","#panel_shal", function(){
  resetStats();
  event.preventDefault();
  race_selection = "shal";
  $("input#ch_race").val("Halfling (Stout)");
  
  bonus_dex = 2;
  bonus_con = 1;
 //Adds features for normal half
  race_features = [];
  $(".feature_hal").each(function(  ) {
   race_features.push( $(this).text());
  });
  $(".feature_"+ race_selection ).each(function(  ) {
   race_features.push( $(this).text());
  });
  $("input#ch_race_features").val(race_features); 
  var alt_button = "button secondary race_click"
  
  alt_button = $( "#panel_shal" ).css( "class" );
});
  
  
  
   ///////////////////////////////////
  // BEGIN CLASS DEFENITIONS&LOGIC // 
 ///////////////////////////////////
  


$(".class_click").click(function(event){
  $("input#ch_class").val($(this).html());
  
  //If rogue
  if ($("input#ch_class").val() == "Rogue") {
    var total_hp = (8 + parseInt($("input#ch_con").val()) )
    $("input#ch_hp").val(total_hp);
    $("input#ch_classtool").val("Thieves' Tools");
    $("input#ch_armp").val("Light Armor");
    $("input#ch_wepp").val("Simple weapons, hand crossbows, longswords, rapiers, shortswords");
    $("input#ch_hd").val("1d8");
    $("input#ch_stp").val("Dexterity, Intelligence");
    $("input#ch_skillcount").val(4);
    $("input#ch_spellcount").val(0);
    window.class_equip = ["Leather Armor", "Two Daggers", "Thieve's Tools"];
    $("input#ch_classequip").val(window.class_equip);
    $("input#ch_classfeat").val("Thieves' Cant: A secret language known only to thieves., Sneak Attack: Once per turn, you can deal an extra 1d6 damage to one creature you hit with an attack if you have advantage on the attack roll.");
    class_skills = ["Acrobatics", "Athletics", "Deception", "Insight", "Intimidation", "Investigation","Perception", "Performance", "Persuasion", "Sleight of Hand", "Stealth"];
  }
  //If Fighter
  if ($("input#ch_class").val() == "Fighter") {
    var total_hp = (10 + parseInt($("input#ch_con").val()) )
    window.fighter_features = "Second Wind: You have a limited well of stamina that you can draw on to protect yourself from harm. On your turn, you can use a bonus action to regain hit points equal to 1d10 + your fighter level. (Daily)";
    $("input#ch_hp").val(total_hp);
    $("input#ch_classtool").val("");
    $("input#ch_armp").val("All armor, shields");
    $("input#ch_wepp").val("Simple weapons, martial weapons");
    $("input#ch_hd").val("1d10");
    $("input#ch_stp").val("Strength, Constitution");
    $("input#ch_skillcount").val(2);
    $("input#ch_spellcount").val(0);
    window.class_equip = [];
    $("input#ch_classequip").val(window.class_equip);
    $("input#ch_classfeat").val(window.fighter_features);
    class_skills = ["Acrobatics", "Animal Handling", "Athletics", "History", "Insight", "Intimidation", "Perception", "Survival"];
  }
  
  //If wizard
  if ($("input#ch_class").val() == "Wizard") {
    var total_hp = (6 + parseInt($("input#ch_con").val()) )
    $("input#ch_hp").val(total_hp);
    $("input#ch_classtool").val("");
    $("input#ch_armp").val("");
    $("input#ch_wepp").val("Daggers, Darts, Slings, Quarterstaffs, Light Crossbows");
    $("input#ch_hd").val("1d6");
    $("input#ch_stp").val("Wisdom, Intelligence");
    $("input#ch_skillcount").val(2);
    $("input#ch_spellcount").val(3);
    window.class_equip = [];
    $("input#ch_classequip").val(window.class_equip);
    $("input#ch_classfeat").val("Spellcasting: You have a spellbook containing six, 1st-level wizard spells. You know three wizard cantrips and two 1st level wizard spells of your choice.");
    class_skills = ["Arcana", "History", "Insight", "Investigation", "Medicine", "Religion"];
  }
  
  
  //If cleric
  if ($("input#ch_class").val() == "Cleric") {
    var total_hp = (8 + parseInt($("input#ch_con").val()) )
    $("input#ch_hp").val(total_hp);
    $("input#ch_classtool").val("");
    $("input#ch_armp").val("Light Armor, Medium Armor, Shields");
    $("input#ch_wepp").val("All Simple Weapons");
    $("input#ch_hd").val("1d8");
    $("input#ch_stp").val("Wisdom, Charisma");
    $("input#ch_skillcount").val(2);
    $("input#ch_spellcount").val(3);
    window.class_equip = [];
    $("input#ch_classequip").val(window.class_equip);
    $("input#ch_classfeat").val("Spellcasting: As a conduit for divine power, you can cast cleric spells. You have two, 1st level spell slots and know up to three cantrips.");
    class_skills = ["History", "Insight", "Medicine", "Persuasion", "Religion"];
  }
});

//Fighting style selection for fighter
  $("#fighter_desc").on("change",".ch_fighter_style[type='radio']", function(){
    //alert($(this).val());
    $("input#ch_classfeat").val(window.fighter_features + "," + $(this).val());
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

  
//Background selections
  
function resetBg(){
  $("input#ch_trait, input#ch_bond, input#ch_ideal, input#ch_flaw, input#ch_bg_tools, input#ch_bg_features").val("");
  $("input#ch_bg_skills, input#ch_bg_equip").val("");
}

$(".bg_click").click(function(event){
  resetBg(); //Reset everything before replacement
  $("input#ch_background").val($(this).text());  //Background name
  $("input#ch_bg_skills").val( $('#' + $(this).text().toLowerCase() + '_bg_skills').text() ); //BG Skills
  $("input#ch_bg_equip").val( $('#' + $(this).text().toLowerCase() + '_bg_equip').text() ); //Bg Equipment
  $("input#ch_bg_features").val( $('#' + $(this).text().toLowerCase() + '_bg_features').text() ); //Bg Equipment
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
  
  
  
  
//When a race option is selected
$(".race_click").click(function(event){
  race_features = [];
  $(".feature_"+ race_selection ).each(function(  ) {
   race_features.push( $(this).text());
  });

  $("input#ch_race_features").val(race_features);
  $("input#ch_race").val($(this).html());
});

  
//When class is selected Clickable tab links populate class field
//Also enable only those skill options applicable to that class
$("a.class_click").click(function(event){
  $("input.ch_skillprof").hide();
  event.preventDefault();
  $("input#ch_class").val($(this).html());
  
  $("input.item_click").each(function(  ) {
      $(this).attr('checked', false)
  });
  
    
    $.each (class_skills, function( index, value ){
       //console.log("class_skills:" + value);     
       $("input.ch_skillprof").each(function(i, obj) {
          //Uncheck all options to prevent hidden from being checked
          $(this).attr('checked', false);
          //console.log("input:" + $(this).val());
          if (value == $(this).val()) {
            $(this).toggle();
          }
      });
    });
});

  
//Roll / attribute logic  
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
	$("#attr_type").change(function() {

		$(".name_wrap").slideUp().find("input").removeClass("active_name_field");
        var numAttendees = $("#attr_type option:selected").text();
    
        if (numAttendees == "Standard Array") {
         $("#standard_array_wrap").slideDown();
          
          $( '.sasortable' ).sortable({
              create: function() {
                var statArray = $(this).sortable('toArray');
                $("input#ch_stats").val(statArray);
                $("input#ch_str").val(statArray[0].slice(2,4));
                $("input#ch_dex").val(statArray[1].slice(2,4));
                $("input#ch_con").val(statArray[2].slice(2,4));
                $("input#ch_int").val(statArray[3].slice(2,4));
                $("input#ch_wis").val(statArray[4].slice(2,4));
                $("input#ch_cha").val(statArray[5].slice(2,4));
                var total_hp = (10 + parseInt($("input#ch_con").val()) )
                $("input#ch_hp").val(total_hp);
              },
              update: function () {
                var statArray = $(this).sortable('toArray');
                $("input#ch_stats").val(statArray);
                $("input#ch_str").val(statArray[0].slice(2,4));
                $("input#ch_dex").val(statArray[1].slice(2,4));
                $("input#ch_con").val(statArray[2].slice(2,4));
                $("input#ch_int").val(statArray[3].slice(2,4));
                $("input#ch_wis").val(statArray[4].slice(2,4));
                $("input#ch_cha").val(statArray[5].slice(2,4));
                var total_hp = (10 + parseInt($("input#ch_con").val()) );
                $("input#ch_hp").val(total_hp);
              }
          });
      
        //Refresh and apply values if seleted this option
        $( ".sasortable" ).on('sortupdate', function(){
            var statArray = $( ".sasortable" ).sortable('toArray');
            $("input#ch_stats").val(statArray);
            $("input#ch_str").val(statArray[0].slice(2,4));
            $("input#ch_dex").val(statArray[1].slice(2,4));
            $("input#ch_con").val(statArray[2].slice(2,4));
            $("input#ch_int").val(statArray[3].slice(2,4));
            $("input#ch_wis").val(statArray[4].slice(2,4));
            $("input#ch_cha").val(statArray[5].slice(2,4));
            var total_hp = (10 + parseInt($("input#ch_con").val()) );
            $("input#ch_hp").val(total_hp);
      });
      $(".sasortable").trigger('sortupdate');    
			$( ".sasortable" ).disableSelection();
        }
		
        if (numAttendees == "Dice Roll") {
         $("#dice_roll_wrap").slideDown();
          
        	$( '.drsortable' ).sortable({
            create: function() {
              var statArray = $(this).sortable('toArray');
              $("input#ch_stats").val(statArray);
              $("input#ch_str").val(statArray[0].slice(2,4));
              $("input#ch_dex").val(statArray[1].slice(2,4));
              $("input#ch_con").val(statArray[2].slice(2,4));
              $("input#ch_int").val(statArray[3].slice(2,4));
              $("input#ch_wis").val(statArray[4].slice(2,4));
              $("input#ch_cha").val(statArray[5].slice(2,4));
              var total_hp = (10 + parseInt($("input#ch_con").val()) );
              $("input#ch_hp").val(total_hp);
            },
            update: function () {
              var statArray = $(this).sortable('toArray');
              $("input#ch_stats").val(statArray);
              $("input#ch_str").val(statArray[0].slice(2,4));              
              $("input#ch_dex").val(statArray[1].slice(2,4));
              $("input#ch_con").val(statArray[2].slice(2,4));
              $("input#ch_int").val(statArray[3].slice(2,4));
              $("input#ch_wis").val(statArray[4].slice(2,4));
              $("input#ch_cha").val(statArray[5].slice(2,4));
              var total_hp = (10 + parseInt($("input#ch_con").val()) );
              $("input#ch_hp").val(total_hp);
          }
      });
          
      //Refresh and apply values if seleted this option
        $( ".drsortable" ).on('sortupdate', function(){
            var statArray = $( ".drsortable" ).sortable('toArray');
            $("input#ch_stats").val(statArray);
            $("input#ch_str").val(statArray[0].slice(2,4));
            $("input#ch_dex").val(statArray[1].slice(2,4));
            $("input#ch_con").val(statArray[2].slice(2,4));
            $("input#ch_int").val(statArray[3].slice(2,4));
            $("input#ch_wis").val(statArray[4].slice(2,4));
            $("input#ch_cha").val(statArray[5].slice(2,4));
            var total_hp = (10 + parseInt($("input#ch_con").val()) );
            $("input#ch_hp").val(total_hp);
      });
            
      $(".drsortable").trigger('sortupdate'); 
			$( ".drsortable" ).disableSelection();
        }
        
		if (numAttendees == "Point Buy") {
		  $("#point_buy_wrap").slideDown().find("input").addClass("active_name_field");
		}
    
	});
  
	
  //Point buy logic
  //PB Strength Plus THIS IS GOOD - FIX THE REST
	$("#pb_str_plus").click(function(){
    if ($("#pb_str").html() < 15 && $("#pb_total").html() > 0){
      
      if ($("#pb_str").html() > 12 && $("#pb_total").html()-2 > 0) {
        $("#pb_total").text($("#pb_total").text()-2);
        $("#pb_str").text(parseInt($("#pb_str").text())+1);
      }
      else if ($("#pb_str").html() > 7 && $("#pb_total").html()-1 > 0 ) {
        $("#pb_total").text($("#pb_total").text()-1);
        $("#pb_str").text(parseInt($("#pb_str").text())+1);
      }
    }
	});
  //PB Strength Minus THIS IS GOOD - FIX THE REST
	$("#pb_str_min").click(function(){
    if ($("#pb_str").html() >= 9) {
        $("#pb_str").text(parseInt($("#pb_str").text())-1);
        $("#pb_total").text(parseInt($("#pb_total").text())+1);
      }
      if ($("#pb_str").html() >= 13) {
        $("#pb_total").text(parseInt($("#pb_total").text())+1);
        }

	});
  
  
  
  //PB Dex Plus
	$("#pb_dex_plus").click(function(){
    if ($("#pb_dex").html() < 15 && $("#pb_total").html() > 0){
      
      if ($("#pb_dex").html() > 13 && $("#pb_total").html()-2 > 0) {
        $("#pb_total").text($("#pb_total").text()-2);
        $("#pb_str").html(function(i, val) { return val*1+1;});
      }
      else if ($("#pb_dex").html() > 7 && $("#pb_total").html()-1 > 0 ) {
        $("#pb_total").text($("#pb_total").text()-1);
        $("#pb_dex").html(function(i, val) { return val*1+1;});
      }
      
    }
 
	});
  //PB Dex Minus
	$("#pb_dex_min").click(function(){
	  if ($("#pb_dex").html() > 8){
      $("#pb_dex").html(function(i, val) { return val*1-1;});
      $("#pb_total").html(function(i, val) { return val*1+1;});

      if ($("#pb_dex").html() > 12) {
        $("#pb_total").html(function(i, val) { return val*1+1;});
      }
	  }
	});
  
    //PB Int Plus
	$("#pb_int_plus").click(function(){
	  if ($("#pb_int").html() < 15 && $("#pb_total").html() > 0){
      $("#pb_int").html(function(i, val) { return val*1+1;});
      if ($("#pb_int").html() > 8) {
        $("#pb_total").html(function(i, val) { return val*1-1;});
      }
      if ($("#pb_int").html() > 13) {
        $("#pb_total").html(function(i, val) { return val*1-1;});
      }
	  }
	});
  //PB Int Minus
	$("#pb_int_min").click(function(){
	  if ($("#pb_int").html() > 8){
      $("#pb_int").html(function(i, val) { return val*1-1;});
      $("#pb_total").html(function(i, val) { return val*1+1;});

      if ($("#pb_int").html() > 12) {
        $("#pb_total").html(function(i, val) { return val*1+1;});
      }
	  }
	});  
  
    //PB Wis Plus
	$("#pb_wis_plus").click(function(){
	  if ($("#pb_wis").html() < 15 && $("#pb_total").html() > 0){
      $("#pb_wis").html(function(i, val) { return val*1+1;});
      if ($("#pb_wis").html() > 8) {
        $("#pb_total").html(function(i, val) { return val*1-1;});
      }
      if ($("#pb_wis").html() > 13) {
        $("#pb_total").html(function(i, val) { return val*1-1;});
      }
	  }
	});
  //PB Wis Minus
	$("#pb_wis_min").click(function(){
	  if ($("#pb_wis").html() > 8){
      $("#pb_wis").html(function(i, val) { return val*1-1;});
      $("#pb_total").html(function(i, val) { return val*1+1;});

      if ($("#pb_wis").html() > 12) {
        $("#pb_total").html(function(i, val) { return val*1+1;});
      }
	  }
	});  
  
    //PB Cha Plus
	$("#pb_cha_plus").click(function(){
	  if ($("#pb_cha").html() < 15 && $("#pb_total").html() > 0){
      $("#pb_cha").html(function(i, val) { return val*1+1;});
      if ($("#pb_cha").html() > 8) {
        $("#pb_total").html(function(i, val) { return val*1-1;});
      }
      if ($("#pb_cha").html() > 13) {
        $("#pb_total").html(function(i, val) { return val*1-1;});
      }
	  }
	});
  //PB cha Minus
	$("#pb_cha_min").click(function(){
	  if ($("#pb_cha").html() > 8){
      $("#pb_cha").html(function(i, val) { return val*1-1;});
      $("#pb_total").html(function(i, val) { return val*1+1;});

      if ($("#pb_cha").html() > 12) {
        $("#pb_total").html(function(i, val) { return val*1+1;});
      }
	  }
	});  
  
    //PB con Plus
	$("#pb_con_plus").click(function(){
	  if ($("#pb_con").html() < 15 && $("#pb_total").html() > 0){
      $("#pb_con").html(function(i, val) { return val*1+1;});
      if ($("#pb_con").html() > 8) {
        $("#pb_total").html(function(i, val) { return val*1-1;});
      }
      if ($("#pb_con").html() > 13) {
        $("#pb_total").html(function(i, val) { return val*1-1;});
      }
	  }
	});
  //PB con Minus
	$("#pb_con_min").click(function(){
	  if ($("#pb_con").html() > 8){
      $("#pb_con").html(function(i, val) { return val*1-1;});
      $("#pb_total").html(function(i, val) { return val*1+1;});

      if ($("#pb_con").html() > 12) {
        $("#pb_total").html(function(i, val) { return val*1+1;});
      }
	  }
	});  
  
  //Alignment info
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
  
//Limit # of  skills
//$('input.ch_skillprof').hide();

var prof_limit = 4;
$('input.ch_skillprof').on('change', function(evt) {
   if($(this).siblings(':checked').length >= prof_limit) {
       this.checked = false;
   }
  
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