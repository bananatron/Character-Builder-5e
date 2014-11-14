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
// This file manipulates the sheet.erb (results page)
// Reference form.js for the index.erb (main page / form)


//When DOM is ready
$(document).ready(function(){
  
  //Escape the small container the spell dropdowns are constrained to
  $(".f-dropdown").prependTo( "#escaper" );

  //Attribute editing and calculation
  $( ".attr_value" ).bind( "input", function() {
    //Prevent letters from being entered
    $('.attr_value').keypress(function(key) {
        if(key.charCode < 48 || key.charCode > 57) return false;
    });
    //Prevent you from removing all text from field
    if ($(this).text() === "") {
      $(this).text("10");
    }
    //Find the appropriate idnetifier for that skill
    var attr_find = $(this).attr('id').replace("_value", "_mod")
    //Change the modifier to the appropriate value based on your entry
    if ( $(this).text().length < 3 ) {
      $('#'+attr_find).text( Math.floor((parseInt($(this).text())-10)/2) ); 
    }
    //Don't allow big numbers
    else {
      $('#'+attr_find).text("X");
    }
  });
  
  //Remove li if it's empty
  $( ".list_item" ).bind( "input", function() {
    console.log( $(this).text() );
    if ($(this).text() === "") {
      $(this).remove();
    }
  });
  
  //Add list items
  $(".li_adder").click(function(){
    var ul = $(this).attr('id').replace("_add", "")
   console.log( ul );
    $('#'+ul).append("<span contenteditable='true'><li class='list'>Erase all text to remove.</li>")
  });
  
  //$(".list").parent().parent().append("<span contenteditable='true'><li class='list'>test list item</li>")
  
});