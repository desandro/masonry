/*************************************************
**  jQuery Masonry plug in
**  copyright David DeSandro, licensed GPL & MIT
**  version 0.8.6
**  http://desandro.com/resources/jquery-masonry
**************************************************/
;(function($){  


	$.fn.masonry = function(options, callback) { 

	    // console log wrapper.
	    function debug(){
	    	window.console && console.log.call(console,arguments);
	    }
	
		function placeBrick(brick, setCount, setY, setSpan, props) {
			var shortCol = 0;
			
			for ( i=0; i < setCount; i++ ) {
				if ( setY[i] < setY[ shortCol ] ) shortCol = i;
			}

			brick.css({
				top: setY[ shortCol ],
				left: props.colW * shortCol + props.posLeft
			});

			for ( i=0; i < setSpan; i++ ) {
				props.colY[ shortCol + i ] = setY[ shortCol ] + brick.outerHeight(true) ;
			}
		}


		function masonrySetup(wall, opts, props) {
			if ( props.masoned && opts.newContent != undefined ) {
				// if we're just dealing with new Content
				props.bricks = opts.newContent.find(opts.itemSelector);
			} else {
				props.bricks = opts.itemSelector == undefined ?
							wall.children() :
							wall.find(opts.itemSelector);
			}

			props.colW = opts.columnWidth == undefined ? 
						props.bricks.outerWidth(true) : 
						opts.columnWidth;
			
			props.colCount = Math.floor( wall.width() / props.colW ) ;
			props.colCount = Math.max( props.colCount, 1 );
			
		}

		function masonryArrange(wall, opts, props) {
			
			// if masonry hasn't been called before
			if( !props.masoned ) wall.css({ position: 'relative' });			
			
			if ( !props.masoned || opts.newContent != undefined ) {
				// just the new bricks
				props.bricks.css({ position: 'absolute' });
			}
			

			// get top left position of where the bricks should be
			var cursor = $('<div />');
			wall.prepend( cursor );
			props.posTop =  Math.round( cursor.position().top );
			props.posLeft = Math.round( cursor.position().left );
			cursor.remove();

			
			if ( props.masoned && opts.newContent != undefined ) {
				props.colY = wall.data('masonry').colY;
			} else {
				for ( i=0; i < props.colCount; i++) {
					props.colY[i] = props.posTop ;
				}	
			}

			// layout logic
			if ( opts.singleMode ) {
				props.bricks.each(function(){
					var brick = $(this);
					placeBrick(brick, props.colCount, props.colY, 1, props);
				});			

			} else {
				props.bricks.each(function() {
					var brick = $(this);
				
					//how many columns does this brick span
					var colSpan = Math.ceil( brick.outerWidth(true) / props.colW);
					colSpan = Math.min( colSpan, props.colCount );

					if ( colSpan == 1 ) {
						// if brick spans only one column
						placeBrick(brick, props.colCount, props.colY, 1, props);

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
				
						placeBrick(brick, groupCount, groupY, colSpan, props);
					}
				}); //		/props.bricks.each(function() {
			}  //	 	/layout logic
		
			// set the height of the wall to the tallest column
			props.wallH = 0;
			for ( i=0; i < props.colCount; i++ ) {
				props.wallH = Math.max( props.wallH, props.colY[i] );
			}
			wall.height( props.wallH - props.posTop );

			// provide props.bricks as context for the callback
			callback.call( props.bricks );
			
			// set all data so we can retrieve it for appended newContent
			//		or anyone else's crazy jquery fun
			wall.data('masonry', props );


		} //  /masonryArrange function


		function masonryResize(wall, opts, props) {
			var prevColCount = wall.data('masonry').colCount;
			masonrySetup(wall, opts, props);
			if ( props.colCount != prevColCount ) masonryArrange(wall, opts, props); 
		}


		// let's begin
		// IN A WORLD...

		return this.each(function() {  

			var wall = $(this);

			var props = $.extend( {}, $.masonry );

			// checks if masonry has been called before on this object
			props.masoned = wall.data('masonry') != undefined;
		
			var previousOptions = props.masoned ? wall.data('masonry').options : {};

			var rszOn = props.masoned ? wall.data('masonry').resizeOn : false;
			
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
			
			// call masonry layout
			masonrySetup(wall, opts, props);
			masonryArrange(wall, opts, props);
			
			// binding window resizing
			if ( !rszOn && opts.resizeable ) {
				$(window).bind('resize.masonry', function() { masonryResize(wall, opts, props); } );
			}
			if ( rszOn && !opts.resizeable ) $(window).unbind('resize.masonry');
			props.resizeOn = opts.resizeable;

		});		//		/return this.each(function()
	};			//		/$.fn.masonry = function(options)



	$.masonry = {
		defaults : {
					singleMode: false,
					columnWidth: undefined,
					itemSelector: undefined,
					newContent: undefined,
					saveOptions: true,
					resizeable: true
				}
		,
		colW: undefined,
		colCount: 1,
		colY: [],
		wallH: 0,
		masoned: undefined,
		posTop: 0,
		posLeft: 0,
		options: undefined,
		bricks: undefined,
		resizeOn: undefined
	};



})(jQuery);  
