'use_strict';

var _ = require('underscore'),
    fs = require('fs'),
    _this;

function BigSEO(opts) {
    _this = this;

    this.TAG = "BigSEO";

    this.opts = {
        log: process.env.NODE_ENV == 'production' ? false : true,
        cache_path: 'caches',
        cache_url: '/save/cache'
    };

    this.ua = {
        "Ruby": true,
        "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)": true,
        "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)": true,
        "Mozilla/5.0 (compatible; Genieo/1.0 http://www.genieo.com/webfilter.html)": true,
        "Mozilla/5.0 (compatible; DotBot/1.1; http://www.opensiteexplorer.org/dotbot, help@moz.com)": true,
        "Mozilla/5.0 (compatible; proximic; +http://www.proximic.com/info/spider.php)": true,
        "msnbot-media/1.1 (+http://search.msn.com/msnbot.htm)": true,
        "Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)": true,
        "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)": true,
        "Mozilla/5.0 (compatible; EasouSpider; +http://www.easou.com/search/spider.html)": true,
        "Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)": true,
        "Mozilla/5.0 (compatible; Linux x86_64; Mail.RU_Bot/Robots/2.0; +http://go.mail.ru/help/robots)": true,
        "Mozilla/5.0 (compatible; URLAppendBot/1.0; +http://www.profound.net/urlappendbot.html)": true,
        "www.integromedb.org/Crawler": true,
        "Mozilla/5.0 (compatible; BLEXBot/1.0; +http://webmeup-crawler.com/)": true,
        "Mozilla/5.0 (compatible; Exabot/3.0; +http://www.exabot.com/go/robot)": true,
        "Mozilla/5.0 (compatible; archive.org_bot +http://www.archive.org/details/archive.org_bot)": true,
        "Mozilla/5.0 (compatible; AhrefsBot/5.0; +http://ahrefs.com/robot/)": true,
        "rogerbot/1.0 (http://moz.com/help/pro/what-is-rogerbot-, rogerbot-wherecat@moz.com)": true,
        "voltron": true,
        "Mozilla/5.0 (compatible; Yahoo! Slurp; http://help.yahoo.com/help/us/ysearch/slurp)": true
    };

    _.extend(this.opts, opts);

    fs.exists(this.opts.cache_path, function(exists) {
        if(!exists) {
            fs.mkdir(_this.opts.cache_path, function(err) {
                if(err) {
                    _this.debug(err);
                }
            });
        }
    });
};

BigSEO.prototype.cache = function(req, res) {
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
};

BigSEO.prototype.middleware = function(req, res, next) {
    var ua = req.headers['user-agent'];
    _this.debug("UA: " + ua);

    var url = req.protocol + "://" + req.headers.host + req.originalUrl;
    if (req.method == "GET" && _this.matchUA(ua)) {
        _this.debug("Verifying if has cache for: " + url);
        _this.hasCacheFor(url, function(hasCache) {
            if(hasCache) {
                _this.debug('Cache Hit for ' + url);
                _this.getCacheContentFor(url, function(data) {
                    res.send(data);
                });
            }
            else {
                _this.debug('Cache Miss for ' + url);
                next();
            }
        });
    } else {
        _this.debug('Cache Miss for ' + url);
        next();
    }
};


BigSEO.prototype.run = function() {
    var currentDir = __dirname;

    var express = require('express');
    var router = express.Router();

    router.use(this.middleware);
    router.post(this.opts.cache_url, this.cache);

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

BigSEO.prototype.getCacheContentFor = function(url, cb) {
    fs.readFile(this.cachePathFor(this.encodeURL(url)), function(err, data) {
        cb(data.toString('utf8'));
    });
};

BigSEO.prototype.debug = function(mixed) {
    if (this.opts.log) {
        console.log(this.TAG, mixed);
    }
};

BigSEO.prototype.hasCacheFor = function(url, cb) {
    return fs.exists(this.cachePathFor(this.encodeURL(url)), cb);
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
