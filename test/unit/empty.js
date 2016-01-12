QUnit.test( 'empty', function( assert ) {

  var container = document.querySelector('#empty');
  var msnry = new Masonry( container );

  assert.ok( true, 'empty masonry did not throw error' );
  assert.equal( msnry.columnWidth, getSize( container ).innerWidth, 'columnWidth = innerWidth' );

});
