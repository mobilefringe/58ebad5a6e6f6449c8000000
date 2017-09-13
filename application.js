function renderGeneral(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html); 
    $.each( collection , function( key, val ) {
        var repo_rendered = Mustache.render(template_html,val);
        item_rendered.push(repo_rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderPropertyDetails(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html); 
    
    var repo_rendered = Mustache.render(template_html, collection);
    item_rendered.push(repo_rendered);

    $(container).html(item_rendered.join(''));
}

function renderBanner(home_banner_template, home_banner, banners){
    var item_list = [];
    var item_rendered = [];
    var banner_template_html = $(home_banner_template).html();
    Mustache.parse(banner_template_html);   // optional, speeds up future uses
    $.each(banners, function(key, val) {
        today = new Date();
        start = new Date (val.start_date);
        start.setDate(start.getDate());
        if(val.url == "" || val.url === null){
            val.css = "style=cursor:default;";
            val.noLink = "return false";
        }
        if (start <= today){
            if (val.end_date){
                end = new Date (val.end_date);
                end.setDate(end.getDate() + 1);
                if (end >= today){
                    item_list.push(val);  
                }
            } else {
                item_list.push(val);
            }
        }
    });
    $.each( item_list , function( key, val ) {
        var repo_rendered = Mustache.render(banner_template_html,val);
        item_rendered.push(repo_rendered);
    });
    $(home_banner).html(item_rendered.join(''));
}

function renderFeatureItems(feature_item, feature_item_template, feature_items){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(feature_item_template).html();
    Mustache.parse(template_html); 
    $.each(feature_items, function(key, val) {
        // if (val.description.length  >= 100) {
        //     val.description = val.description.substring(0,99) + "...";
        // }
        if(val.url == "" || val.url === null){
           val.css = "style=cursor:default;";
           val.noLink = "return false";
        }
        var repo_rendered = Mustache.render(template_html,val);
        item_rendered.push(repo_rendered);
    });
    $(feature_item).html(item_rendered.join(''));
}

function renderHours(container, template, collection, type){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    if (type == "reg_hours") {
        $.each( collection , function( key, val ) {
            if (!val.store_id && val.is_holiday == false) {
                switch(val.day_of_week) {
                    case 0:
                        val.day = "Dimanche";
                        break;
                    case 1:
                        val.day = "Lundi";
                        break;
                    case 2:
                        val.day = "Mardi";
                        break;
                    case 3:
                        val.day = "Mercredi";
                        break;
                    case 4:
                        val.day = "Jeudi";
                        break;
                    case 5:
                        val.day = "Vendredi";
                        break;
                    case 6:
                        val.day = "Samedi";
                        break;
                }
                if (val.open_time && val.close_time && val.is_closed == false){
                    var open_time = moment(val.open_time).tz(getPropertyTimeZone());
                    var close_time = moment(val.close_time).tz(getPropertyTimeZone());
                    val.h = open_time.format("H") + "h" + open_time.format("mm") + " à " + close_time.format("H") + "h" + close_time.format("mm");
                } else {
                    "Fermé";
                }
                item_list.push(val);
            }
        });
        collection = [];
        collection = item_list;
    }
    
    if (type == "holiday_hours") {
        $.each( collection , function( key, val ) {
            if (!val.store_id && val.is_holiday == true) {
                holiday = moment(val.holiday_date).tz(getPropertyTimeZone());
                var french_holiday = moment(holiday).locale('fr-ca');
                val.formatted_date = french_holiday.format("DD MMM");
                if (val.open_time && val.close_time && val.is_closed == false){
                    var open_time = moment(val.open_time).tz(getPropertyTimeZone());
                    var close_time = moment(val.close_time).tz(getPropertyTimeZone());
                    val.h = open_time.format("H") + "h" + open_time.format("mm") + " à " + close_time.format("H") + "h" + close_time.format("mm");
                } else {
                    val.h = "Fermé";
                }
                item_list.push(val);
            }
        });
        collection = [];
        collection = item_list;
    }
    $.each( collection , function( key, val ) {
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderHomeHours(container, template, collection){
    var today_hours = getTodaysHours();
    var item_list = [];
    var item_rendered = [];
    var template_html = $('#home_hours_template').html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    item_list.push(today_hours);    
    $.each(item_list, function(key, val) {
        var weekday = moment().locale('fr-ca');
        val.weekday = weekday.format("dddd");
        if (val.open_time && val.close_time && (val.is_closed == false || val.is_closed == null)){
            var open_time = moment(val.open_time).tz(getPropertyTimeZone());
            var close_time = moment(val.close_time).tz(getPropertyTimeZone());
            val.h = open_time.format("H") + "h" + open_time.format("mm") + " à " + close_time.format("H") + "h" + close_time.format("mm");
        } else {
            val.h = "Fermé";
        }
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $('#home_hours_container').html(item_rendered.join(''));
}

function renderJobs(container, template, collection){
    var mall_name = getPropertyDetails().name;
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html); 
    $.each( collection , function( key, val ) {
        if(val.jobable_type == "Store"){
            val.store_name = getStoreDetailsByID(val.jobable_id).name;
            val.store_slug = getStoreDetailsByID(val.jobable_id).slug;
        } else {
            val.store_name = mall_name;
        }
        var show_date = moment(val.show_on_web_date);
        var start = moment(val.start_date).tz(getPropertyTimeZone());
        var end = moment(val.end_date).tz(getPropertyTimeZone());
        var french_start = moment(start).locale('fr-ca');
        var french_end = moment(end).locale('fr-ca');
        val.end_date = french_end.format("DD MMM");
        if (start.format("DMY") == end.format("DMY")){
            val.dates = start.format("MMM D");
        } else {
            val.dates = start.format("MMM D") + " - " + end.format("MMM D");
        }

        if(val.job_type === "Full Time") {
            val.position = "TEMPS PLEIN";
        }
        if(val.job_type === "Part Time") {
            val.position = "TEMPS PARTIEL";
        }
        if(val.job_type === "Part Time/Full Time") {
            val.position = "TEMPS PARTIEL/TEMPS PLEIN";
        }
        if(val.job_type === "Seasonal") {
            val.position = "SAISONNIER";
        }
        
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderJobDetails(container, template, collection){
    var mall_name = getPropertyDetails().name;
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html); 
    item_list.push(collection);
    $.each( item_list , function( key, val ) {
        if (val.jobable_type == "Store") {
            var store_details = getStoreDetailsByID(val.jobable_id);
            val.store_detail_btn = store_details.slug;
            val.store_name = store_details.name;
        } else {
            val.store_name = mall_name;
        }
        
        var show_date = moment(val.show_on_web_date);
        var start = moment(val.start_date).tz(getPropertyTimeZone());
        var end = moment(val.end_date).tz(getPropertyTimeZone());
        if (start.format("DMY") == end.format("DMY")){
            val.dates = start.format("MMM D")
        } else {
            val.dates = start.format("MMM D") + " - " + end.format("MMM D")
        }
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderEvents(container, template, collection){
    var mall_name = getPropertyDetails().name;
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html); 
    $.each( collection , function( key, val ) {
        if (val.eventable_type == "Store") {
            var store_details = getStoreDetailsByID(val.eventable_id);
            val.store_detail_btn = store_details.slug ;
            val.store_name = store_details.name;
            val.event_image_url = store_details.store_front_url_abs;
        } else {
            val.store_name = mall_name;
        }
        
        if(val.event_image_url.indexOf('missing.png') < 0){
            val.event_image_url = getImageURL(val.event_image_url);
        } else {
            val.event_image_url = "//codecloud.cdn.speedyrails.net/sites/58ebad5a6e6f6449c8000000/image/png/1491841221000/fleurdelys.png";
        }
        
        var show_date = moment(val.show_on_web_date);
        var start = moment(val.start_date).tz(getPropertyTimeZone());
        var end = moment(val.end_date).tz(getPropertyTimeZone());
        var french_start = moment(start).locale('fr-ca');
        var french_end = moment(end).locale('fr-ca');
        if (start.format("DMY") == end.format("DMY")){
            val.dates = french_start.format("DD MMM")
        } else {
            val.dates = french_start.format("DD MMM") + " - " + french_end.format("DD MMM");
        }
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderEventDetails(container, template, collection){
    var mall_name = getPropertyDetails().name;
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html); 
    item_list.push(collection);
    $.each( item_list , function( key, val ) {
        if (val.eventable_type == "Store") {
            var store_details = getStoreDetailsByID(val.eventable_id);
            val.store_detail_btn = store_details.slug;
            val.store_name = store_details.name;
            if (store_details.store_front_url_abs.indexOf('missing.png') > -1){
                val.image_url = "";
            } else {
                val.image_url = store_details.store_front_url_abs;
            }
        } else {
            val.store_name = mall_name;
            val.image_url = "";
        }
        
        if(val.event_image_url_abs.indexOf('missing.png') > -1){
            val.promo_image_show="display:none";
        }
        
        var show_date = moment(val.show_on_web_date);
        var start = moment(val.start_date).tz(getPropertyTimeZone());
        var end = moment(val.end_date).tz(getPropertyTimeZone());
        var french_start = moment(start).locale('fr-ca');
        var french_end = moment(end).locale('fr-ca');
        if (start.format("DMY") == end.format("DMY")){
            val.dates = french_start.format("DD MMM")
        } else {
            val.dates = french_start.format("DD MMM") + " - " + french_end.format("DD MMM");
        }
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderPromotions(container, template, collection){
    var mall_name = getPropertyDetails().name;
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html); 
    $.each( collection , function( key, val ) {
        if (val.promotionable_type == "Store") {
            var store_details = getStoreDetailsByID(val.promotionable_id);
            val.store_detail_btn = store_details.slug ;
            val.store_name = store_details.name;
            val.image_url = store_details.store_front_url_abs;
        } else {
            val.store_name = mall_name;
        }
        
        if(val.promo_image_url_abs.indexOf('missing.png') > 0){
            val.promo_image_url_abs  = "//codecloud.cdn.speedyarils.net/sites/58ebad5a6e6f6449c8000000/image/png/1491841221000/fleurdelys.png";
        }
        
        var show_date = moment(val.show_on_web_date);
        var start = moment(val.start_date).tz(getPropertyTimeZone());
        var end = moment(val.end_date).tz(getPropertyTimeZone());
        var french_start = moment(start).locale('fr-ca');
        var french_end = moment(end).locale('fr-ca');
        if (start.format("DMY") == end.format("DMY")){
            val.dates = french_start.format("DD MMM")
        } else {
            val.dates = french_start.format("DD MMM") + " - " + french_end.format("DD MMM")
        }
        
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderPromoDetails(container, template, collection){
    var mall_name = getPropertyDetails().name;
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html); 
    item_list.push(collection);
    $.each( item_list , function( key, val ) {
        if (val.promotionable_type == "Store") {
            var store_details = getStoreDetailsByID(val.promotionable_id);
            val.store_detail_btn = store_details.slug;
            val.store_name = store_details.name;
            if (store_details.store_front_url_abs.indexOf('missing.png') > -1){
                val.image_url = "";
            } else {
                val.image_url = store_details.store_front_url_abs;
            }
        } else {
            val.store_name = mall_name;
            val.image_url = "//codecloud.cdn.speedyarils.net/sites/58b449586e6f646b91000000/image/jpeg/1488210736000/sugarlogo.jpg";
        }
        
        if(val.promo_image_url_abs.indexOf('missing.png') > -1){
            val.promo_image_show="display:none";
        }
        
        var show_date = moment(val.show_on_web_date);
        var start = moment(val.start_date).tz(getPropertyTimeZone());
        var end = moment(val.end_date).tz(getPropertyTimeZone());
        var french_start = moment(start).locale('fr-ca');
        var french_end = moment(end).locale('fr-ca');
        if (start.format("DMY") == end.format("DMY")){
            val.dates = french_start.format("DD MMM")
        } else {
            val.dates = french_start.format("DD MMM") + " - " + french_end.format("DD MMM")
        }
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderStoreDetails(container, template, collection, slug){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    item_list.push(collection);
    $.each( item_list , function( key, val ) {
        if ((val.store_front_url).indexOf('missing.png') > -1){
            val.alt_store_front_url = "//www.mallmaverick.com/photos/original/missing.png";
        } else {
            val.alt_store_front_url = getImageURL(val.store_front_url); 
        }
        val.category_list = getCategoriesNamesByStoreSlug(slug);
        val.map_x_coordinate = val.x_coordinate - 19;
        val.map_y_coordinate = val.y_coordinate - 58;
        val.property_map = getPropertyDetails().mm_host + getPropertyDetails().map_url;
        if (val.website != null && val.website.length > 0){
            val.show = "display:inline-block";
        } else {
            val.show = "display:none";
        }
        if (val.phone != null && val.phone.length > 0){
            val.phone_show = "display:inline-block";
        } else {
            val.phone_show = "display:none";
        }
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderStoreList(container, template, collection, type){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    var store_initial="";
    $.each( collection , function( key, val ) {
        if (type == "stores" || type == "category_stores"){
            if(!val.store_front_url ||  val.store_front_url.indexOf('missing.png') > -1 || val.store_front_url.length === 0){
                val.alt_store_front_url = "";
            } else {
                val.alt_store_front_url = getImageURL(val.store_front_url);    
            }
        }
        
        if(val.categories != null){
            try {
                val.cat_list = val.categories.join(',');
            } catch(err) {
                console.log(err);
            }
        }
        
        var current_initial = val.name[0];
        if(store_initial.toLowerCase() == current_initial.toLowerCase()){
            val.initial = "";
            val.show = "display:none;";
        } else {
            val.initial = current_initial;
            store_initial = current_initial;
            val.show = "display:block;";
        }
        
        if (val.total_published_promos > 0){
            val.promotion_exist = "display:inline";
        } else {
            val.promotion_exist = "display:none";
        }
        
        if(val.phone.length < 1){
            val.phone_exist = "display:none";
        }
        
        val.block = current_initial + '-block';
        var rendered = Mustache.render(template_html,val);
        var upper_current_initial = current_initial.toUpperCase();
        item_rendered.push(rendered);
    });
    $(container).show();
    $(container).html(item_rendered.join(''));
}

function renderStoreListCatetories(container, template, category_list,stores){
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future use
    var initial_id = 0;
    var category_index = 0;
    $.each(category_list , function( key, category ) {
        var category_id = parseInt(category.id);
        var category_name = category.name;
        var current_id = category.id;
        var count = 0;
        $.each( stores , function( i, store ) {
            if(store.categories != null){
                var store_category = store.categories;
                var a = store_category.indexOf(category_id);
            }
            if (a > -1){
                if (count == 0){
                    store.show  = "display:block"; 
                } else {
                    store.show  = "display:none"; 
                }
                store.header = category_name;
                store.block = category.id;
                var rendered = Mustache.render(template_html,store);
                item_rendered.push(rendered);
                count += 1;
            }
        });
        category_index += 1;
    });
    $(container).html(item_rendered.join(''));
}

function renderPosts(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    $.each( collection , function( key, val ) {
        if (val.image_url.indexOf('missing.png') > -1) {
            val.image_url = "//codecloud.cdn.speedyarils.net/sites/58b449586e6f646b91000000/image/jpeg/1488210736000/sugarlogo.jpg";
        } else {
            val.image_url = val.image_url;
        }

        var published_on = moment(val.publish_date).tz(getPropertyTimeZone());
        val.publish_date = published_on.format("MMMM Do, YYYY");
        
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderPostDetails(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    $.each( collection , function( key, val ) {
        if (val.image_url.indexOf('missing.png') > -1) {
            val.image_url = "//codecloud.cdn.speedyarils.net/sites/58b449586e6f646b91000000/image/jpeg/1488210736000/sugarlogo.jpg";
        } else {
            val.image_url = val.image_url;
        }
        
        var published_on = moment(val.publish_date).tz(getPropertyTimeZone());
        val.publish_date = published_on.format("MMMM Do, YYYY");

        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function show_png_pin(trigger, map){
    $(trigger).bind("change", function(e) {
        e.preventDefault()
        
        var selectedOption = $("select.mapper").val().split(",");
        var selectedOptionName = $(".mapper option:selected").text();
        
        var isMobile = ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) );
        // coords = $(selectedOption).attr('data-value').split(",");
        var zoomData = $(map).smoothZoom('getZoomData');
        x_coord = parseInt(selectedOption[0]) + 5;
        y_coord = parseInt(selectedOption[1]);
    
        $(map).smoothZoom('removeLandmark')
        if (isMobile) {
            $(map).smoothZoom('focusTo', {x:x_coord, y:y_coord, zoom:100});    
        } else {
            $(map).smoothZoom('focusTo', {x:x_coord, y:y_coord, zoom:150});
        }
        
        $(map).smoothZoom('addLandmark', 
			[
			'<div class="item mark" data-show-at-zoom="0" data-position="' + x_coord + ',' + y_coord + '">\
				<div>\
					<div class="text">\
					<strong>'+ selectedOptionName + '</strong>\
				</div>\
				<img src="//www.mallmaverick.com/system/sites/map_markers/000/000/027/original/map_marker.png?1417461836" width="45px" height="59px" alt="marker" />\
				</div>\
			</div>'
			]
		);
    });
}

function setPrimaryLanguage(){
    i18n.setLng(Cookies.get('primary_locale'), function(t) {
        $(document).i18n();
    });
    Cookies.set('current_locale', Cookies.get('primary_locale'))
    $('.primary-locale').show(); // Shows
    $('.secondary-locale').hide();
    $("#search_input").attr("placeholder", "Search Site");
    $("#search_input_mobile").attr("placeholder", "Search Site");
    // window.dispatchEvent(new Event('resize'));
}

function setSecondaryLanguage(){
    i18n.setLng(Cookies.get('secondary_locale'), function(t) {
        $(document).i18n();
    });
    Cookies.set('current_locale', Cookies.get('secondary_locale'))
    $('.secondary-locale').show();
    $('.primary-locale').hide();
    $("#search_input").attr("placeholder", "Rechercher dans le site");
    $("#search_input_mobile").attr("placeholder", "Rechercher dans le site");
    // window.dispatchEvent(new Event('resize'));
}

function getUrlParameter(sParam){
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('#');
    for (var i = 0; i < sURLVariables.length; i++){
        if (sURLVariables[0] == sParam){
            return true;
        }
    }
    return false;
} 