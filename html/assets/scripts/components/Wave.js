import $ from 'jquery';
import lottie from 'lottie-web';
import waveAnimationJson from './../../json/wave.json';

const $window = $(window);

class Wave {
  constructor(element) {
    this.$element = $(element);
    this.addListeners();
    window.onbeforeunload = function () {
      window.scrollTo(0, 0);
    }
  }

  addListeners() {
    $('.hot-dog__cta').on('click', event => this.waveTransition());
  }

  waveTransition() {
    $('.noScroll').css('overflow','visible');
    $('.wave-transition').css({'opacity':'0'});

    let animation = lottie.loadAnimation({
                      container: document.getElementById('lottie-wave-anim'),
                      renderer: 'svg',
                      loop: false,
                      autoplay: true,
                      animationData: waveAnimationJson,
                    });

    animation.addEventListener('complete', function(){
      $(".scroll_background")[0].style.opacity = 1;
      $('html,body').animate({scrollTop:$('.card:first-child').offset().top - (window.innerHeight/4) + 'px'}, 700, function(){
        $('.dont_scroll_up').show();

      });
    });


    setTimeout(function(){
      $('.hot-dog').css({opacity:0});

    }, 1000);
  }

}

export default Wave;
