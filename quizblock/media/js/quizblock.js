function maybeUnlockNextSection() {
   // is our next section unlocked now?
   var next_section_slug = jQuery("#next_section_slug").val();
   var loadUrl = 'http://' + location.hostname + ':' + location.port + "/main/accessible/" + next_section_slug + "/";
   jQuery.getJSON(loadUrl, function(data) {
      for (section_slug in data) {
         jQuery("#span_" + section_slug).css("display", "none");
         jQuery("#" + section_slug).css("display", "inline");   
      }
   });
}

function hasVideo() {
    return jQuery("#video").length > 0; 
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
                                
                if (hasVideo()) {
                    // display video and begin playback
                    var answer_video_id = "#answer_video" + checkedElement.attr("id");
                    jQuery(answer_video_id).css("display", "inline");
                    
                    // show the selected element
                    checkedElement.parent().addClass("answer_text_selected");
                    jQuery("#answer_controls").show();
                    jQuery("#answer_submit").hide();
                }
            }
        }
        
        // If no items are selected, show all items.
        if (count < 1 && hasVideo()) {
            jQuery(":radio").attr("checked", false);
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
            
            // update the "you answered" section
            if (hasVideo()) {
                jQuery("#submitted_answer").html("<b>You answered " + element.val().toUpperCase() + "</b><br />");
            }
        }
    }
    
    return questionId;
}

function showVideo(element) {
    // hide any videos that are currently playing
    // stop the video?
    jQuery(".answer_text").removeClass("answer_text_selected");
    jQuery(":radio").each(function(index) {
        // hide all other videos
        if (jQuery(this).attr("id") != element.attr("id")) {
            var answer_video_id = "#answer_video" + jQuery(this).attr("id");
            if (jQuery(answer_video_id)) 
                jQuery(answer_video_id).css("display", "none");
        }
    });
    
    // display video and begin playback
    var answer_video_id = "#answer_video" + element.attr("id");
    jQuery(answer_video_id).css("display", "inline");
    element.parent().addClass("answer_text_selected");
    jQuery("#answer_controls").show();
}