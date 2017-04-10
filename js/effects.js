//-=-=-=-=-=-SLIDESHOW-=-=-=-=-=-=-
// Generic element
  var el;
// Event invoker identifier ('this')
  // var target;
// Slides wrapper
  var frame = document.getElementById('slideshowOne');
// Dot menu
  var dotMenu = document.getElementById('slideDotMenuOne').children;
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
      // clearInterval(interId);
      getLeftSlide();
      lightDot();
      target = "";
      goDir = -1;
      range = 1;
      slideshow();
      // autoShow(duration);
    }
  // Right button handler
    function goRight() {
      // clearInterval(interId);
      getLeftSlide();
      lightDot();
      console.log('goRight/goLeft leftSlide: ' + leftSlide);
      target = "";
      goDir = 1;
      range = 1;
      slideshow();
      // autoShow(duration);
    }
  // Get the goNth slide handler
    function goSlide(target) {
      // clearInterval(interId);
      lightDot();
      goNth = target.dataset.slide;
      getLeftSlide();
      if (goNth == leftSlide) goDir = 0;
      else goDir = goNth > leftSlide ? 1 : -1;
      // Number of slides to goNth slide
      // Positive: user goes right, slides go left
        range = Math.abs(goNth - leftSlide);
      slideshow(target);
      // autoShow(duration);
    }
// ==================================
// Rearange not visible slides
// before their appearance on screen
  function arrangeSlides() {
    // User browse slide on the right
    if (goDir > 0 && range == 1){
      // This block is *USELESS*
      //  since all not visible slides are after
      //  movement kept beyond right viewport border
      //  any arrangement prior the move is futile
      // el - element index
      // el = leftSlide + inView;
      // if (slidesTot <= el ) el = el - slidesTot;
      // slides[el].style.left = inView * slideWidth + '%';
      // console.log('');
    }
    else if (goDir < 0 && range == 1){
      el = leftSlide - 1;
      // i = leftSlide + inView;
      if (el < 0 ) el = el + slidesTot;
      slides[el].style.transition = 'left 0s';
      slides[el].style.left = -slideWidth + '%';
      console.log('arranging slides');
    }
    // User browse slide on the left
    else {
      // This movement greater than one
      // slide slot but never circling
      // between ends of whole slideshow
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
    console.log('moving slides');
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
// Disable handlers
function disableHandlers(target) {
  el = document.getElementById('slideshowOneLeft');
  el.removeEventListener('click', goLeft );
  el = document.getElementById('slideshowOneRight');
  el.removeEventListener('click', goRight );
  // el = target;
  // if (el) el.className += ' active';
}
// ==================================
// Enable handlers
function enableHandlers(target) {
  el = document.getElementById('slideshowOneLeft');
  el.addEventListener('click', goLeft );
  el = document.getElementById('slideshowOneRight');
  el.addEventListener('click', goRight );
  // el = target;
  // if (el) el.classList.remove('active');
}
// ==================================
// Boundled functions
function slideshow(target) {
  disableHandlers(target);
  arrangeSlides();
  // setTimeout for asynchronicity, it is ugly but works
  setTimeout (moveSlides, 0);
  setTimeout (getLeftSlide, 1);
  setTimeout (lightDot, 2);
  setTimeout (leftToRight, duration*1000);
  setTimeout (enableHandlers, (duration*1000), target);
}

var cycleTime = 4; //s
var interId;

function autoShow(someTime) {
  target = "";
  goDir = 1;
  // range = 1;
  // if (someTime) duration = someTime;
  // interId = setInterval (slideshow, (cycleTime*1000 + duration*1000));
}


// Function that activates or desactivates
// current leftSlide dot. Should be run before slides
// move, and just after their new positions get defined
function lightDot() {
  if(!leftSlide) {
    getLeftSlide();
  }
  dotMenu[leftSlide].classList.toggle('active');
}


function resetInterval() {
  clearInterval(interId);
}

function onLoad() {
  prepareSlides();
  // lightDot();
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
  // between separate function invokations
  // leading to erratic and unwanted results.
