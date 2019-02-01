import $ from 'jquery';

const $window = $(window);

class ScrollBackground {
    constructor(element){
        this.$element = $(element);
        this.element = element;
        this.els = {
            component: this.$element,
            $scrollBG: $('.scroll_background'),
            $oddSvgs: $('.svg-container__odd'),
            $evenSvgs: $('.svg-container__even'),
        };
        this.text = this.element.dataset.scrollingText;
        this.width = this.$element.width();
        this.height = this.$element.height();
        this.colorArray = [];
        this.buildColorArray();
        this.listeners();
        // this.animate();
    }

    listeners() {
        $(window).on('resize', this.resize.bind(this));
        $(window).on('scroll', this.scroll.bind(this));
    }

    scroll(e) {
        let scrollPosition = $(window).scrollTop();

        let halfScroll = scrollPosition / 2;
        this.els.$oddSvgs.css('transform', `translate(-${halfScroll}px, ${halfScroll}px)`);
        this.els.$evenSvgs.css('transform', `translate(${halfScroll}px, -${halfScroll}px)`);

        this.scrollToColor(this.colorArray, scrollPosition, this)
    }

    buildColorArray(){
        for(let i = 0; i < $('section').length; i++){
            let colorObj = {
                background_color: $('section')[i].dataset.background,
                foreground_color: $('section')[i].dataset.foreground,
                offset: $($('section')[i]).offset().top
            }
            this.colorArray.push(colorObj)
        }
    }

    scrollToColor(colorArray, currentScroll, main){

        //example colorarry
        // let colorArray = [
        //     {color: '0xEFFF7A', offset: 0},//first stop
        //     {color: '0x1EFFF1', offset: 615},//second stop
        //     {color: '0xFF7E7D', offset: 1015},//third stop
        // ]

        //for each of the color array, check to see if currentScroll is more than its offset, and less than the next item's offset
        //if true take the percentage of the offset difference and apply it to the color difference.
        //return that color
        for(let i = 0; i < colorArray.length; i++){
            let currentScrollOffset = currentScroll - colorArray[i].offset;

            if(currentScroll > colorArray[i].offset && (colorArray[i + 1] && currentScroll < colorArray[i + 1].offset)){
                let scrollOffsetRatio = currentScrollOffset / (colorArray[i + 1].offset - colorArray[i].offset)
                let resultBackgroundColor = main.calculateNewColor(colorArray[i].background_color, colorArray[i + 1].background_color, scrollOffsetRatio)
                let resultForegroundColor = main.calculateNewColor(colorArray[i].foreground_color, colorArray[i + 1].foreground_color, scrollOffsetRatio)

                this.els.$scrollBG.css("background-color", resultBackgroundColor);
                $('.svg-container svg').css('fill', resultForegroundColor);
                // main.app.stage.children[0].children.forEach((textContainerObj, textContainerIndex) => {
                //     textContainerObj.children.forEach((textObj, textIndex) => {
                //         textObj.tint = resultForegroundColor;
                //     })
                // )}
                // console.log(resultBackgroundColor);
                // main.app.renderer.backgroundColor = resultBackgroundColor;
            }
       }


    }

    hexToRgb(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    convertColorValue(prev, next, ratio){
        let offset = next - prev;
        let color = (ratio * offset) + prev;
        return Math.round(color);
    }

    calculateNewColor(prevColor, nextColor, offsetRatio){
        let rgbColorPrev = this.hexToRgb(prevColor);
        let rgbColorNext = this.hexToRgb(nextColor);

        let convertedR = this.convertColorValue(rgbColorPrev.r, rgbColorNext.r, offsetRatio);
        let convertedG = this.convertColorValue(rgbColorPrev.g, rgbColorNext.g, offsetRatio);
        let convertedB = this.convertColorValue(rgbColorPrev.b, rgbColorNext.b, offsetRatio);

        return this.rgbToHex(convertedR, convertedG, convertedB);
    }

    resize(){
        this.width = this.$element.width();
        this.height = this.$element.height();
    }

    // animate() {
    //     this.scroll();
    //     window.requestAnimationFrame(this.animate.bind(this));
    // }
}

export default ScrollBackground;
