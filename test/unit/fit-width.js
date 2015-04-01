test( 'fit width', function() {

  var container = document.querySelector('#fit-width .container');
  var msnry = new Masonry( container, {
    columnWidth: 60,
    isFitWidth: true
  });

  equal( msnry.cols, 2, '2 columns' );
  equal( msnry.cols * msnry.columnWidth + 'px', container.style.width, 'width set to match' );

});
