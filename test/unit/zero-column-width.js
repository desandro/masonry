QUnit.test( 'zero column width', function( assert ) {
  var msnry = new Masonry( '#zero-column-width' );
  assert.equal( msnry.columnWidth, 180, 'columnWidth = container innerWidth');
});
