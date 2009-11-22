/*
Title:         jQuery.gridLayout (AKA "Swiss Machine")
Description:Lays out targeted elements in a grid, starting top left and moving right then down a row.
            Layout repeated on window resize.
Developer:    Phase Change Logistics (http://phase-change.org)
Date:        February 2009 (From an initial concept ~2006)
Version:     1.0.0

Usage:        $(<target>).gridLayout('<elements>' [,{col_width (px), min_cols}]) // '<elements>' = jquery selection string
            $(<target>).gridLayout.placeAtEnd(<element>) // puts <element> at end of block sequence
            "gridchange" event fires when window resize forces redraw
            $(<target>).gridLayout.info() // returns an info object with column heights

Notes:        Tries to fill space towards top of screen (so block layout will not always be strictly sequential).
            Any block content (images / objects) <u>must</u> have width & height values set at time of layout.
            View source for more notes
        
To Do:        Option for forcing strict sequence.
License:    Dual licensed under the MIT and GPL licenses:
            http://www.opensource.org/licenses/mit-license.php,
            http://www.gnu.org/licenses/gpl.html
*/

(function($) {
    
    var data = [], // array of items widths
        content = [], // elements ready to be attached to DOM
        opts, // defaults
        cols, // array of col heights
        num_cols, // number of colums available to layout
        that; // instance
    
    $.fn.gridLayout = function(selector, options)
    {
        that = this;
        opts = $.extend(this.gridLayout.defaults, options);
        
        $(selector).each(function(i){
            var w = Math.ceil( $(this).width() / opts.col_width );
            
            data.push( {width:w} );
            content.push( $(this).remove() );
        });
        
        onResize();
        
        $(window).resize(function(e){ onResize() } ); // catch resize event    
    };
    
    onResize = function()
    {
        var new_num_cols = Math.max(
            Math.floor( that.width() / opts.col_width ),
            opts.min_cols
        );
        
        if(num_cols != new_num_cols){
            num_cols = new_num_cols;
            layout();
            that.trigger("gridchange"); // trigger a change event 
        }
    };
    
    layout = function()
    {
        cols = [];
        
        var i=0;
        while( i < num_cols ){
            cols.push( {x:i++, y:0} );
        }
        
        for(i=0; i<data.length; i++) // place in position
        {
            var o = data[i]; // the object
            
            cols.sort(ySort); // find shortest col
            
            if(o.width==1) // easy - add to shortest col & set new height
            {
                cols[0].y += attachItem(i,
                    cols[0].x*(opts.col_width),
                    cols[0].y
                ).outerHeight(true);
            }
            else placeWide(o, i); // harder, see below
        }
        
    };
    
    placeWide = function(o, id) // place an item that spans 2+ columns
    {
        cols.sort(xSort); // set cols in normal L-R order
        
        var i, j,
            last_col = num_cols - o.width + 1, // last possible col due to item width
            max_y, spanned_y,
            possible_places = [];
        
        for(i=0; i<last_col; i++) // for each possible col ...
        {
            max_y = 0;
            for(j=0; j<o.width; j++) // find the max y of the cols that item will span
            {
                spanned_y = cols[i+j].y;
                max_y = Math.max(spanned_y,max_y);
            }
            possible_places.push( {x:cols[i].x, y:max_y} );
        }
        
        possible_places.sort(ySort); // find the shortest possible place
        
        var place = possible_places[0],
            new_item = attachItem(id,
                place.x * opts.col_width,
                place.y
        );
        
        for(i=place.x; i<place.x+o.width; i++) // set each spanned col to new height
        {
            cols[i].y = place.y + new_item.outerHeight(true);
        }
    };
    
    attachItem = function( id, x, y )
    {
        return content[id].css({position : "absolute", left : x+"px", top : y+"px"}).appendTo(that);
    };
    
    xSort = function(a,b) // sort columns from left to right
    {
        return(a.x-b.x);
    };
    
    ySort = function (a,b) // sort by column height (ascending)
    {
        if(a.y==b.y) return(a.x-b.x);
        else return(a.y-b.y);
    };
    
    // misc functions
    $.fn.gridLayout.placeAtEnd = function(e) // place an element at bottom of page
    {
        cols.sort(ySort);
        var x = (num_cols-1) * opts.col_width, // final column
            y = cols[cols.length-1].y; // tallest column
        
        e.remove().css( {position:"absolute", top:y+"px", left:x+"px"} ).appendTo(that);
    };
    
    
    // force refresh
    $.fn.gridLayout.refresh = function()
    {
        layout();
    }
    
    // returns array of objects representing columns
    $.fn.gridLayout.info = function()
    {
        cols.sort(xSort);
        return cols;
    }
    
})(jQuery);

// defaults
jQuery.fn.gridLayout.defaults = {
    // the minimum number of cols on the page (reducing browser width below this will not decrease number of columns). Set to your largest block (3 = block spans 3 columns)
    min_cols: 3,
    // the width of each grid block
    col_width: 250
};

