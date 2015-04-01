( function() {

'use strict';

test( 'basic layout top left', function() {
  var container = document.querySelector('#basic-layout-top-left');
  var msnry = new Masonry( container, {
    columnWidth: 60
  });

  checkItemPositions( msnry, {
    0: {
      left: 0,
      top: 0
    },
    1: {
      left: 60,
      top: 0
    },
    2: {
      left: 120,
      top: 0
    },
    3: {
      left: 0,
      top: 30
    },
    4: {
      left: 60,
      top: 90
    }
  });

});

test( 'basic layout top right', function() {
  var container = document.querySelector('#basic-layout-top-right');
  var msnry = new Masonry( container, {
    isOriginLeft: false,
    columnWidth: 60
  });

  checkItemPositions( msnry, {
    0: {
      right: 0,
      top: 0
    },
    1: {
      right: 60,
      top: 0
    },
    2: {
      right: 120,
      top: 0
    },
    3: {
      right: 0,
      top: 30
    },
    4: {
      right: 60,
      top: 90
    }
  });

});

test( 'basic layout bottom left', function() {
  var container = document.querySelector('#basic-layout-bottom-left');
  var msnry = new Masonry( container, {
    isOriginTop: false,
    columnWidth: 60
  });

  checkItemPositions( msnry, {
    0: {
      left: 0,
      bottom: 0
    },
    1: {
      left: 60,
      bottom: 0
    },
    2: {
      left: 120,
      bottom: 0
    },
    3: {
      left: 0,
      bottom: 30
    },
    4: {
      left: 60,
      bottom: 90
    }
  });

});

test( 'basic layout bottom right', function() {
  var container = document.querySelector('#basic-layout-bottom-right');
  var msnry = new Masonry( container, {
    isOriginLeft: false,
    isOriginTop: false,
    columnWidth: 60
  });

  checkItemPositions( msnry, {
    0: {
      right: 0,
      bottom: 0
    },
    1: {
      right: 60,
      bottom: 0
    },
    2: {
      right: 120,
      bottom: 0
    },
    3: {
      right: 0,
      bottom: 30
    },
    4: {
      right: 60,
      bottom: 90
    }
  });

});

})();
