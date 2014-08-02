# BigSEO (WIP)

BigSEO is a ExpresJS module built for apps who need a SEO Engine exclusively for web crawlers such as Google, Bing, Facebook, etc.

It is simple to attach to your pre existing ExpressJS application.

```npm install bigseo --save```

###TODO:
1. List robots user agents
1. Implement Express 3.x compatibility
1. Work without jquery

## ExpressJS 4.x

```javascript
var bigSeo = require('bigseo')();
.
.
.
app.use(bigSeo.run());
app.use('/save/cache', bigSeo.cache()); // You can change this route if you want
// Your application routes
```

BigSEO have a few configurable parameters that you can put in the constructor

```javascript
// Default values
opts = {
    log: true,
    cache_url: '/save/cache',
    cache_path: 'caches'
};
```

At the moment you start your express application, BigSEO will create by default a ```caches/``` where it will save the cached content.

The cache name is a base64.html generated from the saved url.

## Browser and Saving Cache

BigSEO also exposes to the browser a BigSEO function under ```/bigseo/bigseo.js```. So you can import this on your layout file

```jade
script(src='/bigseo/bigseo.js')
```
```html
<script src='/bigseo/bigseo.js'></script>
```

The client follows these steps:
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

**REMEBER: IF YOU CHANGE THE SAVE PATH ON YOU EXPRESS APPLICATION, YOU ALSO HAVE TO CHANGE IN THE CLIENTS SETTING**
