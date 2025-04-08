window.HELP_IMPROVE_VIDEOJS = false;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

$(document).ready(function () {
  // Check for click events on the navbar burger icon
  $(".navbar-burger").click(function () {
    // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
    $(".navbar-burger").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");

  });

  var options = {
    slidesToScroll: 1,
    slidesToShow: 1,
    loop: true,
    infinite: true,
    autoplay: false,
    autoplaySpeed: 3000,
  }

  // Initialize all div with carousel class
  var carousels = bulmaCarousel.attach('.carousel', options);

  // Loop on each carousel initialized
  for (var i = 0; i < carousels.length; i++) {
    // Add listener to  event
    carousels[i].on('before:show', state => {
      console.log(state);
    });
  }


  // function syncFunction() {
  //   // 将你的代码放在这里


  //     // 获取所有的video-grid元素
  //     var videoGrids = document.querySelectorAll('.video-grid');

  //     // 遍历每个video-grid
  //     for (var i = 0; i < videoGrids.length; i++) {
  //         // 获取当前video-grid中的所有video元素
  //         var videos = videoGrids[i].querySelectorAll('video');
  //         console.log(videos.id);
  //         if (videos.length > 0) {
  //             // 获取第一个视频
  //             var firstVideo = videos[0];
  //             videos[0].currentTime=firstVideo.currentTime;
  //             // 当第一个视频的播放进度改变时，将所有其他视频的播放进度设置为与第一个视频相同
  //             // firstVideo.addEventListener('timeupdate', function() {
  //                 for (var j = 1; j < videos.length; j++) {
  //                     videos[j].currentTime = firstVideo.currentTime;
                      
  //                 }
  //                 // firstVideo.play();
  //             // });
  //         }
  //     }
  //   }
    // document.addEventListener('click', syncFunction);
  
  // Access to bulmaCarousel instance of an element
  var element = document.querySelector('#my-element');
  if (element && element.bulmaCarousel) {
    // bulmaCarousel instance is available as element.bulmaCarousel
    element.bulmaCarousel.on('before-show', function (state) {
      console.log(state);
    });
  }

  bulmaSlider.attach();


  $('.zoom-container').each(function() {
    const containerElement = $(this);
    zoomWidget = new ZoomWidget(containerElement);
  });

  $('.video-comparison').each(function () {
      const containerElement = $(this);
      comparisonWidget = new VideoComparison(containerElement);
  });

  $('.tabs-widget').each(function() {
    const containerElement = $(this);
    tabsWidget = new TabsWidget(containerElement);
  });

  //playPauseVideo();




// // 获取所有的video-grid
// var videoGrids = document.querySelectorAll('.video-grid');

// // 遍历每个video-grid
// for (var i = 0; i < videoGrids.length; i++) {
//     // 获取当前video-grid中的所有video元素
//     var videos = videoGrids[i].querySelectorAll('video');

//     // 创建一个函数来播放当前video-grid中的所有视频
//     function playAll() {
//         for (var j = 0; j < videos.length; j++) {
//             videos[j].play();
//         }
//     }

//     // 创建一个函数来停止当前video-grid中的所有视频
//     function pauseAll() {
//         for (var j = 0; j < videos.length; j++) {
//             videos[j].pause();
//         }
//     }

//     // 当任何一个视频开始播放时，调用playAll函数
//     // 当任何一个视频停止时，调用pauseAll函数
//     for (var j = 0; j < videos.length; j++) {
//         videos[j].addEventListener('play', playAll);
//         videos[j].addEventListener('pause', pauseAll);
//     }
// }




// window.addEventListener('DOMContentLoaded', (event) => {
//   // 获取所有的video-grid元素
//   var videoGrids = document.querySelectorAll('.video-grid');

//   // 创建一个函数来播放所有的视频
//   function playAll(videos) {
//       for (var i = 0; i < videos.length; i++) {
//           videos[i].play();
//       }
//   }

//   // 创建一个函数来暂停所有的视频
//   function pauseAll(videos) {
//       for (var i = 0; i < videos.length; i++) {
//           videos[i].pause();
//       }
//   }

//   // 创建一个Intersection Observer
//   var observer = new IntersectionObserver((entries, observer) => {
//       entries.forEach(entry => {
//           // 获取当前video-grid中的所有video元素
//           var videos = entry.target.querySelectorAll('video');

//           if (entry.isIntersecting) {
//               // 如果video-grid元素进入视口，播放所有的视频
//               playAll(videos);
//           } else {
//               // 如果video-grid元素离开视口，暂停所有的视频
//               pauseAll(videos);
//           }
//       });
//   });

//   // 遍历每个video-grid，将其添加到Intersection Observer中
//   for (var i = 0; i < videoGrids.length; i++) {
//       observer.observe(videoGrids[i]);
//   }
// });



});


class ZoomWidget {
  constructor(container) {
    this.container = container;
    this.canvas = container.find('canvas');
    this.context = this.canvas[0].getContext("2d");
    this.image = new Image();
    this.image.src = this.container.data('gt-img-src');
    this.zoomFactor = container.data('zoom-factor');
    this.defaultU = this.container.data('default-u');
    this.defaultV = this.container.data('default-v');
    let self = this;

    this.image.onload = function(){
      self.handleZoom(null, null, self.defaultU, self.defaultV);
    }

    this.canvas.mousemove(function(e) {
      let rect = self.canvas[0].getBoundingClientRect();
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;
      self.handleZoom(x, y);
    });
    this.canvas.on('resize', function(e) {
      self.handleZoom(null, null, self.defaultU, self.defaultV);
    })
    this.canvas.mouseleave(function(e) {
      self.handleZoom(null, null, self.defaultU, self.defaultV);
    });
  }

  handleZoom(x = null, y = null, u = null, v = null) {
    const containerElement = this.container;
    const zoomLensElements = containerElement.find('.zoom-lens');
    this.context.clearRect(0, 0, this.canvas[0].width, this.canvas[0].height);

    const imageWidth = this.canvas.parent().width();
    const imageHeight = imageWidth / this.image.width * this.image.height;
    this.canvas[0].width = imageWidth;
    this.canvas[0].height = imageHeight;
    this.context.drawImage(this.image, 0, 0, imageWidth, imageHeight);
  
    if (u && v) {
      x = u * this.canvas.width();
      y = v * this.canvas.height();
    } else {
      u = x / this.canvas.width()
      v = y / this.canvas.height()
    }
    console.log('u v', u, v)
    let naturalHeight = this.image.naturalHeight;
    let naturalWidth = this.image.naturalWidth;
    let zoomFullWidth = naturalWidth * this.zoomFactor;
    let zoomFullHeight = naturalHeight * this.zoomFactor;
  
    zoomLensElements.each(function () {
      let el = $(this);
      let zoomWindowWidth = el.width();
      let zoomWindowHeight = el.height();
      let maxZoomX = zoomFullWidth - zoomWindowWidth - 1;
      let maxZoomY = zoomFullHeight - zoomWindowHeight - 1;
      let zoomX = clamp(zoomFullWidth * u - zoomWindowWidth / 2, 0, maxZoomX);
      let zoomY = clamp(zoomFullHeight * v - zoomWindowHeight / 2, 0, maxZoomY);
  
      el.css('background-size',
        zoomFullWidth + 'px ' + zoomFullHeight + 'px');
      el.css('background-position',
        (-zoomX) + 'px ' + (-zoomY) + 'px');
    })
  
    let zoomWindowWidth = $(zoomLensElements[0]).width();
    let zoomWindowHeight = $(zoomLensElements[0]).height();
    let zoomCursorWidth = zoomWindowWidth / zoomFullWidth * this.canvas.width();
    let zoomCursorHeight = zoomWindowHeight / zoomFullHeight * this.canvas.height();
    this.context.strokeStyle = '#DB4437';
    this.context.lineWidth = 2;
    this.context.strokeRect(
      x - zoomCursorWidth / 2, y - zoomCursorHeight / 2, zoomCursorWidth, zoomCursorHeight);
  }
}


class TabsWidget {
  constructor(container) {
    this.container = container;
    this.activeIndex = 0;
    this.listItems = container.children('.tabs').children('ul').children('li');
    let self = this;
    this.listItems.click(function (e) {
      let index = $(this).index();
      self.update($(this), index);
    })

    this.update(this.listItems[this.activeIndex], this.activeIndex);
  }

  update(element, targetIndex) {
    this.activeIndex = targetIndex;
    const tabs = this.container.children('.tabs');
    const tabsContent = this.container.children('.tabs-content');
    this.listItems.each(function () {
      if ($(this).index() == targetIndex) {
        $(this).addClass('is-active');
      } else {
        $(this).removeClass('is-active');
      }
    });
    tabsContent.children().each(function () {
      if ($(this).index() == targetIndex) {
        $(this).show();
        $(this).find('*').each(function () {
          if ($(this).is(':visible')) {
            $(this).trigger('tab:show');
          }
        })
      } else {
        $(this).hide();
        $(this).find('*').trigger('tab:hide');
      }
    });
  }
}

function clamp(number, min, max) {
  return Math.min(Math.max(number, min), max);
}


// From: https://benfrain.com/automatically-play-and-pause-video-as-it-enters-and-leaves-the-viewport-screen/
function playPauseVideo() {
  let videos = document.querySelectorAll("video");
  videos.forEach((video) => {
      // We can only control playback without insteraction if video is mute
      video.muted = true;
      // Play is a promise so we need to check we have it
      let playPromise = video.play();
      if (playPromise !== undefined) {
          playPromise.then((_) => {
              let observer = new IntersectionObserver(
                  (entries) => {
                      entries.forEach((entry) => {
                          if (
                              entry.intersectionRatio !== 1 &&
                              !video.paused
                          ) {
                              video.pause();
                          } else if (video.paused) {
                              video.play();
                          }
                      });
                  },
                  { threshold: 0.5 }
              );
              observer.observe(video);
          });
      }
  });
}