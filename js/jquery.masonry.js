/*************************************************
**  jQuery Masonry version 1.0.1
**  copyright David DeSandro, licensed GPL & MIT
**  http://desandro.com/resources/jquery-masonry
**************************************************/
;(function($){  

    $.fn.masonry = function(options, callback) { 

        function placeBrick($brick, setCount, setY, setSpan, props) {
            var shortCol = 0;
            
            for ( i=0; i < setCount; i++ ) {
                if ( setY[i] < setY[ shortCol ] ) shortCol = i;
            }

            $brick.css({
                top: setY[ shortCol ],
                left: props.colW * shortCol + props.posLeft
            });

            for ( i=0; i < setSpan; i++ ) {
                props.colY[ shortCol + i ] = setY[ shortCol ] + $brick.outerHeight(true) ;
            }
        }


        function masonrySetup($wall, opts, props) {
            props.$bricks = opts.itemSelector == undefined ?
                        opts.$brickParent.children() :
                        opts.$brickParent.find(opts.itemSelector);

            if ( opts.columnWidth == undefined) {
                props.colW = props.masoned ?
                        $wall.data('masonry').colW :
                        props.$bricks.outerWidth(true);
            } else {
                props.colW = opts.columnWidth;
            }

            props.colCount = Math.floor( $wall.width() / props.colW ) ;
            props.colCount = Math.max( props.colCount, 1 );
        }


        function masonryArrange($wall, opts, props) {
            // if masonry hasn't been called before
            if( !props.masoned ) $wall.css( 'position', 'relative' );            
            
            if ( !props.masoned || opts.appendedContent != undefined ) {
                // just the new bricks
                props.$bricks.css( 'position', 'absolute' );
            }

            // get top left position of where the bricks should be
            var cursor = $('<div />');
            $wall.prepend( cursor );
            props.posTop =  Math.round( cursor.position().top );
            props.posLeft = Math.round( cursor.position().left );
            cursor.remove();

            // set up column Y array
            if ( props.masoned && opts.appendedContent != undefined ) {
                // if appendedContent is set, use colY from last call
                props.colY = $wall.data('masonry').colY;
                
                /*
                *  in the case that the wall is not resizeable,
                *  but the colCount has changed from the previous time
                *  masonry has been called
                */
                for (i= $wall.data('masonry').colCount; i < props.colCount; i++) {
                    props.colY[i] = props.posTop;
                };
                
            } else {
                props.colY = [];
                for ( i=0; i < props.colCount; i++) {
                    props.colY[i] = props.posTop;
                }    
            }

            // layout logic
            if ( opts.singleMode ) {
                props.$bricks.each(function(){
                    var $brick = $(this);
                    placeBrick($brick, props.colCount, props.colY, 1, props);
                });            
            } else {
                props.$bricks.each(function() {
                    var $brick = $(this);
                
                    //how many columns does this brick span
                    var colSpan = Math.ceil( $brick.outerWidth(true) / props.colW);
                    colSpan = Math.min( colSpan, props.colCount );

                    if ( colSpan == 1 ) {
                        // if brick spans only one column, just like singleMode
                        placeBrick($brick, props.colCount, props.colY, 1, props);
                    } else {
                        // brick spans more than one column

                        //how many different places could this brick fit horizontally
                        var groupCount = props.colCount + 1 - colSpan; 
                        var groupY = [0];
                        // for each group potential horizontal position
                        for ( i=0; i < groupCount; i++ ) {
                            groupY[i] = 0;
                            // for each column in that group
                            for ( j=0; j < colSpan; j++ ) {
                                // get the maximum column height in that group
                                groupY[i] = Math.max( groupY[i], props.colY[i+j] );
                            }
                        }
                
                        placeBrick($brick, groupCount, groupY, colSpan, props);
                    }
                }); //        /props.bricks.each(function() {
            }  //         /layout logic
        
            // set the height of the wall to the tallest column
            props.wallH = 0;
            for ( i=0; i < props.colCount; i++ ) {
                props.wallH = Math.max( props.wallH, props.colY[i] );
            }
            $wall.height( props.wallH - props.posTop );

            // provide props.bricks as context for the callback
            callback.call( props.$bricks );
            
            // set all data so we can retrieve it for appended appendedContent
            //        or anyone else's crazy jquery fun
            $wall.data('masonry', props );


        } //  /masonryArrange function


        function masonryResize($wall, opts, props) {
            var prevColCount = $wall.data('masonry').colCount;
            masonrySetup($wall, opts, props);
            if ( props.colCount != prevColCount ) masonryArrange($wall, opts, props); 
        }


        /*
        *  let's begin
        *  IN A WORLD...
        */
        return this.each(function() {  

            var $wall = $(this);

            var props = $.extend( {}, $.masonry );

            // checks if masonry has been called before on this object
            props.masoned = $wall.data('masonry') != undefined;
        
            var previousOptions = props.masoned ? $wall.data('masonry').options : {};

            var opts =  $.extend(
                            {},
                            props.defaults,
                            previousOptions,
                            options
                        );  

            // should we save these options for next time?
            props.options = opts.saveOptions ? opts : previousOptions;

            //picked up from Paul Irish
            callback = callback || function(){};

            if ( props.masoned && opts.appendedContent != undefined ) {
                // if we're dealing with appendedContent
                opts.$brickParent = opts.appendedContent;
            } else {
                opts.$brickParent = $wall;
            }
            
            if ( opts.$brickParent.children().length > 0  ) {
                // call masonry layout
                masonrySetup($wall, opts, props);
                masonryArrange($wall, opts, props);
            
                // binding window resizing
                var resizeOn = previousOptions.resizeable;
                if ( !resizeOn && opts.resizeable ) {
                    $(window).bind('resize.masonry', function() { masonryResize($wall, opts, props); } );
                }
                if ( resizeOn && !opts.resizeable ) $(window).unbind('resize.masonry');
            } else {
                // brickParent is empty, do nothing, go back home and eat chips
                return this;
            }

        });        //        /return this.each(function()
    };            //        /$.fn.masonry = function(options)



    $.masonry = {
        defaults : {
            singleMode: false,
            columnWidth: undefined,
            itemSelector: undefined,
            appendedContent: undefined,
            saveOptions: true,
            resizeable: true
        },
        colW: undefined,
        colCount: undefined,
        colY: undefined,
        wallH: undefined,
        masoned: undefined,
        posTop: 0,
        posLeft: 0,
        options: undefined,
        $bricks: undefined,
        $brickParent: undefined
    };

})(jQuery);  
