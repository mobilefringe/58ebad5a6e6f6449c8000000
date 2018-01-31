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
    if (toc_show_popup == null) {
        $(".popup_newsletter .subscribe p").show();
        $(".popup_bg").show();            
    }
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
    
    function isValidEmailAddress(emailAddress) {
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        return pattern.test(emailAddress);
    }


    function subscribe_email_popup(){ 
        if (isValidEmailAddress($("#subscribe_email_popup").val())){   
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
        } else {
            alert("Veuillez entrez un courriel valide.")
        }
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
    
    //dynamically changing copyright year
    var current_year = moment().year();
    $("#current_year").text(current_year);

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

function submit_contest(slug) {
    var contest_entry = {};
    var contest_data = {};
    contest_data.first_name = $('#first_name').val();
    contest_data.last_name = $('#last_name').val();
    contest_data.email = $('#email').val();
    contest_data.phone = $('#phone_number').val();
    contest_data.mailing_address = $('#mailing_address').val();
    contest_data.city = $('#city').val();
    contest_data.postal_code = $('#postal_code').val();
    contest_data.birthday = $('#birthday').val();
    contest_data.newsletter = $('#newsletter_signup').prop("checked");
    contest_entry.contest = contest_data;
    
    var propertyDetails = getPropertyDetails();
    var host = propertyDetails.mm_host.replace("http:", "");
    var action = host + "/contests/" + slug + "/create_js_entry"
    $.ajax({
        url : action,
        type: "POST",
        data : contest_entry,
        success: function(data){
            $('#succes_msg').show();
            $('.contest_btn').prop('disabled', false);
            $('#contest_form').trigger('reset');
            $('html, body').animate({scrollTop : 0},800);
        },
        error: function (data){
            alert('An error occured while processing your request. Please try again later!')
        }
    });
}

function submit_contest(slug) {
    var contest_entry = {};
    var contest_data = {};
    contest_data.first_name = $('#first_name').val();
    contest_data.last_name = $('#last_name').val();
    contest_data.mailing_address = $('#address').val();
    contest_data.city = $('#city').val();
    contest_data.province = $('#province').val();
    contest_data.postal_code = $('#zip_code').val();
    contest_data.phone = $('#phone_number').val();
    contest_data.email = $('#email').val();
    contest_data.newsletter = $('#newsletter_signup').prop("checked");
    contest_entry.contest = contest_data;
    console.log(contest_entry)
    var propertyDetails = getPropertyDetails();
    var host = propertyDetails.mm_host.replace("http:", "");
    var action = host + "/contests/" + slug + "/create_js_entry"
    console.log(action)
    $.ajax({
        url : action,
        type: "POST",
        data : contest_entry,
        success: function(data){
           $('#succes_msg').show();
           $('.submit_btn').prop('disabled', false);
           $('#contest_form').trigger('reset');
        },
        error: function (data){
            alert('An error occured while processing your request. Please try again later!')
        }
    });
}