# Masonry

_Cascading grid layout library_

Masonry works by placing elements in optimal position based on available vertical space, sort of like a mason fitting stones in a wall. You’ve probably seen it in use all over the Internet.

See [masonry.desandro.com](http://masonry.desandro.com) for complete docs and demos.

## Install

### Download

+ [masonry.pkgd.js](https://github.com/desandro/masonry/raw/master/dist/masonry.pkgd.js) un-minified, or
+ [masonry.pkgd.min.js](https://github.com/desandro/masonry/raw/master/dist/masonry.pkgd.min.js) minified

### CDN

Link directly to Masonry files on [unpkg](https://unpkg.com/).

``` html
<script src="https://unpkg.com/masonry-layout@4.1/dist/masonry.pkgd.js"></script>
<!-- or -->
<script src="https://unpkg.com/masonry-layout@4.1/dist/masonry.pkgd.min.js"></script>
```

### Package managers

Bower: `bower install masonry --save`

[npm](https://www.npmjs.com/package/masonry-layout): `npm install masonry-layout --save`

## Initialize

With jQuery

``` js
$('.grid').masonry({
  // options...
  itemSelector: '.grid-item',
  columnWidth: 200
});
```

With vanilla JavaScript

``` js
// vanilla JS
// init with element
var grid = document.querySelector('.grid');
var msnry = new Masonry( grid, {
  // options...
  itemSelector: '.grid-item',
  columnWidth: 200
});

// init with selector
var msnry = new Masonry( '.grid', {
  // options...
});
```

With HTML

Add a `data-masonry` attribute to your element. Options can be set in JSON in the value.

``` html
<div class="grid" data-masonry='{ "itemSelector": ".grid-item", "columnWidth": 200 }'>
  <div class="grid-item"></div>
  <div class="grid-item"></div>
  ...
</div>
```

## License

Masonry is released under the [MIT license](http://desandro.mit-license.org). Have at it.

* * *

Made by David DeSandro
