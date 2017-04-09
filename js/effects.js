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
// Correct slide width
  slideWidth = parseInt(100/inView*100)/100; //%
// ==================================
// Get the index of the leftmost
// currently displayed slide
  var leftSlide;
  function getLeftSlide() {
    var left;
    for (var i = 0; i < slidesTot; i++) {
      left = parseInt(getComputedStyle(slides[i]).left);
      if (left==0) leftSlide = i;
    }
    console.log('leftSlide: ' + leftSlide);
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
      // console.log('Prepared element: ' + (leftSlide + inView) );
    }
    else if (goDir < 0 && range == 1){
      // Get the slide to prepare
      el = leftSlide - 1;
      // i = leftSlide + inView;
      if (el < 0 ) el = el + slidesTot;
      slides[el].style.left = -slideWidth + '%';
      // console.log('Element ' + el + ' moved to: ' + (-slideWidth) + '%');
    }
    else {
      // This movement can be greater than
      // by signle slide but never circle
      // between ending slides
      if (goDir > 0) {
        // el = leftSlide + inView;
        // for (var i = 0; i < range; i++) {
        //   slides[el + i].style.left = (inView + i) * slideWidth + '%';
        // }
      }
      else {
        el = leftSlide - range;
        for (var i = 0; i < range; i++) {
          slides[el + i].style.left = (range - i) * (-slideWidth) + '%';
          if ((el + i ) == 0) console.log((range - i) * (-slideWidth));
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
    for (var i = 0; i < slidesTot; i++){
      slides[i].style.transition = 'left ' + duration +'s';
      left = parseInt(slides[i].style.left);
      slides[i].style.left = (left + slideWidth * -goDir * range) + '%';
    }
    // Position of the righmost slide
    rightSlide = parseInt(slides[i - 1].style.left);
  }
// ==================================
// Get the slides  with negative 'left' (beyond left
// viewport border) outside the border of the
// the viewport (ready for viewport resize)
  function leftToRight() {
    var left;
    for (var i = 0; i < slidesTot; i++) {
      slides[i].style.transition = 'left 0s';
      // left = parseInt(rightSlide.style.left);
      left = parseInt(getComputedStyle(slides[i]).left);
      if (left < 0 && left < -0.9*slideWidth/100*frameWidth) slides[i].style.left =
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
