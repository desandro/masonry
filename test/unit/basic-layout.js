QUnit.test( 'basic layout top left', function( assert ) {
  var msnry = new Masonry( '#basic-layout-top-left', {
    columnWidth: 60
  });

  checkItemPositions( msnry, assert, {
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

QUnit.test( 'basic layout top right', function( assert ) {
  var msnry = new Masonry( '#basic-layout-top-right', {
    isOriginLeft: false,
    columnWidth: 60
  });

  checkItemPositions( msnry, assert, {
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

QUnit.test( 'basic layout bottom left', function( assert ) {
  var msnry = new Masonry( '#basic-layout-bottom-left', {
    isOriginTop: false,
    columnWidth: 60
  });

  checkItemPositions( msnry, assert, {
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

QUnit.test( 'basic layout bottom right', function( assert ) {
  var msnry = new Masonry( '#basic-layout-bottom-right', {
    isOriginLeft: false,
    isOriginTop: false,
    columnWidth: 60
  });

  checkItemPositions( msnry, assert, {
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
