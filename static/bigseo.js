function BigSEO(opts) {
    this.opts = {
        url: '/save/cache'
    };
};

BigSEO.prototype.save = function(success, error) {
    var dom = document.documentElement.innerHTML,
        url = document.URL;

    if(!success) {
        success = function(data) {};
    }

    if(!error) {
        error = function(data) {};
    }

    if(jQuery) {
        $.ajax({
            url: this.opts.url,
            method: "POST",
            data: {
                dom: dom,
                url: url
            },
            success: success,
            error: error
        });
    }
    else {
        // TODO: Handle non jquery pages
    }
};
