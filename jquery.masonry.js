/**
 * jQuery Masonry v2.0.110514
 * The flip-side of CSS Floats.
 * jQuery plugin that rearranges item elements to a grid.
 * http://masonry.desandro.com
 *
 * Copyright 2011 David DeSandro
 */

(function( window, $, undefined ){

  /*
   * smartresize: debounced resize event for jQuery
   *
   * latest version and complete README available on Github:
   * https://github.com/louisremi/jquery.smartresize.js
   *
   * Copyright 2011 @louis_remi
   * Licensed under the MIT license.
   */

  var $event = $.event,
      resizeTimeout;

  $event.special.smartresize = {
    setup: function() {
      $(this).bind( "resize", $event.special.smartresize.handler );
    },
    teardown: function() {
      $(this).unbind( "resize", $event.special.smartresize.handler );
    },
    handler: function( event, execAsap ) {
      // Save the context
      var context = this,
          args = arguments;

      // set correct event type
      event.type = "smartresize";

      if ( resizeTimeout ) { clearTimeout( resizeTimeout ); }
      resizeTimeout = setTimeout(function() {
        jQuery.event.handle.apply( context, args );
      }, execAsap === "execAsap"? 0 : 100 );
    }
  };

  $.fn.smartresize = function( fn ) {
    return fn ? this.bind( "smartresize", fn ) : this.trigger( "smartresize", ["execAsap"] );
  };



// ========================= Masonry ===============================


  // our "Widget" object constructor
  $.Mason = function( options, element ){
    this.element = $( element );

    this._create( options );
    this._init();
  };
  
  // styles of container element we want to keep track of
  var isoContainerStyles = [ 'overflow', 'position', 'width', 'height' ];
  
  $.Mason.settings = {
    resizable: true,
    animationOptions: {
      queue: false,
      duration: 500
    },
    resizesContainer: true
  };

  $.Mason.prototype = {

    _filterFind: function( $elems, selector ) {
      return selector ? $elems.filter( selector ).add( $elems.find( selector ) ) : $elems;
    },
    
    // sets up widget
    _create : function( options ) {
      
      this.options = $.extend( true, {}, $.Mason.settings, options );
      
      this.styleQueue = [];
      // need to get atoms
      this.$allAtoms = this._filterFind( this.element.children(), this.options.itemSelector );

      // get original styles in case we re-apply them in .destroy()
      var elemStyle = this.element[0].style;
      this.originalStyle = {};
      for ( var i=0, len = isoContainerStyles.length; i < len; i++ ) {
        var prop = isoContainerStyles[i];
        this.originalStyle[ prop ] = elemStyle[ prop ] || null;
      }
      
      this.element.css({
        position : 'relative'
      });
      
      this._setupAtoms( this.$allAtoms );
      
      
      // get top left position of where the bricks should be
      var $cursor   = $( document.createElement('div') );
      this.element.prepend( $cursor );
      this.posTop  = Math.round( $cursor.position().top );
      this.posLeft = Math.round( $cursor.position().left );
      $cursor.remove();

      // add masonry class first time around
      var instance = this;
      setTimeout( function() {
        instance.element.addClass('masonry');
      }, 0 );
      
      // bind resize method
      if ( this.options.resizable ) {
        $(window).bind( 'smartresize.masonry', function() { 
          instance.element.masonry('resize');
        });
      }
      
    },
  
    // _init fires when your instance is first created
    // (from the constructor above), and when you
    // attempt to initialize the widget again (by the bridge)
    // after it has already been initialized.
    _init : function( callback ) {
      
      this.$filteredAtoms = this.$allAtoms;
      
      this.reLayout( callback );

    },

    option: function( key, value ){
      
      // get/change options AFTER initialization:
      // you don't have to support all these cases,
      // but here's how:
    
      // signature: $('#foo').bar({ cool:false });
      if ( $.isPlainObject( key ) ){
        this.options = $.extend(true, this.options, key);
        for ( optionName in key ) {
          this._updateOption( optionName );
        }
    
      // signature: $('#foo').option('cool');  - getter
      } else if ( key && typeof value === "undefined" ){
        return this.options[ key ];
        
      // signature: $('#foo').bar('option', 'baz', false);
      } else {
        this.options[ key ] = value;
        this._updateOption( key );
      }
    
      return this; // make sure to return the instance!
    },
    
    // ====================== Adding ======================
    
    _setupAtoms : function( $atoms ) {
      
      // base style for atoms
      var atomStyle = { position: 'absolute' };

      $atoms.css({
        position: 'absolute'
      }).addClass( this.options.itemClass );
      
    },
    
    // ====================== Layout ======================

    _positionAbs : function( x, y ) {
      return { left: x, top: y };
    },

    _pushPosition : function( $elem, x, y ) {
      var position = { left: x, top: y };
      this.styleQueue.push({ $el: $elem, style: position });
      if ( this.options.itemPositionDataEnabled ) {
        $elem.data('masonry-item-position', {x: x, y: y} );
      }
    },


    // ====================== General Layout ======================

    // used on collection of atoms (should be filtered, and sorted before )
    // accepts atoms-to-be-laid-out to start with
    layout : function( $elems, callback ) {

      var layoutMode = this.options.layoutMode;

      // layout logic
      this._masonryLayout( $elems );
      
      // set the size of the container
      if ( this.options.resizesContainer ) {
        var containerStyle = this._masonryGetContainerSize();
        this.styleQueue.push({ $el: this.element, style: containerStyle });
      }

      // are we animating the layout arrangement?
      // use plugin-ish syntax for css or animate
      var styleFn = !this.isLaidOut ? 'css' : (
            this.isUsingJQueryAnimation ? 'animate' : 'css'
          ),
          animOpts = this.options.animationOptions;

      // process styleQueue
      $.each( this.styleQueue, function( i, obj ) {
        obj.$el[ styleFn ]( obj.style, animOpts );
      });

      // clear out queue for next time
      this.styleQueue = [];

      // provide $elems as context for the callback
      if ( callback ) {
        callback.call( $elems );
      }
      
      this.isLaidOut = true;

      return this;
    },
    
    
    resize : function() {
      return this._masonryResize();
    },
    
    
    reLayout : function( callback ) {
      
      return this._masonryReset()
        .layout( this.$filteredAtoms, callback );
      
    },
    
    // ====================== Convenience methods ======================
    
    // adds a jQuery object of items to a masonry container
    addItems : function( $content, callback ) {
      var $newAtoms = this._filterFind( $content, this.options.itemSelector );
      this._setupAtoms( $newAtoms );
      // add new atoms to atoms pools
      // FIXME : this breaks shuffle order and returns to original order
      this.$allAtoms = this.$allAtoms.add( $newAtoms );

      if ( callback ) {
        callback( $newAtoms );
      }
    },
    
    // convienence method for adding elements properly to any layout
    insert : function( $content, callback ) {
      this.element.append( $content );
      
      var instance = this;
      this.addItems( $content, function( $newAtoms ) {
        var $filteredAtoms = instance._filter( $newAtoms );
        instance.$filteredAtoms = instance.$filteredAtoms.add( $filteredAtoms );
      });
      
      this._sort().reLayout( callback );
      
    },
    
    // convienence method for working with Infinite Scroll
    appended : function( $content, callback ) {
      var instance = this;
      this.addItems( $content, function( $newAtoms ){
        instance.$filteredAtoms = instance.$filteredAtoms.add( $newAtoms );
        instance.layout( $newAtoms, callback );
      });
    },
    
    // removes elements from Masonry widget
    remove : function( $content ) {

      this.$allAtoms = this.$allAtoms.not( $content );
      this.$filteredAtoms = this.$filteredAtoms.not( $content );

      $content.remove();
      
    },
    
    _shuffleArray : function ( array ) {
      var tmp, current, i = array.length;
      
      if ( i ){ 
        while(--i) {
          current = ~~( Math.random() * (i + 1) );
          tmp = array[current];
          array[current] = array[i];
          array[i] = tmp;
        }
      }
      return array;
    },
    
    // HACKy should probably remove
    shuffle : function( callback ) {
      this.options.sortBy = 'shuffle';
      
      this.$allAtoms = this._shuffleArray( this.$allAtoms );
      this.$filteredAtoms = this._filter( this.$allAtoms );
      
      return this.reLayout( callback );
    },
    
    // destroys widget, returns elements and container back (close) to original style
    destroy : function() {

      var usingTransforms = this.usingTransforms;

      this.$allAtoms
        .removeClass( this.options.hiddenClass + ' ' + this.options.itemClass )
        .each(function(){
          this.style.position = null;
          this.style.top = null;
          this.style.left = null;
          this.style.opacity = null;
          if ( usingTransforms ) {
            this.style[ transformProp ] = null;
          }
        });
      
      // re-apply saved container styles
      var elemStyle = this.element[0].style;
      for ( var i=0, len = isoContainerStyles.length; i < len; i++ ) {
        var prop = isoContainerStyles[i];
        elemStyle[ prop ] = this.originalStyle[ prop ];
      }
      
      this.element
        .unbind('.masonry')
        .removeClass( this.options.containerClass )
        .removeData('masonry');
      
      $(window).unbind('.masonry');

    },
    
    // calculates number of rows or columns
    // requires columnWidth or rowHeight to be set on namespaced object
    // i.e. this.masonry.columnWidth = 200
    _getSegments : function( namespace, isRows ) {
      var measure  = isRows ? 'rowHeight' : 'columnWidth',
          size     = isRows ? 'height' : 'width',
          UCSize   = isRows ? 'Height' : 'Width',
          segmentsName = isRows ? 'rows' : 'cols',
          segments,
          segmentSize;
      
      this[ size ] = this.element[ size ]();
      
                    // i.e. options.masonry && options.masonry.columnWidth
      segmentSize = this.options[ namespace ] && this.options[ namespace ][ measure ] ||
                    // or use the size of the first item
                    this.$filteredAtoms[ 'outer' + UCSize ](true) ||
                    // if there's no items, use size of container
                    this[ size ];
      
      segments = Math.floor( this[ size ] / segmentSize );
      segments = Math.max( segments, 1 );

      // i.e. this.masonry.cols = ....
      this[ namespace ][ segmentsName ] = segments;
      // i.e. this.masonry.columnWidth = ...
      this[ namespace ][ measure ] = segmentSize;
      
      return this;
      
    },

  // ====================== LAYOUTS ======================
  
  
  // ====================== Masonry ======================
  
    _masonryPlaceBrick : function( $brick, setCount, setY ) {
      // here, `this` refers to a child element or "brick"
          // get the minimum Y value from the columns
      var minimumY  = Math.min.apply( Math, setY ),
          setHeight = minimumY + $brick.outerHeight(true),
          i         = setY.length,
          shortCol  = i,
          setSpan   = this.masonry.cols + 1 - i,
          x, y ;
      // Which column has the minY value, closest to the left
      while (i--) {
        if ( setY[i] === minimumY ) {
          shortCol = i;
        }
      }
    
      // position the brick
      x = this.masonry.columnWidth * shortCol + this.posLeft;
      y = minimumY;
      this._pushPosition( $brick, x, y );

      // apply setHeight to necessary columns
      for ( i=0; i < setSpan; i++ ) {
        this.masonry.colYs[ shortCol + i ] = setHeight;
      }

    },
  
  
    _masonryLayout : function( $elems ) {
      var instance = this;
      $elems.each(function(){
        var $this  = $(this),
            //how many columns does this brick span
            colSpan = Math.ceil( $this.outerWidth(true) / instance.masonry.columnWidth );
        colSpan = Math.min( colSpan, instance.masonry.cols );

        if ( colSpan === 1 ) {
          // if brick spans only one column, just like singleMode
          instance._masonryPlaceBrick( $this, instance.masonry.cols, instance.masonry.colYs );
        } else {
          // brick spans more than one column
          // how many different places could this brick fit horizontally
          var groupCount = instance.masonry.cols + 1 - colSpan,
              groupY = [],
              groupColY,
              i;

          // for each group potential horizontal position
          for ( i=0; i < groupCount; i++ ) {
            // make an array of colY values for that one group
            groupColY = instance.masonry.colYs.slice( i, i+colSpan );
            // and get the max value of the array
            groupY[i] = Math.max.apply( Math, groupColY );
          }
        
          instance._masonryPlaceBrick( $this, groupCount, groupY );
        }
      });
      return this;
    },
  
    // reset
    _masonryReset : function() {
      // layout-specific props
      this.masonry = {};
      // FIXME shouldn't have to call this again
      this._getSegments('masonry');
      var i = this.masonry.cols;
      this.masonry.colYs = [];
      while (i--) {
        this.masonry.colYs.push( this.posTop );
      }
      return this;
    },
  
    _masonryResize : function() {
      var prevColCount = this.masonry.cols;
      // get updated colCount
      this._getSegments('masonry');
      if ( this.masonry.cols !== prevColCount ) {
        // if column count has changed, do a new column cound
        this.reLayout();
      }

      return this;
    },
  
    _masonryGetContainerSize : function() {
      var containerHeight = Math.max.apply( Math, this.masonry.colYs ) - this.posTop;
      return { height: containerHeight };
    },

  
  };
  
  
  // ======================= imagesLoaded Plugin  ===============================
  // A fork of http://gist.github.com/268257 by Paul Irish

  // mit license. paul irish. 2010.
  // webkit fix from Oren Solomianik. thx!

  $.fn.imagesLoaded = function(callback){
    var elems = this.find('img'),
        len   = elems.length,
        _this = this;

    if ( !elems.length ) {
      callback.call( this );
    }

    elems.bind('load',function(){
      if (--len <= 0){ 
        callback.call( _this ); 
      }
    }).each(function(){
      // cached images don't fire load sometimes, so we reset src.
      if (this.complete || this.complete === undefined){
        var src = this.src;
        // webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
        // data uri bypasses webkit log warning (thx doug jones)
        this.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
        this.src = src;
      }  
    }); 

    return this;
  };

  

// ======================= jQuery Widget bridge  ===============================


/*!
 * jQuery UI Widget 1.8.5
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Widget
 */

  $.widget = $.widget || {};

  $.widget.bridge = $.widget.bridge || function( name, object ) {
    $.fn[ name ] = function( options ) {
      var isMethodCall = typeof options === "string",
        args = Array.prototype.slice.call( arguments, 1 ),
        returnValue = this;

      // allow multiple hashes to be passed on init
      options = !isMethodCall && args.length ?
        $.extend.apply( null, [ true, options ].concat(args) ) :
        options;

      // prevent calls to internal methods
      if ( isMethodCall && options.charAt( 0 ) === "_" ) {
        return returnValue;
      }

      if ( isMethodCall ) {
        this.each(function() {
          var instance = $.data( this, name );
          if ( !instance ) {
            return $.error( "cannot call methods on " + name + " prior to initialization; " +
              "attempted to call method '" + options + "'" );
          }
          if ( !$.isFunction( instance[options] ) ) {
            return $.error( "no such method '" + options + "' for " + name + " widget instance" );
          }
          var methodValue = instance[ options ].apply( instance, args );
          if ( methodValue !== instance && methodValue !== undefined ) {
            returnValue = methodValue;
            return false;
          }
        });
      } else {
        this.each(function() {
          var instance = $.data( this, name );
          if ( instance ) {
            instance.option( options || {} )._init();
          } else {
            $.data( this, name, new object( options, this ) );
          }
        });
      }

      return returnValue;
    };
  };
  
  
  $.widget.bridge( 'masonry', $.Mason );

})( window, jQuery );