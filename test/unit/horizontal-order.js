QUnit.test( 'horizontal order', function( assert ) {

  var grid = document.querySelector('#horizontal-order');
  var itemElems = grid.querySelectorAll('.item');
  new Masonry( grid, {
    horizontalOrder: true,
  });

  // items should match %3 column
  for ( var i=0; i < itemElems.length; i++ ) {
    var itemElem = itemElems[i];
    var col = i % 3;
    var left = col * 60 + 'px';
    var message = 'item ' + (i+1) + ', column' + (col + 1);
    assert.equal( itemElem.style.left, left, message );
  }

});
