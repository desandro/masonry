/*
// jQuery  Masonry plug in
// copyright David DeSandro, licensed GPL & MIT
// version 0.8.2
// http://desandro.com/resources/jquery-masonry
*/
;(function($){  

	$.fn.masonry = function(options) { 
	
		var defaults = {
			mode: 'multi',
			columnWidth: null,
			itemSelector: null,
			newContent: null
		};
		
		var opts =  $.extend(defaults, options);  
		
		return this.each(function() {  

			var wall = $(this);

			// checks if masonry has been called before on this object
			var masoned = wall.data('masonry') != undefined;

			
			if(  masoned == false ) { 
				// if masonry hasn't been called before
				wall.css({ position: 'relative' });
			//	console.log('masoned false');
			} else {
			//	console.log('masoned true');
			}

			
			if ( masoned == true && opts.newContent != null ) {
				// if we're just dealing with new Content
				var bricks = opts.newContent.find(opts.itemSelector);
			} else {
				var bricks = opts.itemSelector == null ?
							wall.children() :
							wall.find(opts.itemSelector);
			}
			


			
			if ( masoned == false || opts.newContent != null ) {
				// just the new bricks
				bricks.css({ position: 'absolute' });
			}
			
			

			// get top left position of where the wrap should be
			var cursor = $('<div class="masonry_cursor" />');
			wall.prepend( cursor );
			var posTop =  Math.round( cursor.position().top );
			var posLeft = Math.round( cursor.position().left );
			cursor.remove();

			var colW = opts.columnWidth == null ? 
						bricks.outerWidth(true) : 
						opts.columnWidth;
			
			var colCount = Math.floor( wall.width() / colW ) ;
			colCount = Math.max( colCount, 1 );
			
			if ( opts.newContent != null && masoned == true ) {
				var colY = wall.data('masonry').colY;
			} else {
				var colY = [0];
				for ( i=0; i < colCount; i++) {
					colY[i] =  posTop ;
				}	
			}

			function placeBrick(brick, setCount, setY, setSpan) {
				var shortCol = 0;
				
				for ( i=0; i < setCount; i++ ) {
					if ( setY[i] < setY[ shortCol ] ) shortCol = i;
				}

				brick.css({
					top: setY[ shortCol ],
					left: colW * shortCol + posLeft
				});

				for ( i=0; i < setSpan; i++ ) {
					colY[ shortCol + i ] = setY[ shortCol ] + brick.outerHeight(true) ;						
				}
			}


			if ( opts.mode == 'single' ) {
				bricks.each(function(){
					var brick = $(this);
					placeBrick(brick, colCount, colY, 1);
				});			

			} else if ( opts.mode == 'multi' ) {

				bricks.each(function() {
				
					var brick = $(this);
				
					//how many columns does this brick span
					var colSpan = Math.ceil( brick.outerWidth(true) / colW);
					colSpan = Math.min( colSpan, colCount );

					if ( colSpan == 1 ) {
						// if brick spans only one column
						placeBrick(brick, colCount, colY, 1);

					} else {
						// brick spans more than one column
				
						//how many different places could this brick fit horizontally
						var groupCount = colCount + 1 - colSpan; 
						var groupY = [0];
						// for each group potential horizontal position
						for ( i=0; i < groupCount; i++ ) {
							groupY[i] = 0;
							// for each column in that group
							for ( j=0; j < colSpan; j++ ) {
								//group height = height of the maximum column height in that group
								groupY[i] = Math.max( groupY[i], colY[i+j] );
							}
						}
				
						placeBrick(brick, groupCount, groupY, colSpan);

					}
				});
			
			}
		
			// set the height of the wall to the tallest column
			var wallH = 0;
			for ( i=0; i < colCount; i++ ) {
				wallH = Math.max( wallH, colY[i] );
			}
			wall.height( wallH - posTop );

			// set some data so we can retrieve it for appended newContent
			wall.data('masonry', {
				masoned: true,
				colY: colY
			});
		
		});  // close up return this.each(function()
	};   // close up $.fn.masonry = function(options)


})(jQuery);  
