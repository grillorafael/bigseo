'use_strict';

var _ = require('underscore'),
    fs = require('fs');

function BigSEO(opts) {
    this.TAG = "BigSEO";

    this.opts = {
        log: true,
        cache_path: 'caches',
        cache_url: '/save/cache'
    };

    this.ua = {
        "Ruby": true,
        "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)": true
    };

    if(!fs.existsSync(this.opts.cache_path)) {
        fs.mkdirSync(this.opts.cache_path);
    }
    _.extend(this.opts, opts);
};

BigSEO.prototype.cache = function() {
    var _this = this;
    var express = require('express');
    var router = express.Router();

    router.post(this.opts.cache_url, function(req, res) {
        var body = req.body.dom;
        var rawUrl = req.body.url;
        var url = _this.encodeURL(rawUrl);

        _this.debug("Saving cache: " + _this.cachePathFor(url));

        fs.writeFile(_this.cachePathFor(url), body, function(err) {
            if(err) {
                console.log(err);
                _this.debug("Error saving cache for: " + rawUrl);
                res.send(500);
            }
            else {
                _this.debug("New cache for url: " + rawUrl);
                res.send(200);
            }
        });
    });

    return router;
};


BigSEO.prototype.run = function() {
    var currentDir = __dirname;
    var _this = this;
    var express = require('express');
    var router = express.Router();

    router.use(function(req, res, next) {
        var ua = req.headers['user-agent'];
        _this.debug("UA: " + ua);

        var url = req.protocol + "://" + req.headers.host + req.originalUrl;
        if (req.method == "GET" && _this.matchUA(ua) && _this.hasCacheFor(url)) {
            _this.debug('Cache Hit for ' + url);
            res.send(_this.getCacheContentFor(url));
        } else {
            _this.debug('Cache Miss for ' + url);
            next();
        }
    });

    router.get('/bigseo/bigseo.js', function(req, res) {
        fs.readFile(currentDir + '/static/bigseo.js', function(err, data) {
            if(!err) {
                res.status(200).send(data);
            }
            else {
                res.send(404);
            }
        });
    });

    return router;
};

BigSEO.prototype.getCacheContentFor = function(url) {
    return fs.readFileSync(this.cachePathFor(this.encodeURL(url))).toString('utf8');
};

BigSEO.prototype.debug = function(mixed) {
    if (this.opts.log) {
        console.log(this.TAG, mixed);
    }
};

BigSEO.prototype.hasCacheFor = function(url) {
    return fs.existsSync(this.cachePathFor(this.encodeURL(url)));
};

BigSEO.prototype.cachePathFor = function(encodedUrl) {
    return this.opts.cache_path + '/' + encodedUrl + ".html";
};

BigSEO.prototype.matchUA = function(uaStr) {
    return this.ua[uaStr] === true;
};

BigSEO.prototype.encodeURL = function(url) {
    return new Buffer(url).toString('base64');
};

module.exports = function(opts) {
    return new BigSEO(opts);
};
