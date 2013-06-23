test( 'empty', function() {

  var container = document.querySelector('#empty');
  var msnry = new Masonry( container );

  ok( true, 'empty masonry did not throw error' );
  equal( msnry.columnWidth, getSize( container ).innerWidth, 'columnWidth = innerWidth' );

});
