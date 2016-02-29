QUnit.test( 'fit unused columns', function( assert ) {

  var container = document.querySelector('#fit-unused-columns .container');
  var msnry = new Masonry( container, {
    columnWidth: 60,
    fitWidth: true,
    fitUnusedColumns: true
  });

  assert.equal( 3, msnry.cols, '3 columns' );
  assert.equal( container.style.width, msnry.cols * msnry.columnWidth + 'px', 'width set to match 3 columns' );

});
