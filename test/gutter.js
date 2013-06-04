test( 'gutter', function() {

  var container = document.querySelector('#gutter');
  var msnry = new Masonry( container, {
    columnWidth: 60,
    gutter: 20
  });

  checkItemPositions( msnry, {
    0: { left: 0, top: 0 },
    1: { left: 80, top: 0 },
    2: { left: 160, top: 0 },
    3: { left: 0, top: 30 }
  });

});
