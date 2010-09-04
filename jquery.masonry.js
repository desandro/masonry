/*************************************************
**  jQuery Masonry version 1.3.0
**  Copyright David DeSandro, licensed MIT
**  http://desandro.com/resources/jquery-masonry
**************************************************/
;(function($){  

  /*!
   * smartresize: debounced resize event for jQuery
   * http://github.com/lrbabe/jquery-smartresize
   *
   * Copyright (c) 2009 Louis-Remi Babe
   * Licensed under the GPL license.
   * http://docs.jquery.com/License
   *
   */
  var event = $.event,
      resizeTimeout;

  event.special.smartresize = {
    setup: function() {
      $(this).bind( "resize", event.special.smartresize.handler );
    },
    teardown: function() {
      $(this).unbind( "resize", event.special.smartresize.handler );
    },
    handler: function( event, execAsap ) {
      // Save the context
      var context = this,
          args = arguments;

      // set correct event type
      event.type = "smartresize";

      if (resizeTimeout) { clearTimeout(resizeTimeout); }
      resizeTimeout = setTimeout(function() {
        jQuery.event.handle.apply( context, args );
      }, execAsap === "execAsap"? 0 : 100);
    }
  };

  $.fn.smartresize = function( fn ) {
    return fn ? this.bind( "smartresize", fn ) : this.trigger( "smartresize", ["execAsap"] );
  };



  // masonry code begin
  $.fn.masonry = function(options, callback) { 

    // all my sweet methods
    var msnry = {
      getBricks : function($wall, props, opts) {
        var hasItemSelector = (opts.itemSelector === undefined);
        if ( opts.appendedContent === undefined ) {
          // if not appendedContent
          props.$bricks = hasItemSelector ?
                $wall.children() :
                $wall.find(opts.itemSelector);
        } else {
         //  if appendedContent...
         props.$bricks = hasItemSelector ?
                opts.appendedContent : 
                opts.appendedContent.filter( opts.itemSelector );
        }
      },
      
      placeBrick : function($brick, setCount, setY, props, opts) {
            // get the minimum Y value from the columns...
        var minimumY = Math.min.apply(Math, setY),
            // ...and which column that is
            shortCol = setY.indexOf(minimumY),
            setHeight = minimumY + $brick.outerHeight(true),
            position = {
              left: props.colW * shortCol + props.posLeft,
              top: minimumY
            },
            setSpan = props.colCount + 1 - setY.length;
            
        // position the brick
        $brick.applyStyle(position, $.extend(true,{},opts.animationOptions) );

        // apply setHeight to necessary columns
        for (var i=0; i < setSpan; i++ ) {
          props.colY[ shortCol + i ] = setHeight;
        }
      },
      
      setup : function($wall, opts, props) {
        msnry.getBricks($wall, props, opts);

        if ( props.masoned ) {
          props.previousData = $wall.data('masonry');
        }

        if ( opts.columnWidth === undefined) {
          props.colW = props.masoned ?
              props.previousData.colW :
              props.$bricks.outerWidth(true);
        } else {
          props.colW = opts.columnWidth;
        }

        props.colCount = Math.floor( $wall.width() / props.colW ) ;
        props.colCount = Math.max( props.colCount, 1 );
      },
      
      arrange : function($wall, opts, props) {
        var i;
        // if masonry hasn't been called before
        if ( !props.masoned ) { 
          $wall.css( 'position', 'relative' );

          // get top left position of where the bricks should be
          var cursor = $( document.createElement('div') );
          $wall.prepend( cursor );
          props.posTop =  Math.round( cursor.position().top );
          props.posLeft = Math.round( cursor.position().left );
          cursor.remove();
        } else {
          props.posTop =  props.previousData.posTop;
          props.posLeft = props.previousData.posLeft;
        }
        
        if ( !props.masoned || opts.appendedContent !== undefined ) {
          // just the new bricks
          props.$bricks.css( 'position', 'absolute' );
        }

        // set up column Y array
        if ( props.masoned && opts.appendedContent !== undefined ) {
          // if appendedContent is set, use colY from last call
          props.colY = props.previousData.colY;

          /*
          *  in the case that the wall is not resizeable,
          *  but the colCount has changed from the previous time
          *  masonry has been called
          */
          for ( i = props.previousData.colCount; i < props.colCount; i++) {
            props.colY[i] = props.posTop;
          }

        } else {
          // start new colY array, with starting values set to posTop
          props.colY = [];
          i = props.colCount;
          while (i--) {
            props.colY.push(props.posTop);
          }
        }

        // are we animating the rearrangement?
        // use plugin-ish syntax for css or animate
        $.fn.applyStyle = ( props.masoned && opts.animate ) ? $.fn.animate : $.fn.css;


        // layout logic
        if ( opts.singleMode ) {
          props.$bricks.each(function(){
            var $brick = $(this);
            msnry.placeBrick($brick, props.colCount, props.colY, props, opts);
          });      
        } else {
          props.$bricks.each(function() {
            var $brick = $(this),
                //how many columns does this brick span
                colSpan = Math.ceil( $brick.outerWidth(true) / props.colW);
            colSpan = Math.min( colSpan, props.colCount );

            if ( colSpan === 1 ) {
              // if brick spans only one column, just like singleMode
              msnry.placeBrick($brick, props.colCount, props.colY, props, opts);
            } else {
              // brick spans more than one column

              //how many different places could this brick fit horizontally
              var groupCount = props.colCount + 1 - colSpan,
                  groupY = [];

              // for each group potential horizontal position
              for ( i=0; i < groupCount; i++ ) {
                // make an array of colY values for that one group
                var groupColY = props.colY.slice(i, i+colSpan);
                // and get the max value of the array
                groupY[i] = Math.max.apply(Math, groupColY);
              }

              msnry.placeBrick($brick, groupCount, groupY, props, opts);
            }
          }); //    /props.bricks.each(function() {
        }  //     /layout logic

        // set the height of the wall to the tallest column
        props.wallH = Math.max.apply(Math, props.colY);
        var wallCSS = { height: props.wallH - props.posTop };
        $wall.applyStyle( wallCSS, $.extend(true,[],opts.animationOptions) );

        // add masoned class first time around
        if ( !props.masoned ) { 
          // wait 1 millisec for quell transitions
          setTimeout(function(){
            $wall.addClass('masoned'); 
          }, 1);
        }

        // provide props.bricks as context for the callback
        callback.call( props.$bricks );

        // set all data so we can retrieve it for appended appendedContent
        //    or anyone else's crazy jquery fun
        $wall.data('masonry', props );
        
      }, // /msnry.arrange
      
      resize : function($wall, opts, props) {
        props.masoned = ( $wall.data('masonry') !== null );
        var prevColCount = $wall.data('masonry').colCount;
        msnry.setup($wall, opts, props);
        if ( props.colCount != prevColCount ) {
          msnry.arrange($wall, opts, props);
        }
      }
    };


    /*
    *  let's begin
    *  IN A WORLD...
    */
    return this.each(function() {  

      var $wall = $(this),
          props = {};

      // checks if masonry has been called before on this object
      props.masoned = ( $wall.data('masonry') !== null );
    
      var previousOptions = props.masoned ? $wall.data('masonry').options : {},
          opts =  $.extend(
                    {},
                    $.fn.masonry.defaults,
                    previousOptions,
                    options
                  ),
          resizeOn = previousOptions.resizeable;

      // should we save these options for next time?
      props.options = opts.saveOptions ? opts : previousOptions;

      //picked up from Paul Irish
      callback = callback || function(){};

      msnry.getBricks($wall, props, opts);

      // if brickParent is empty, do nothing, go back home and eat chips
      if ( !props.$bricks.length ) { 
        return this; 
      }

      // call masonry layout
      msnry.setup($wall, opts, props);
      msnry.arrange($wall, opts, props);
    
      // binding window resizing
      if ( !resizeOn && opts.resizeable ) {
        $(window).bind('smartresize.masonry', function() { msnry.resize($wall, opts, props); } );
      }
      if ( resizeOn && !opts.resizeable ) { 
        $(window).unbind('smartresize.masonry'); 
      }
       

    });    //    /return this.each(function()
  };      //    /$.fn.masonry = function(options)


  // Default plugin options
  $.fn.masonry.defaults = {
    singleMode: false,
    columnWidth: undefined,
    itemSelector: undefined,
    appendedContent: undefined,
    saveOptions: true,
    resizeable: true,
    animate: false,
    animationOptions: {}
  };

})(jQuery);