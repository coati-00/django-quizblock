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

function loadState(blockId, pageblockId) {
    // Load the user's quiz responses if they exist
    var loadUrl = 'http://' + location.hostname + ':' + location.port + "/activity/quiz/load/" + blockId + "/";
    jQuery.getJSON(loadUrl, function(data) {
        for (id in data) {
            var name = "pageblock-" + pageblockId + "-question" + id;
            
            var element = jQuery('input[name="' + name + '"]')
            if (element.is(':radio')) {
                // check the right radio button
                var checkedElement = jQuery('input[name="' + name + '"][value="' + data[id] + '"]')
                checkedElement.attr("checked", true);
                
                if (jQuery("#video").length > 0) {
                    // display video and begin playback
                    var answer_video_id = "#answer_video" + checkedElement.attr("id");
                    jQuery(answer_video_id).css("display", "inline");

                } else {
                    jQuery("#q" + id).css("display", "block");
                }
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
            
            if (jQuery("#video").length > 0) {
                // hide any videos that are currently playing
                jQuery(":radio").each(function(index) {
                   // display video and begin playback
                    var answer_video_id = "#answer_video" + jQuery(this).attr("id");
                    if (jQuery(answer_video_id)) 
                        jQuery(answer_video_id).css("display", "none");
                });
                
                // display video and begin playback
                var answer_video_id = "#answer_video" + element.attr("id");
                jQuery(answer_video_id).css("display", "inline");
            } else {
                // show the "correct" answer block
                jQuery("#q" + questionId).css("display", "block");
            }
        }
    }
    
    return questionId;
}