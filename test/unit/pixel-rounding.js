QUnit.test( 'pixel rounding', function( assert ) {
  var container = document.querySelector('#pixel-rounding');
  var msnry = new Masonry( container, {
    gutter: '.gutter-sizer',
    itemSelector: '.item',
    transitionDuration: 0
  });

  var lastItem = msnry.items[2];

  var containerWidth = 170;
  while ( containerWidth < 210 ) {
    container.style.width = containerWidth + 'px';
    msnry.layout();
    assert.equal( lastItem.position.y, 0,'3rd item on top row, container width = ' + containerWidth );
    containerWidth++;
  }

});
