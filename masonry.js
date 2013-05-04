/*!
 * Masonry v3
 * grid layout, like a mason fitting stones in a wall
 * http://masonry.desandro.com
 * MIT License
 * by David DeSandro
 */

( function( window ) {

'use strict';

// vars
// var document = window.document;

// -------------------------- helpers -------------------------- //

function indexOf( items, value ) {
  for ( var i=0, len = items.length; i < len; i++ ) {
    var item = items[i];
    if ( item === value ) {
      return i;
    }
  }
  return -1;
}

// -------------------------- masonryDefinition -------------------------- //

// used for AMD definition and requires
function masonryDefinition( Outlayer, getSize ) {

  var Masonry = Outlayer.create('masonry');

  Masonry.prototype._resetLayout = function() {
    this.getSize();
    this._getMeasurement( 'columnWidth', 'outerWidth' );
    this._getMeasurement( 'gutter', 'outerWidth' );
    this.measureColumns();

    // reset column Y
    var i = this.cols;
    this.colYs = [];
    while (i--) {
      this.colYs.push( 0 );
    }

    this.maxY = 0;
  };

  Masonry.prototype.measureColumns = function() {
    // if columnWidth is 0, default to outerWidth of first item
    var firstItemElem = this.items[0].element;
    this.columnWidth = this.columnWidth || getSize( firstItemElem ).outerWidth;

    this.cols = Math.floor( ( this.size.innerWidth + this.gutterWidth ) / this.columnWidth );
    this.cols = Math.max( this.cols, 1 );
  };

  Masonry.prototype.layoutItems = function( items, isInstant ) {
    if ( !items || !items.length ) {
      return;
    }

    // emit layoutComplete when done
    this._itemsOn( items, 'layout', function onItemsLayout() {
      this.emitEvent( 'layoutComplete', [ this, items ] );
    });

    for ( var i=0, len = items.length; i < len; i++ ) {
      var item = items[i];
      var position = this._getBrickPosition( item );
      this._layoutItem( item, position.x, position.y, isInstant );
    }

    this.maxY = Math.max.apply( Math, this.colYs );
    this._setElementSize();

  };

  /**
   * get position to set item in masonry layout
   * @param {Masonry.Item} item
   */
  Masonry.prototype._getBrickPosition = function( item ) {
    item.getSize();
    //how many columns does this brick span
    var colSpan = Math.ceil( item.size.outerWidth / this.columnWidth );
    colSpan = Math.min( colSpan, this.cols );

    var colGroup;

    if ( colSpan === 1 ) {
      // if brick spans only one column, just like singleMode
      colGroup = this.colYs;
    } else {
      // brick spans more than one column
      // how many different places could this brick fit horizontally
      var groupCount = this.cols + 1 - colSpan;
      colGroup = [];

      // for each group potential horizontal position
      for ( var j=0; j < groupCount; j++ ) {
        // make an array of colY values for that one group
        var groupColY = this.colYs.slice( j, j + colSpan );
        // and get the max value of the array
        colGroup[j] = Math.max.apply( Math, groupColY );
      }
    }

    // get the minimum Y value from the columns
    var minimumY = Math.min.apply( Math, colGroup );
    var shortColIndex = indexOf( colGroup, minimumY );

    // position the brick
    var position = {
      x: this.columnWidth * shortColIndex,
      y: minimumY
    };

    // apply setHeight to necessary columns
    var setHeight = minimumY + item.size.outerHeight;
    var setSpan = this.cols + 1 - colGroup.length;
    for ( var i = 0; i < setSpan; i++ ) {
      this.colYs[ shortColIndex + i ] = setHeight;
    }

    return position;
  };

  Masonry.prototype._setElementSize = function() {
    var elemH = this.maxY;
    // add padding and border width if border box
    if ( this.size.isBorderBox ) {
      elemH += this.size.paddingBottom + this.size.paddingTop +
        this.size.borderTopWidth + this.size.borderBottomWidth;
    }
    this.element.style.height = elemH + 'px';
  };

  return Masonry;
}

// -------------------------- transport -------------------------- //

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( [
      'outlayer',
      'get-size'
    ],
    masonryDefinition );
} else {
  // browser global
  window.Masonry = masonryDefinition(
    window.Outlayer,
    window.getSize
  );
}

})( window );
