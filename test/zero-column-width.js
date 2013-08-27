( function() {

'use strict';

test( 'zero column width', function() {
  var container = document.querySelector('#zero-column-width');
  var msnry = new Masonry( container );
  equal( msnry.columnWidth, 180, 'columnWidth = container innerWidth');
});

})();
