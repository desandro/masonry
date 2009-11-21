/*
// jQuery  Masonry plug in
// copyright David DeSandro, licensed GPL & MIT
// version 0.8.4
// http://desandro.com/resources/jquery-masonry
*/
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


		function masonrySetup(wall, props) {
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
			
			
			props.wallW = wall.width();
			
		}


		function masonryArrange(wall, props) {
		//	debug('masonryArrange Begin');






			//everything from here on out should be in a separate function




			// if masonry hasn't been called before
			if( !props.masoned ) wall.css({ position: 'relative' });			
			
			if ( !props.masoned || opts.newContent != undefined ) {
				// just the new props.bricks
				props.bricks.css({ position: 'absolute' });
			}
			

			// get top left position of where the wrap should be
			var cursor = $('<div />');
			wall.prepend( cursor );
			props.posTop =  Math.round( cursor.position().top );
			props.posLeft = Math.round( cursor.position().left );
			cursor.remove();


			
			if ( props.masoned && opts.newContent != undefined ) {
				props.colY = wall.data('masonry').colY;
			} else {
				props.colY = [0];
				for ( i=0; i < props.colCount; i++) {
					props.colY[i] = props.posTop ;
				}	
			}


			if ( opts.mode == 'single' ) {
				props.bricks.each(function(){
					var brick = $(this);
					placeBrick(brick, colCount, colY, 1);
				});			

			} else if ( opts.mode == 'multi' ) {

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
								//group height = height of the maximum column height in that group
								groupY[i] = Math.max( groupY[i], props.colY[i+j] );
							}
						}
				
						placeBrick(brick, groupCount, groupY, colSpan, props);

					}
				});
			
			}  // /math part, if single or multi
		
			// set the height of the wall to the tallest column
			props.wallH = 0;
			for ( i=0; i < props.colCount; i++ ) {
				props.wallH = Math.max( props.wallH, props.colY[i] );
			}
			wall.height( props.wallH - props.posTop );

			// provide props.bricks as context for the callback
			callback.call( props.bricks );
			
			
			// set some data so we can retrieve it for appended newContent
			wall.data('masonry', props );

		//	debug()

		} //  /masonryArrange function


		// IN A WORLD...

		var props = $.masonry;

		// checks if masonry has been called before on this object
		props.masoned = this.data('masonry') != undefined;
		
		var previousOptions = props.masoned ? this.data('masonry').options : {};

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
		
		return this.each(function() {  

			var wall = $(this);


			
			masonrySetup(wall, props);
			masonryArrange(wall, props);
			

			if ( !props.masoned && opts.fluid ) {
				$(window).bind('resize',function(){
					var prevColCount = wall.data('masonry').colCount;
					masonrySetup(wall, props);
					if ( props.colCount != prevColCount )  {
						masonryArrange(wall, props);
						debug('resize', 'MASONRY' , 'props.colCount:' + props.colCount + ', prevColCount:' + prevColCount  );
					} else {
						debug('resize', 'no masonry' , 'props.colCount:' + props.colCount + ', prevColCount:' + prevColCount  );
					}
					
				});
			}
			
	//		return this;
		
		});		//		/return this.each(function()
	};			//		/$.fn.masonry = function(options)



	$.masonry = {
		defaults : {
						mode: 'multi',
						columnWidth: undefined,
						itemSelector: undefined,
						newContent: undefined,
						saveOptions: true,
						fluid: true
					}
		,
		colW: undefined,
		colCount: undefined,
		colY: undefined,
		wallH: undefined,
		masoned: undefined,
		posTop: undefined,
		posLeft: undefined,
		options: undefined,
		bricks: undefined,
		wallW: undefined
	};



})(jQuery);  
