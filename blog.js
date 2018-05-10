function renderTrending(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    $.each( collection , function( key, val ) {
        var post = val.posts[0];
        val.post_title = post.title;
        val.post_slug = post.slug;
        if (post.image_url.indexOf('missing.png') > -1) {
            val.post_image = "//codecloud.cdn.speedyrails.net/sites/56056be06e6f641a1d020000/image/png/1446826281000/stc-logo-holiday-360 copy.png";
        } else {
            val.post_image = post.image_url;
        }
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    
    $(container).show();
    $(container).html(item_rendered.join(''));
}

function renderPosts(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    var counter = 1;
    Mustache.parse(template_html);   // optional, speeds up future uses
    $.each( collection , function( key, val ) {
        if (val.image_url.indexOf('missing.png') > -1) {
            val.post_image = "//codecloud.cdn.speedyrails.net/sites/56056be06e6f641a1d020000/image/png/1446826281000/stc-logo-holiday-360 copy.png";
        } else {
            val.post_image = val.image_url;
        }
        
        if(val.body.length > 100){
            val.description_short = val.body.substring(0,100) + "...";
        } else {
            val.description_short = val.body;
        }
        
        val.description_short = val.description_short.replace("&amp;", "&");
        val.slug = "posts/" + val.slug;
        var lb = getBlogDataBySlug("stc-lookbook");
        var contest = getBlogDataBySlug("stc-contest");
        var out_blog = lb.posts.concat(contest.posts);
        var id = val.id;
        if(id != null){
            try {
                var result = $.grep(out_blog, function(e){ return e.id == id; });
            } catch(err) {
                // console.log(err);
            }
        }
        // var result = $.grep(out_blog, function(e){ return e.id == id; });
        if(result != null){
            val.slug = val.video_link;
        }
        val.counter = counter;
        var date_blog = moment(val.publish_date).tz(getPropertyTimeZone());
        val.published_on = date_blog.format('MMM DD, YYYY');
        
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
        counter = counter+1;
    });
    
    $(container).show();
    $(container).html(item_rendered.join(''));
}

function renderPosts2(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    var counter = 1;
    Mustache.parse(template_html);   // optional, speeds up future uses
    $.each( collection , function( key, val ) {
        if (val.image_url.indexOf('missing.png') > -1) {
            val.post_image = "//codecloud.cdn.speedyrails.net/sites/56056be06e6f641a1d020000/image/png/1446826281000/stc-logo-holiday-360 copy.png";
        } else {
            val.post_image = val.image_url;
        }
        
        if(val.body.length > 100){
            val.description_short = val.body.substring(0,100) + "...";
        } else {
            val.description_short = val.body;
        }
    
        val.counter = counter;
        var date_blog = moment(val.publish_date).tz(getPropertyTimeZone());
        val.published_on = date_blog.format('MMM DD, YYYY');
        
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
        counter = counter+1;
    });
    
    $(container).show();
    $(container).html(item_rendered.join(''));
}

function renderPostDetails(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    $.each( collection , function( key, val ) {
        if (val.image_url.indexOf('missing.png') > -1) {
            val.post_image = "//codecloud.cdn.speedyrails.net/sites/56056be06e6f641a1d020000/image/png/1446826281000/stc-logo-holiday-360 copy.png";
        } else {
            val.post_image = val.image_url;
        }
        
        if(val.body.length > 100){
            val.description_short = val.body.substring(0,100) + "...";
        } else {
            val.description_short = val.body;
        }
        
        var date_blog = moment(val.publish_date).tz(getPropertyTimeZone());
        val.published_on = date_blog.format('MMM DD, YYYY');
        var next_p = getNextPublishedPostBySlug(val.slug);
        var prev_p = getPrevPublishedPostBySlug(val.slug);
        if (next_p == undefined){
            val.next_post_show = "display:none";
        } else {
            val.next_post = next_p.title;
            val.next_slug = next_p.slug;
            val.next_post_show = "display:inline-block";
        }
        
        if (prev_p == undefined){
            val.prev_post_show = "display:none";
        } else {
            val.prev_post = prev_p.title;
            val.prev_slug = prev_p.slug;
            val.prev_post_show = "display:inline-block";
        }
        
        if (val.tag != undefined){
            val.tag_list = val.tag.join(', ');
        }
        val.twitter_title= val.title + " via @shopSTC";
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    
    $(container).html(item_rendered.join(''));
}

function renderBlogs(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    $.each( collection , function( key, val ) {
        
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    
    $(container).show();
    $(container).html(item_rendered.join(''));
}

function load_more(num){
    var n = parseInt(num);
    for(i=n; i < n+5; i++){
        
        var id = i.toString();
        $('#show_' + id ).fadeIn();
    }
    if(i >= getAllPublishedPosts().length+1){
        $('#loaded_posts').hide();
        $('#all_loaded').show();
    }
    $('#num_loaded').val(i);
}

function load_more_2(num, l){
    var n = parseInt(num);
    for(i=n; i < n+2; i++){
        
        var id = i.toString();
        $('#show_' + id ).fadeIn();
    }
    if(i >= l+1){
        $('#loaded_posts').hide();
        $('#all_loaded').show();
    }
    $('#num_loaded').val(i);
}