//=========Slideshow==========
// Generic element
  var el;
// Array of slides
  var slides = document.getElementsByClassName('slideWrap');
// Width of single slide
  var slideWidth = slides[0].offsetWidth;
// Total number of slides in slideshow
  var slidesTot = slides.length
// Slides wrapper
  var frame = document.getElementsByClassName('slidesFrame');
// Frame width
  var frameWidth = frame.offsetWidth;
// Number of slides fitting on the screen
  var inView = parseInt(frameWidth / slideWidth);
  console.log('Number of slides in view: ' + inView);
  // Get index of the leftmost currently
  // displayed slide
  var leftSlide;
  var left; //value of left CSS property
  for (var i = 0; i < slidesTot; i++) {
    left = parseInt(getComputedStyle(slides[i]).left);
    if (left==0) leftSlide = i;
  }
// Get index of the rigthtmost currently
// displayed slide
  var rightSlide = leftSlide + inView - 1;
  if (rightSlide > slidesTot) rightSlide - slidesTot;
// Handle user navigation requests
// and define destination slide (new leftSlide)
  var goDir = 0;
  var goNth = 0;
  // Left button handler
    function goLeft() {
      goDir = -1;
      goNth = 0;
      // return goNth;
    }
  // Right button handler
    function goRight() {
      goDir = 1;
      goNth = 0;
      // return goNth;
    }
  // Go to nth slide handler
    function goSlide() {
      goDir = 0;
      goNth = this.dataset.slide;
      // return goNth;
    }
// Number of slides to targeted slide
// (range of the movement)
  var range;
  // Positive: user go right, slides slide left
  range = goNth - leftSlide;

// Rearange not visible slides
// before their appearance on screen
  // Referencial slide
  if (goDir == 1){
    var el;
    // Get the slide to prepare
    el = slides[rightSlide + 1]
    if (slidesTot < el ) el = el - slidesTot;
    el.style.left = inView * frameWidth + 'px';
  }
  else if (goDir == -1){
    var el;
    // Get the slide to prepare
    el = slides[leftSlide - 1]
    if (el < 0 ) el = el + slidesTot;
    el.style.left = -frameWidth + 'px';
  }
  else {
    var el = [];
    // Get the slides to prepare
  }

// Move all slides by 'range' places
// left or rigth
function moveSlides(range)
  // dir = 1 -> slides move left, else right
  for (var i = 0; i < slidesTot; i++){
    el = slides[i];
    el.style.left = frameWidth * (i - leftSlide) * (-range);
  }
