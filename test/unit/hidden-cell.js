( function() {

'use strict';

test( 'hidden cell', function() {
  var container = document.querySelector('#hidden-cell');
  var msnry = new Masonry( container, {
    itemSelector: '.item',
    transitionDuration: 0
  });

  var firstItem = msnry.items[0],
      lastItem = msnry.items[2];

  msnry.hide([firstItem]);
  msnry.layout();

  equal( lastItem.position.y, 0, '3rd item on top row' );

  msnry.reveal([firstItem]);
  msnry.layout();

  firstItem.element.style.display = 'none';
  msnry.layout();

  equal( lastItem.position.y, 0, '3rd item on top row' );
});

})();
