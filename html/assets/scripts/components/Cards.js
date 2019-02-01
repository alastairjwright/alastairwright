import $ from 'jquery';

const $window = $(window);

class Cards {
  constructor(element) {
    this.$element = $(element);
    this.els = {
      component: this.$element,
      $cards: $('.card'),
    };
    this.state = {
      windowHeight: $window.height(),
      scrollPosition: $window.scrollTop(),
      viewportBottom: ($window.scrollTop() + $window.innerHeight()),
      lastScrollTop: 0,
      scrollDown: false
    }

    this.addListeners();
  }

  addListeners() {
    $(window).on('scroll', this.handleScroll.bind(this));
  }

  inViewport(card) {
    let cardHeight = $(card).outerHeight();
    let offsetTop = $(card).offset().top;
    let bottomPosition = (offsetTop + cardHeight);
    this.state.viewportBottom = $window.scrollTop() + $window.innerHeight();
    this.state.scrollPosition = $window.scrollTop();

    return ((this.state.viewportBottom > offsetTop) && (this.state.scrollPosition < bottomPosition));
  }

  handleScroll(){
    var st = $window.scrollTop();
    this.state.scrollDown = false;

     if ( st > this.state.lastScrollTop ) {
         this.state.scrollDown = true;
     } else {
        this.state.scrollDown = false;
     }
     this.state.lastScrollTop = st;

     this.wheelOfFortune();
  }

  wheelOfFortune() {
    this.els.$cards.each((index, card) => {
      if( this.inViewport(card) && this.state.scrollDown == true ) {
        $(card).find('.marquee').removeClass("marquee__reverse");
        $(card).find('.marquee').addClass("marquee__animate");
      }
      else if ( this.inViewport(card) && this.state.scrollDown == false ) {
        $(card).find('.marquee').removeClass("marquee__animate");
        $(card).find('.marquee').addClass("marquee__reverse");
      }
    })
  }

}

export default Cards;
