# BigSEO

BigSEO is a ExpresJS module built for apps who need a SEO Engine exclusively for web crawlers such as Google, Bing, Facebook, etc.

BigSEO is a simple middleware for expressjs to handle crawler requests.

```npm install bigseo --save```

Things you can make crawlers see if you use BigSEO:

1. AngularJS rendered pages
1. Disqus comments
1. Facebook comments
1. Javascript dom modifications
1. etc

Things you can do if you use BigSEO:

1. Add crawlers meta tags via javascript
1. Load your content through AJAX
1. Write AngularJS applications with no worries about SEO
1. etc

## Release notes
1. **0.6.2**
    1. Verifying cache validation before saving
1. **0.6.1**
    1. Fixing root url hashbang that wasn't matching
1. **0.6.0**
    1. MAJOR FIX FOR ANGULARJS APPLICATION. PLEASE UPDATE
1. **0.5.0**
    1. Independent angularjs module (You don't need to import bigseo.js anymore)
    1. Cache validation. Now your cache file, by default, is valid for 24 hours. You can change this to any value you want in hours. (Use 0 to regenerate your cache everytime)

###TODO:
1. List all relevant robot's user-agents
1. Enhance browser lib with non-jquery features and better callbacks
1. Extend to work with other languages (PHP mostly)

## How it works
When you receive a new request, this request is processed in BigSEO's middleware to detect whether the request if from a browser or a Bot. If we detect that the request came from a Bot, we check if there is a cached version of the requested URL. If there is, we deliver the cache, if there is not, we proceed with the request.

The cache is generate by users when they navigate your website so you can always have a updated version of the page.

## ExpressJS 4.x

It is very simple to use BigSEO. Under your server application, insert this code snippet right before your route definitions. From now on, we will route every crawler request directly to an existing cache. If there is no cache, we will proceed with the request to the default response.

```javascript
var bigSeo = require('bigseo')();
// Your application config
app.use(bigSeo.run());
// Your application routes
```

BigSEO have a few optional configurations that you can put in the constructor.

```javascript
// Default values
opts = {
    log: process.env.NODE_ENV == 'production' ? false : true,
    cache_path: 'caches',
    cache_url: '/save/cache',
    valid_url: '/valid/cache',
    valid_for: 24 // hours
};
```

Ex: ```var bigSeo = require('bigseo')({log: false});```

At the moment you start your express application, BigSEO will create by default a ```caches/``` where it will save the cached content.

The cache name is a base64.html generated from the saved url.

## ExpressJS 3.x
Similar to 4.x
```javascript
var bigSeo = require('bigseo')();
// Your app config
app.use(bigSeo.middleware);
app.post('/save/cache', bigSeo.cache);
app.post('/valid/cache', bigSeo.valid);
app.get('/bigseo/bigseo.js', bigSeo.staticJS);
app.get('/bigseo/angular-bigseo.js', bigSeo.angularJS);
// Your app routes
```

## Saving your cache

Now, in order to build your cache, just put this tag on the html page you want to be ativated.

```html
<script src='/bigseo/bigseo.js'></script>
```

And run the save method when you think the DOM is ready to be saved.
```javascript
var bigSeo = new BigSEO();
bigSeo.save(); // Call when you think its ready to save a new cache
```

The save method accepts 2 parameters, the success and the error callback in that specific order.


The BigSEO client construct also accepts a ```opts``` parameter with the following default value:
```javascript
opts = {
    url: '/save/cache'
};
```

Ex: ```var bigSeo = new BigSEO({url: '/cache'});```

**Warning: If you change the save path on your express application, your also have to change in the client settings**

## Using with angularjs

Import BigSEO's AngularJS module
```html
<script src='/bigseo/angular-bigseo.js'></script>
```

Add to your application modules
```javascript
var yourApp = angular.module('yourApp', ['bigseo']);
```

Add to your Controller and call it when you have everything loaded
```javascript
angular.module('test').controller('IndexCtrl', ['$scope', '$location', 'API', 'bigseo', function($scope, $location, API, bigseo) {
    API.list().
        success(function (data, status, headers, config) {
            $scope.beers = data.beers;
            bigseo.save();
        }).
        error(function (data, status, headers, config) {
        });
}]);

```

### Remember to use hashbang for Urls. Here is a [simple guide](http://fdietz.github.io/recipes-with-angular-js/urls-routing-and-partials/client-side-routing-with-hashbang-urls.html).

## user-agents reference
The user agents reference can be found [here](http://user-agent-string.info/list-of-ua/bots).

You can find the list of implemented user agents [here](https://github.com/grillorafael/bigseo/blob/master/index.js).

Please **contribute** by adding more relevant items to the list!  

## LICENSE
The MIT License (MIT)

Copyright (c) [2014] [Rafael Grillo Abreu]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
