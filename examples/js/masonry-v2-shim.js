/**
 * Masonry v2 shim
 * to maintain backwards compatibility
 */

( function( window ) {

  var Masonry = window.Masonry;

  Masonry.prototype._remapV2Options = function() {
    // map v2 options to v3 equivalents
    this._remapOption( 'gutterWidth', 'gutter' );
    this._remapOption( 'isResizable', 'isResizeBound' );
    this._remapOption( 'isRTL', 'isOriginLeft', function( opt ) {
      return !opt;
    });

    // override transitionDuration with isAnimated
    var isAniOption = this.options.isAnimated;
    if ( isAniOption !== undefined ) {
      this.options.transitionDuration = isAniOption ?
        Masonry.prototype.options.transitionDuration : 0;
    }

    if ( isAniOption === undefined || isAniOption ) {
      // use animation Duration option in place of transitionDuration
      var aniOptions = this.options.animationOptions;
      var aniDuration = aniOptions && aniOptions.duration;
      if ( aniDuration ) {
        this.options.transitionDuration = typeof aniDuration === 'string' ?
          aniDuration : aniDuration + 'ms';
      }
    }
  };

  Masonry.prototype._remapOption = function( from, to, munge ) {
    var fromOption = this.options[ from ];
    if ( fromOption !== undefined ) {
      this.options[ to ] = munge ? munge( fromOption ) : fromOption;
    }
  };

  // remap v2 options for necessary methods

  var __create = Masonry.prototype._create;
  Masonry.prototype._create = function() {
    var classes = this.element.className.split( ' ' );
    if ( classes.indexOf( 'masonry' ) === -1 ) {
      this.element.className += ' masonry';
    }

    this._remapV2Options();
    __create.apply( this, arguments );
  };

  var _layout = Masonry.prototype.layout;
  Masonry.prototype.layout = function() {
    this._remapV2Options();
    _layout.apply( this, arguments );
  };

  var _option = Masonry.prototype.option;
  Masonry.prototype.option = function() {
    _option.apply( this, arguments );
    this._remapV2Options();
  };

  var _layoutItems = Masonry.prototype.layoutItems;
  Masonry.prototype.layoutItems = function( items ) {
  for ( var i=0, len = items.length; i < len; i++ ) {
    var classes = items[i].element.className.split( ' ' );
    if ( classes.indexOf( 'masonry-brick' ) === -1 ) {
      items[i].element.className += ' masonry-brick';
    }
  }
    return _layoutItems.apply( this, arguments );
  };

  // re-enable using function for columnWidth
  var _measureColumns = Masonry.prototype.measureColumns;
  Masonry.prototype.measureColumns = function() {
    var colWOpt = this.options.columnWidth;
    if ( colWOpt && typeof colWOpt === 'function' ) {
      this.getContainerWidth();
      this.columnWidth = colWOpt( this.containerWidth );
    }
    _measureColumns.apply( this, arguments );
  };

})( window );
