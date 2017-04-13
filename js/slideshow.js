//-=-=-=-=-=-SLIDESHOW-=-=-=-=-=-=-
// Slides wrapper
  var frame = document.getElementById('slideshowOne');
  frame.style.left = '0px';
// Value of property 'left' of frame
  var framePos; //aka frame position
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
// Left button
  var leftButton = document.getElementById('slideshowOneLeft');
// Right button
  var rightButton = document.getElementById('slideshowOneRight');
// Dot menu
  var dotMenu = document.getElementById('slideDotMenuOne').children;
// Element that can occlude dotMenu disabling
// it temporarily
  var blockMenu = document.getElementById('blockMenuOne').children[0];
// Array of slides
  var slides = frame.children;
// Width of single slide relative to Frame width
  var slideWidth = Math.round(slides[0].offsetWidth);
// Number of slides fitting on the screen
  var inView = Math.round(window.innerWidth/slideWidth);
// Id of newly created interval
  var interId;
// Array that store Ids of all active intervals
  var intervals = [];
// ==================================
// Basic functions
function setOrder() {
  // Set slides order (used on page load)
  for (var i = 0; i < slides.length; i++) {
    slides[i].style.order = i;
  }
}
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
function frameToLeft() {
  // Move flexbox frame left
  framePos = parseFloat(frame.style.left);
  frame.style.left = framePos - slideWidth + 'px';
}
function frameToRight() {
  // Move flexbox frame right
  framePos = parseFloat(frame.style.left);
  frame.style.left = framePos + slideWidth + 'px';
}
function allOrder1Down() {
  // Degrade order of all slides by 1
  for (var i = 0; i < slides.length; i++) {
    order = parseInt(slides[i].style.order);
    order -= 1;
    slides[i].style.order = order;
  }
}
function allOrder1Up() {
  // Bump order of all slides by 1
  var order;
  for (var i = 0; i < slides.length; i++) {
    order = parseInt(slides[i].style.order);
    order += 1;
    slides[i].style.order = order;
  }
}
function leftOrderMax() {
  // Bump order of left slide by slides number
  var order = parseInt(leftSlide.style.order);
  order += slides.length - clones.length;
  leftSlide.style.order = order;
}
function rightOrderMin() {
  // Degrade order of right slide by slides number
  var order = parseInt(rightSlide.style.order);
  order -= slides.length - clones.length;
  rightSlide.style.order = order;
}
// ==================================
var clones = [];
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
  disableHandlers();
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
    enableHandlers();
    removeClones();
    autoShow();
  },600)
}
function goRight(invoker, range) {
  // Move by 1 to right
  suspendShow();
  disableHandlers();
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
    enableHandlers();
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
function disableHandlers() {
  // Disable event handlers
  leftButton.removeEventListener('click', goLeft );
  rightButton.removeEventListener('click', goRight );
  blockMenu.style.zIndex = '1';
}
// ==================================
function enableHandlers() {
  // Enable event handlers
  leftButton.addEventListener('click', goLeft);
  rightButton.addEventListener('click', goRight);
  blockMenu.style.zIndex = '-1';
}
// ====================================
function autoShow(duration) {
  // Create new interval and store its id in array
  var cycleTime = 5;  //interval in s
  if (intervals.length == 0) {
    if (!Number(duration)) duration = 0;
    interId = setInterval (goRight, (cycleTime*1000 + duration*1000));
    intervals.push(interId);
  }
}
// ================================================
function suspendShow() {
  // Stop all intervals and clear array
  for (var i = 0; i < intervals.length; i++) {
    clearInterval(intervals[i]);
  }
  intervals.splice(0,intervals.length);
}
// ================================================
function slideMouseEvent() {
  // suspend slideshow when user hover ofer the slide
  // and restart when mouse leaves slides
  for (var i = 0; i < slides.length; i++) {
    slides[i].addEventListener('mouseenter', suspendShow);
    slides[i].addEventListener('mouseleave', autoShow);
  }
}
// ================================================
function menuOneListeners() {
  // Add event listeners to dot menu elements
  var dotMenu = document.getElementById('slideDotMenuOne').children;
  for (var i = 0; i < dotMenu.length; i++) {
    dotMenu[i].addEventListener('click', goSlide);
  }
}
// ================================================
function goSlide() {
  // get data-slide attribute value from invoker
  // and run function for left or right movement
  var goToSlideIndex = this.dataset.slide;
  getLeft();
  var diff = goToSlideIndex - leftSlideIndex;
  if (diff < 0) goLeft( "", -diff)
  else if(diff > 0) goRight( "", diff)
}
// ================================================
function positionButtons() {
  // Modify buttons vertical position based on their size
  // and slides height so they always appear in the middle
  var buttonHeight = leftButton.offsetHeight;
  var image = document.getElementsByClassName('slideshowOne image')[0];
  var imageHeight = image.offsetHeight;
  leftButton.style.top = (imageHeight - buttonHeight) * 0.5 + 'px';
  rightButton.style.top = (imageHeight - buttonHeight) * 0.5 + 'px';
}
