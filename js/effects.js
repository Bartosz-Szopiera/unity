//-=-=-=-=-=-SLIDESHOW-=-=-=-=-=-=-
// Generic element
  var el;
  // Slides wrapper
  var frame = document.getElementById('slideshowOne');
// Array of slides
  var slides = frame.children;
// Total number of slides in slideshow
  var slidesTot = slides.length
// Frame width
  var frameWidth = frame.offsetWidth;
// Width of single slide relative to Frame width
  var slideWidth = slides[0].offsetWidth/frameWidth * 100; // %
  slideWidth = Math.round(slideWidth); //%
// Number of slides fitting on the screen
  var inView = Math.round(100 / slideWidth);
// ==================================
// Get the index of the leftmost
// currently displayed slide
  var leftSlide;
  function getLeftSlide() {
    var left;
    for (var i = 0; i < slidesTot; i++) {
      left = parseInt(slides[i].style.left);
      if (left==0) leftSlide = i;
    }
  }
// ==================================
// Handle user navigation requests
  var goDir = 0;
  var goNth = 0;
  var range = 0;
  // Left button handler
    function goLeft() {
      goDir = -1;
      range = 1;
      slideshow();
    }
  // Right button handler
    function goRight() {
      goDir = 1;
      range = 1;
      slideshow();
    }
  // Get the goNth slide handler
    function goSlide(eveTarget) {
      goNth = eveTarget.dataset.slide;
      getLeftSlide();
      if (goNth == leftSlide) goDir = 0;
      else goDir = goNth > leftSlide ? 1 : -1;
      // Number of slides to goNth slide
      // Positive: user goes right, slides go left
        range = Math.abs(goNth - leftSlide);
      slideshow();
    }
// ==================================
// Rearange not visible slides
// before their appearance on screen
  function arrangeSlides() {
    // Referencial slide
    if (goDir > 0 && range == 1){
      // Get the slide to prepare
      // el - element index
      el = leftSlide + inView;
      if (slidesTot <= el ) el = el - slidesTot;
      slides[el].style.left = inView * slideWidth + '%';
    }
    else if (goDir < 0 && range == 1){
      // Get the slide to prepare
      el = leftSlide - 1;
      // i = leftSlide + inView;
      if (el < 0 ) el = el + slidesTot;
      slides[el].style.left = -slideWidth + '%';
    }
    else {
      // This movement can be greater than
      // by signle slide but never circle
      // between ending slides
      if (goDir > 0) {
        // Index of target element
        el = leftSlide + range;
        var clone = [];
        for (var i = 0; i < inView - (slidesTot - range); i++) {
          clone[i] = slides[i].cloneNode(true);
          frame.appendChild(clone[i]);
          clone[i].style.removeProperty('transform');
          clone[i].style.position = 'absolute';
          clone[i].classList.add('evilClone');
          slides[i].style.left = (slidesTot + i) * (slideWidth) + '%';
        }
        return clone;
      }
      else {
        var clone = [];
        for (var j = 0; j < inView - (slidesTot - range); j++) {
          clone[j] = slides[j].cloneNode(true);
          frame.appendChild(clone[j]);
          clone[j].style.removeProperty('transform');
          clone[j].style.position = 'absolute';
          clone[j].classList.add('evilClone');
        }
        el = leftSlide - range;
        for (var i = 0; i < range; i++) {
          slides[el + i].style.left = (range - i) * (-slideWidth) + '%';
        }
      }
    }
  }
// ==================================
// Move all slides by 'range' places
// left or rigth
var duration = 0.5; // s
var rightSlide;
  function moveSlides(){
    var left;
    var clones = document.getElementsByClassName('evilClone').length;
    for (var i = 0; i < slides.length; i++){
      slides[i].style.transition = 'left ' + duration +'s';
      left = parseInt(slides[i].style.left);
      slides[i].style.left = (left + slideWidth * -goDir * range) + '%';
    }
    // Position of the righmost slide
    rightSlide = parseInt(slides[i - 1 - clones].style.left);
  }
// ==================================
// Get the slides  with negative 'left' (beyond left
// viewport border) outside the border of the
// the viewport (ready for viewport resize)
  function leftToRight() {
    var len = document.getElementsByClassName('evilClone').length;
    for (var i = 0; i < len; i++) {
      var clones = document.getElementsByClassName('evilClone');
      frame.removeChild(clones[0]);
    }
    var left;
    for (var i = 0; i < slides.length; i++) {
      slides[i].style.transition = 'left 0s';
      left = parseInt(slides[i].style.left);
      if (left < 0 && left < -0.9*slideWidth) slides[i].style.left =
        rightSlide + (i + 1) * slideWidth + '%';
    }
  }
// ==================================
// Arrange slides on page load
  // Move all slides with the translate in place of left-most
  // slide ,then restore their old position with 'left'
  function prepareSlides() {
    for (var i = 0; i < slidesTot; i++) {
      slides[i].style.transform = 'translate(' + -100*i + '%,0px)';
      slides[i].style.left = slideWidth*i + '%';
    }
  }
// ==================================
// Disable handlers untill function ends
function disableHandlers() {
  el = document.getElementById('slideshowOneLeft');
  el.removeEventListener('click', goLeft );
  el = document.getElementById('slideshowOneRight');
  el.removeEventListener('click', goRight );
  // var dotMenu =
}
// ==================================
// Enable back handlers
function enableHandlers() {
  el = document.getElementById('slideshowOneLeft');
  el.addEventListener('click', goLeft );
  el = document.getElementById('slideshowOneRight');
  el.addEventListener('click', goRight );
}
// ==================================
// Boundled functions
function slideshow() {
  disableHandlers();
  // leftToRight();
  getLeftSlide();
  arrangeSlides();
  setTimeout (moveSlides, 0);
  setTimeout (leftToRight, duration*1000);
  setTimeout (enableHandlers, (duration*1000));
}

// Event handlers:
  // prepareSlides();
  // goLeft();
  // goRight();
  // goSlide();
// Other functions:
  // disableHandlers();
  // getLeftSlide();
  // arrangeSlides();
  // moveSlides();
  // leftToRight();
  // enableHandlers();


// Investigate disappearing elements when moving by *OK*
// range greater than 1. Delay is acceptable, but
// not that element disappears.

// Leve current system for moving by single slide, it *OK*
// is good.

// Add duplicates of slides on the left of Slideshow
// and on the right. They will become visible when
// fast scrolling (range > 1) will be needed. Actual
// slides will appear with slite delay.

// Hide clickable part of dotMenu when event is triggerd
// for the time of the animation

// Make leftToRight operate not on the life reading,
// but the values passes to it by the moveSlides

// Change measurment system from width and left to just
// translation and absolutely positioned slides

// Problem with this slideshow can't be resolved without
// clopying/cloning elements. Imageine you have just two
// slides, and they are two visible at once. When you circle
// through them you need to so one of them in two places at once.
// It can't be done without cloning.


// To handle missing slides for movements with range
// greater than 1 just use the same moveSlides and
// leftToRight functions but repeated multiple times
// and with duration multiple times shorter
  // Sadly, this apporach failed. At least in a way
  // I was trying to accomplish ty, i.e. by the means
  // of setInterval function that was queuying movement
  // of slides. Handling delay was complicated and
  // I was not controlling leakage of variables values
  // leading to erratic and unwanted results.
