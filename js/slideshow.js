//-=-=-=-=-=-SLIDESHOW-=-=-=-=-=-=-
var closure = testClosure();
// Array that store Ids of all active intervals.
// Initialy created for 3 possible slideshows on the page.
  var intervals = [[],[],[]];
// =====================================
// ===========MAIN FUNCTION=============
function testClosure() {
// Identifies element which listener got activated
  var invoker;
// Index of slideshow
  var index;
// Element of image class. Equal in size to slide picture
// and used to position buttons in the middle of slide height.
  var image;
// Slides wrapper
  var frame;
// Left button
  var leftButton;
// Right button
  var rightButton;
// Dot menu
  var dotMenu;
// Element that can occlude dotMenu disabling
// it temporarily
  var blockMenu;
// Array of slides
  var slides;
// Width of single slide relative to Frame width
  var slideWidth;
// Number of slides fitting on the screen
  var inView;
// Left slide
  var leftSlide;
// Index of element in slides[] belonging
// to the leftSlide
  var leftSlideIndex;
// Right slide
  var rightSlide;
// Index of element in slides[] belonging
// to the rightSlide
  var rightSlideIndex;
// Array of cloned slides
  var clones = [];
// ==================================
function getLeft() {
  // Get left slide (visible, left-most slide)
  for (var i = 0; i < slides.length; i++) {
    if (slides[i].style.order == 0) {
      leftSlide = slides[i];
      leftSlideIndex = i;
      return;
    }
  }
}
// ==================================
function getRight() {
  // Get right slide (unvisible, right-most slide)
  var A = slides.length, B = clones.length;
  for (var i = 0; i < slides.length; i++) {
    if (slides[i].style.order == (A - 1 - B) ) {
      rightSlide = slides[i];
      rightSlideIndex = i;
      return;
    }
  }
}
// ==================================
function frameToLeft() {
  // Move flexbox frame left
  var framePos = parseFloat(frame.style.left);
  frame.style.left = framePos - slideWidth + 'px';
}
// ==================================
function frameToRight() {
  // Move flexbox frame right
  var framePos = parseFloat(frame.style.left);
  frame.style.left = framePos + slideWidth + 'px';
}
// ==================================
function allOrder1Down() {
  // Degrade order of all slides by 1
  for (var i = 0; i < slides.length; i++) {
    order = parseInt(slides[i].style.order);
    order -= 1;
    slides[i].style.order = order;
  }
}
// ==================================
function allOrder1Up() {
  // Bump order of all slides by 1
  var order;
  for (var i = 0; i < slides.length; i++) {
    order = parseInt(slides[i].style.order);
    order += 1;
    slides[i].style.order = order;
  }
}
// ==================================
function leftOrderMax() {
  // Bump order of left slide by slides number
  var order = parseInt(leftSlide.style.order);
  order += slides.length - clones.length;
  leftSlide.style.order = order;
}
// ==================================
function rightOrderMin() {
  // Degrade order of right slide by slides number
  var order = parseInt(rightSlide.style.order);
  order -= slides.length - clones.length;
  rightSlide.style.order = order;
}
// ==================================
function addClones(range) {
  if ((slides.length - range) < inView) {
    // copy adequate number of slides starting from
    // the first (as they appear in DOM) and append
    // them to the flexbox with high order value.
    var slidesToCopy = (inView - (slides.length - range));
    for (var i = 0; i < slidesToCopy; i++) {
      clones[i] = slides[i].cloneNode(true);
      clones[i].style.order = 1000;
      frame.appendChild(clones[i]);
    }
  }
}
// ==================================
function removeClones() {
  // Remove all cloned slides
  for (var i = 0; i < clones.length; i++) {
    frame.removeChild(clones[i]);
  }
  clones.splice(0, clones.length);
}
// ==================================
function goLeft(invoker, range) {
  // Move by 1 to left
  suspendShow();
  disableButtons();
  disableSlideMouseEvent();
  var dir = -1;
  if (!range) range = 1;
  lightDot(range, dir);
  frame.style.transition = 'left 0s';
  for (var i = 0; i < range; i++) {
    frameToLeft();
    getRight();
    allOrder1Up();
    rightOrderMin();
  }
  addClones(range);
  setTimeout(function(){
    frame.style.transition = 'left 0.6s';
    for (var i = 0; i < range; i++) {
      frameToRight(); //anim
    }
  },0)
  setTimeout( function(){
    enableButtons();
    slideMouseEvent();
    removeClones();
    autoShow();
  },600)
}
// ==================================
function goRight(invoker, range) {
  // Move by 1 to right
  suspendShow();
  disableButtons();
  disableSlideMouseEvent();
  var dir = 1;
  if (!range) range = 1;
  lightDot(range, dir);
  addClones(range);
  frame.style.transition = 'left 0.6s';
  for (var i = 0; i < range; i++) {
    frameToLeft(); //anim
  }
  setTimeout(function(){
    frame.style.transition = 'left 0s';
    for (var i = 0; i < range; i++) {
      getLeft();
      frameToRight();
      allOrder1Down();
      leftOrderMax();
    }
    removeClones();
    enableButtons();
    slideMouseEvent();
    autoShow();
  }, 600)
}
// ==================================
// Desactivates current leftSlide menu-dot
// and activates another depending on direction
// and range of movement
function lightDot(range, dir) {
  getLeft();
  getRight();
  dotMenu[leftSlideIndex].classList.toggle('active');
  // First slide element & move to left
  if (leftSlideIndex == 0 && dir<0) {
    dotMenu[rightSlideIndex - range + 1].classList.toggle('active');
  }
  // Last slide element & move to right
  else if (leftSlideIndex == rightSlide.style.order && dir>0) {
    dotMenu[range - 1].classList.toggle('active');
  }
  else {
    dotMenu[leftSlideIndex + dir*range].classList.toggle('active');
  }
}
// ==================================
function disableButtons() {
  // Disable event handlers
  leftButton.removeEventListener('click', closure.goLeft);
  rightButton.removeEventListener('click', closure.goRight );
  blockMenu.style.zIndex = '1';
}
// ==================================
function enableButtons() {
  // Enable event handlers
  leftButton.addEventListener('click', closure.goLeft);
  rightButton.addEventListener('click', closure.goRight);
  blockMenu.style.zIndex = '-1';
}
// ====================================
function autoShow(duration) {
  // Create new interval and store its id in array
  var cycleTime = 4;  //interval in
  var interId; //interval Id
  if (intervals[index].length == 0) {
    if (!Number(duration)) duration = 0;
    interId = setInterval (goRight, (cycleTime*1000 + duration*1000));
    intervals[index].push(interId);
  }
}
// ================================================
function suspendShow() {
  // Stop all intervals and clear array
  for (var i = 0; i < intervals[index].length; i++) {
    clearInterval(intervals[index][i]);
  }
  intervals[index].splice(0,intervals[index].length);
}
// ================================================
function goSlide() {
  // get data-slide attribute value from invoker
  // and run function for left or right movement
  // var goToSlideIndex = this.dataset.slide;
  var goToSlideIndex = invoker.dataset.slide;
  getLeft();
  var diff = goToSlideIndex - leftSlideIndex;
  if (diff < 0) goLeft("", -diff)
  else if(diff > 0) goRight("", diff)
}
// ==================================
function setOrder() {
  // Set slides order (used on page load)
  for (var i = 0; i < slides.length; i++) {
    slides[i].style.order = i;
  }
}
// ================================================
function enableDotMenu() {
  // Add event listeners to dot menu elements
  for (var i = 0; i < dotMenu.length; i++) {
    dotMenu[i].addEventListener('click', closure.goSlide);
  }
}
// ================================================
function positionButtons() {
  // Modify buttons vertical position based on their size
  // and slides height so they always appear in the middle
  var buttonHeight = leftButton.offsetHeight;
  var imageHeight = image.offsetHeight;
  leftButton.style.top = (imageHeight - buttonHeight) * 0.5 + 'px';
  rightButton.style.top = (imageHeight - buttonHeight) * 0.5 + 'px';
}
// ================================================
function slideMouseEvent() {
  // suspend slideshow when user hover ofer the slide
  // and restart when mouse leaves slides
    frame.addEventListener('mouseenter', closure.suspendShow);
    frame.addEventListener('mouseleave', closure.autoShow);
}
// ================================================
function disableSlideMouseEvent() {
    frame.removeEventListener('mouseenter', closure.suspendShow);
    frame.removeEventListener('mouseleave', closure.autoShow);
}
// ================================================
function prepare() {
  // Acts on all slideshows on the page
  var slideshows = document.querySelectorAll('.slideshowWrapper');
  for (var i = 0; i < slideshows.length; i++) {
    if (invoker === window){
      leftButton = slideshows[i].querySelector('.left.button');
      rightButton = slideshows[i].querySelector('.right.button');
      image = slideshows[i].querySelector('.image');
      positionButtons();
      slides = slideshows[i].querySelectorAll('.slideWrap');
      setOrder();
      dotMenu = slideshows[i].querySelectorAll('.slideshow.menu span');
      enableDotMenu();
      frame = slideshows[i].children[0];
      slideMouseEvent();
      blockMenu = slideshows[i].querySelector('.menuBlock .shield');
      enableButtons();
    }
    else {
      leftButton = slideshows[i].querySelector('.left.button');
      rightButton = slideshows[i].querySelector('.right.button');
      image = slideshows[i].querySelector('.image');
      positionButtons();
      break;
    }
  }
}
// ================================================
function variables() {
  // function sets values of semi-global variables
  // based on invoker value
  index = invoker.dataset.slideshow_index;
  var query = '[data-slideshow_index="' + index+'"]';
  frame = document.querySelector(query);
          frame.style.left = '0px';
  leftButton = document.querySelector(query + '.left.button');
  rightButton = document.querySelector(query + '.right.button');
  dotMenu = document.querySelectorAll(query + '.menu span');
  blockMenu = document.querySelector(query + '.menuBlock .shield');
  slides = frame.children;
  slideWidth = Math.round(slides[0].offsetWidth);
  inView = Math.round(window.innerWidth/slideWidth);
}
// ================================================
return {
  prepare: function() {
    invoker = this;
    prepare();
  },
  position: function() {
    invoker = '';
    prepare();
  },
  goRight: function() {
    invoker = this;
    variables();
    goRight();
  },
  goLeft: function() {
    invoker = this;
    variables();
    goLeft();
  },
  goSlide: function() {
    invoker = this;
    variables();
    goSlide();
  },
  autoShow: function() {
    invoker = this;
    variables();
    autoShow();
  },
  autoShowOnLoad: function() {
    var slideshows = document.getElementsByClassName('slidesFrame');
    for (var i = 0; i < slideshows.length; i++) {
      invoker = slideshows[i];
      variables();
      autoShow();
    }
  },
  suspendShow: function() {
    invoker = this;
    variables();
    suspendShow();
  }
}
}
