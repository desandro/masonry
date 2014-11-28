test( 'look-ahead', function() {
  var container = document.querySelector('#look-ahead');
  var msnry = new Masonry( container, {
    columnWidth: 60,
    lookAhead: 3
  });

  checkItemPositions( msnry, {
    0: { left: 0, top: 0 },
    1: { left: 60, top: 0 },
    2: { left: 60, top: 90 },
    3: { left: 120, top: 0 },
    4: { left: 0, top: 30 }
  });
});
