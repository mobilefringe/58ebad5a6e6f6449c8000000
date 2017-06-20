function init() {
    $('<div class="loader_backdrop"><div class="loader">Loading...</div></div>').appendTo(document.body);
    
    //Using i18n for localization, for more info please visit http://i18next.com/
    i18n.init({preload: [getStorage().primary_locale,getStorage().secondary_locale],resGetPath: '../__lng__.json',fallbackLng: false }, function(t) {
        var current_locale = "";
        if(typeof(Cookies.get('current_locale')) != 'undefined' ){
            current_locale = Cookies.get('current_locale')
        }
        if(current_locale == Cookies.get('primary_locale')){
            setPrimaryLanguage();
        }else{
            setSecondaryLanguage();
        }
    });
    
    // If there is no language set it to the primary locale.
    if (!Cookies.get('current_locale')) {
        setPrimaryLanguage();
    }
    
    $("#brand_select").on('change', function() {            
        if ($(this).val() != ""){
            window.location = "/stores/" + $(this).val();    
        }
    });  

    $("#locale_select").on('change', function() {                        
        window.location.href = "?locale=" + $(this).val();    
    }); 
    
    $(".long_feature_box").hover(function() {
        $(this).find(".long_feature_label").animate({
            "top": "-=81%"
        }, 500)
    }, function() {
        $(this).find(".long_feature_label").animate({
            "top": "+=81%"
        }, 500)
    });
    
    // *** POP UP *** //
    $("#success_subscribe_popup").hide();
        
    $(".popup_close").click(function(){
        $(".popup_bg").fadeOut();
    });
    
    var toc_show_popup = $.cookie("toc_show_popup");
    // if (toc_show_popup == null) {
        $(".popup_newsletter .subscribe p").show();
        $(".popup_bg").show();            
    // }
    $("#hide_popup").click(function(){
        if ($(this).is(":checked")){
            $(".popup_bg").fadeOut();    
            $.cookie('toc_show_popup', 'yes'); 
            $.cookie('toc_show_popup', 'yes', { expires: 1, path: '/' });        
        }
    });
    
    $(".popup_bg").click(function(event){            
        if( !$( event.target).is('.popup_newsletter') ) {
            $(".popup_bg").fadeOut();
        } else {
            event.stopPropagation();
        }
    });
        
    $(".popup_bg .popup_newsletter").click(function(event){            
        event.stopPropagation();
    });
    
    $("#popup_btn").click(function(){    
        subscribe_email_popup();
    });
    
    function validate_pop_up(){
        if($('#subscribe_newsletter_popup').is(":checked"))
        return true;
        else{
            alert("Please check the 'Subscribe to recieve newsletter' checkbox")
            return false;
        }
    }
    
    function subscribe_email_popup(){ 
        validate();
        // if (isValidEmailAddress($("#subscribe_email_popup").val())){   
            var action="http://mobilefringe.createsend.com/t/d/s/ykblt/"
            var data = {}
            data["cm-ykblt-ykblt"] = $("#subscribe_email_popup").val();
            data["cm-name"] = $("#subscribe_first_name").val() + " " + $("#subscribe_last_name").val();
            $.getJSON(
                action + "?callback=?",
                data,
                function (data) {
                    if (data.Status === 400) {
                        alert("Veuillez essayer de nouveau s’il vous plaît.");
                    } else { // 200
                        $("#success_subscribe_popup").fadeIn();
                    }
            });    
        // } else {
        //     alert("Veuillez entrez un courriel valide.")
        // }
    }
    
    //Campaign Monitor Sign Up
    $('#subForm').submit(function (e) {
        if ($("#agree_terms").prop("checked") != true){
            alert("Please agree to the term and conditions.");
            $("#agree_terms").focus();
            return false;
        }
        e.preventDefault();
        $.getJSON(
            this.action + "?callback=?",
            $(this).serialize(),
            function (data) {
                if (data.Status === 400) {
                    alert("Please try again later.");
                } else { // 200
                    $('#subForm').trigger('reset');
                    $("#success_subscribe").fadeIn();
                    
                }
        });
    });
    
    // function submitToMailChimp(){
    //     $("#mce-EMAIL").val($('#fieldEmail').val())
    //     $.ajax({
    //         type: $("#mc-embedded-subscribe-form").attr('method'),
    //         url: $("#mc-embedded-subscribe-form").attr('action'),
    //         data: $("#mc-embedded-subscribe-form").serialize(),
    //         cache       : false,
    //         dataType    : 'json',
    //         contentType: "application/json; charset=utf-8",
    //         error       : function(err) { alert("Could not connect to the registration server. Please try again later.") },
    //         success     : function(data) {
           
    //             if (data.result != "success") {
    //                 $("#success_subscribe").fadeIn();
    //             } else {
    //                 $("#success_subscribe").fadeIn();
    //             }
    //         }
    //     })
    // }

}

function show_content(){
    $(".yield").css({visibility: "visible"});
    $(".loader_backdrop").remove();
    
    var header_stores = getStoresList();
    renderStoreList('#brand_select','#brand_select_template', header_stores, "stores");
    if(Cookies.get('current_locale') == "en-CA"){
        $("#brand_select").prepend("<option selected>Brands</option>");   
        $("#locale_select").val("en");
    }
    if(Cookies.get('current_locale') == "fr-CA"){
        $("#brand_select").prepend("<option selected>Boutiques</option>"); 
        $("#locale_select").val("fr");
    }
    
    renderHomeHours();
    
    var prop_details = getPropertyDetails();
    renderPropertyDetails('#prop_phone_container', '#prop_phone_template', prop_details);
    
    var feature_items = getFeatureList();
    var one_item = feature_items.slice(0,1);
    var two_items = feature_items.slice(1,3);
    if(Cookies.get('current_locale') == "en-CA"){
        renderFeatureItems('#feature_item','#feature_item_template', one_item);
        renderFeatureItems('#home_feature','#home_feature_template', two_items);            
    }
    if(Cookies.get('current_locale') == "fr-CA"){
        renderFeatureItems('#feature_item_fr','#feature_item_template_fr', one_item);
        renderFeatureItems('#home_feature_fr','#home_feature_template_fr', two_items);   
    }
}