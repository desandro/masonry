window.checkItemPositions = function( msnry, assert, positions ) {
  var i = 0;
  var position = positions[i];
  while ( position ) {
    var style = msnry.items[i].element.style;
    for ( var prop in position ) {
      var value = position[ prop ] + 'px';
      var message = 'item ' + i + ' ' + prop + ' = ' + value;
      assert.equal( style[ prop ], value, message );
    }
    i++;
    position = positions[i];
  }
};
