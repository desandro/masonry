/**
 * Masonry v2 shim
 * to maintain backwards compatibility
 */

( function( window ) {

  'use strict';

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
    var that = this;
    this._remapV2Options();
    __create.apply( this, arguments );
    setTimeout( function() {
      jQuery( that.element ).addClass( 'masonry' );
    }, 0 );
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

  var __itemize = Masonry.prototype._itemize;
  Masonry.prototype._itemize = function( elements ) {
    var items = __itemize.apply( this, arguments );
    jQuery( elements ).addClass( 'masonry-brick' );
    return items;
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

  Masonry.prototype.reload = function() {
    this.reloadItems.apply( this, arguments );
    this.layout.apply( this );
  };

  var _destroy = Masonry.prototype.destroy;
  Masonry.prototype.destroy = function() {
    var items = this.getItemElements();
    jQuery( this.element ).removeClass( 'masonry' );
    jQuery( items ).removeClass( 'masonry-brick' );
    _destroy.apply( this, arguments );
  };

})( window );
