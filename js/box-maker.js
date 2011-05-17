/*
 *  This is just a utitlity script so we can 
 *  add random content to masonry-ed layouts
 */

var boxMaker = {};

boxMaker.lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eu interdum odio. Cras lobortis mauris vitae tellus consectetur sit amet cursus ipsum vestibulum. Duis facilisis sodales tristique. Vivamus aliquet, est a rhoncus dapibus, velit tortor tempor turpis, a pharetra diam lacus a metus. Donec gravida faucibus magna, nec laoreet nibh placerat et. Cras magna lorem, faucibus vitae rhoncus ac, tincidunt vel velit. Mauris aliquam, risus vel sodales laoreet, mi nulla faucibus nunc, eu tincidunt nisi leo sed orci. Curabitur sagittis libero eu augue luctus ullamcorper. Phasellus sed tortor sed nunc elementum rutrum. Maecenas eu enim a nulla faucibus commodo iaculis tempor orci. Integer at ligula id mauris semper bibendum at eu erat. Integer vestibulum sem nec risus iaculis eu rhoncus tellus tempor. Suspendisse potenti. Sed bibendum nibh non velit blandit eu adipiscing ligula consectetur. Vivamus turpis quam, fringilla a elementum a, condimentum non purus. Pellentesque sed bibendum ante. Fusce elit mauris, pulvinar sed rutrum eget, malesuada in nisi. Etiam sagittis pretium ligula. Aliquam a metus orci, a molestie lacus. Suspendisse potenti. Mauris vel volutpat nunc. In condimentum imperdiet scelerisque. Cras aliquam tristique velit non iaculis. Aliquam pulvinar sagittis sodales. Aenean risus orci, elementum quis accumsan eget, elementum cursus tellus. Nunc vel laoreet odio. Maecenas sollicitudin, tellus vel bibendum ornare, tellus nibh hendrerit lorem, quis volutpat turpis odio ac ligula. Etiam tempus neque id libero feugiat fringilla. Nullam posuere consequat vehicula. Mauris in lorem eget sem tempor condimentum. Integer rhoncus accumsan elit eu gravida. Donec dictum ante ac nisl adipiscing vel tempor libero luctus. Praesent bibendum augue at erat semper rutrum. Fusce vel orci nulla. Vivamus condimentum, odio vel condimentum tempus, mauris ipsum gravida odio, sed viverra dolor velit sit amet magna. Donec aliquam malesuada ipsum ut suscipit. Vivamus porttitor posuere iaculis. Vestibulum lectus lorem, tincidunt at sodales et, euismod vel quam. Sed eget urna nunc. In quis felis nunc. Aliquam erat volutpat. Cras ut dui ac leo aliquet placerat faucibus in nulla. Mauris pharetra ligula et tortor ultricies eget elementum libero blandit. Praesent tincidunt, mi quis aliquam faucibus, leo risus placerat odio, ac adipiscing ante urna at tortor.'.split(".");

boxMaker.loremLen = boxMaker.lorem.length;
  
boxMaker.randoLoremText = function() {
  var loremText = '',
      sentences = Math.random() * 5;
  for (var j=0; j < sentences; j++ ) {
    var whichSentence = Math.floor( Math.random() * boxMaker.loremLen );
    loremText += boxMaker.lorem[whichSentence] + '. ';
  }
  return loremText;
};

boxMaker.makeBoxes = function() {
  var boxes = [],
      count = Math.random()*4;

  for (var i=0; i < count; i++ ) {
    var box = document.createElement('div'),
        text = document.createTextNode( boxMaker.randoLoremText() );
    
    box.className = 'box col' +  Math.ceil( Math.random()*3 );
    box.appendChild( text );
    // add box DOM node to array of new elements
    boxes.push( box );
  }

  return boxes;
};

