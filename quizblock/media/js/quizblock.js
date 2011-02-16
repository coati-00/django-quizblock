function maybeUnlockNextSection() {
   // is our next section unlocked now?
   var next_section_slug = jQuery("#next_section_slug").val();
   if (next_section_slug != undefined) {
       var loadUrl = 'http://' + location.hostname + ':' + location.port + "/main/accessible/" + next_section_slug + "/";
       jQuery.getJSON(loadUrl, function(data) {
          for (section_slug in data) {
             jQuery("#span_" + section_slug).css("display", "none");
             jQuery("#" + section_slug).css("display", "inline");   
          }
       });
   }
}

function hasMultipleVideos() {
    // Video associated with each answer
    return jQuery("#multivideo").length > 0; 
}

function hasSingleVideo() {
    // Video associated with question
    return jQuery("#singlevideo").length > 0; 
}

function loadState(blockId, pageblockId) {
    
    // Load the user's quiz responses if they exist
    var loadUrl = 'http://' + location.hostname + ':' + location.port + "/activity/quiz/load/" + blockId + "/";
    jQuery.getJSON(loadUrl, function(data) {
        
        var count = 0;
        
        for (id in data) {
            count++;
            var name = "pageblock-" + pageblockId + "-question" + id;
            var element = jQuery('input[name="' + name + '"]')
            if (element.is(':radio')) {
                // check the right radio button
                var checkedElement = jQuery('input[name="' + name + '"][value="' + data[id] + '"]')
                checkedElement.attr("checked", true);
                
                // show the correct answer
                jQuery("#q" + id).css("display", "block");
            }
        }
    });
    
    maybeUnlockNextSection();
}

function storeState(element) {
    if (element.is(':checkbox') || element.is(':radio')) {
        if (element.attr("checked")) {
            var pattern = /\d*$/g
            var questionId = element.attr("name").match(pattern)[0];
            var serializedData = jQuery("#form-" + questionId).serialize();
            
            jQuery.ajax({
                type: "POST",
                url: jQuery("#form-" + questionId).attr("action"),
                data: serializedData, 
                success: function() {},
                error: function() {},
            });

            maybeUnlockNextSection();

            // show the "correct" answer block
            jQuery("#q" + questionId).css("display", "block");
        }
    }
    
    return questionId;
}