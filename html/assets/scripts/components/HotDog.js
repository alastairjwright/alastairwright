import $ from "jquery";

const $window = $(window);

class HotDog {
  constructor(element) {
    this.$element = $(element);
    this.els = {
      component: this.$element,
      $textPath1: $("#hot-dog__svg__text-path-1"),
      $textPath2: $("#hot-dog__svg__text-path-2"),
      $textPath3: $("#hot-dog__svg__text-path-3"),
      $svgPath: $(".hot-dog__svg__path"),
      $jelly: $(".hot-dog__jelly"),
      $hotDogCTA: $(".arrow-container")
    };
    this.state = {
      windowWidth: $window.width(),
      windowHeight: $window.height(),
      mouse: {
        x: null,
        y: null
      },
      offsetLeft: {
        current: 0,
        speed: 0
      },
      offsetRight: {
        current: 0,
        speed: 0
      },
      scale: {
        current: 0,
        speed: 0
      },
      drag: 0.6,
      jellyMode: false
    };
    this.options = {
      scaleLineGraphPoints: {
        point1: { x: 100, y: 1.5 }, // point1.y defines the maximum scale
        point2: { x: 50, y: 0 } // point2.y defines the minium scale
      },
      offsetLeftLineGraphPoints: {
        point1: { x: 100, y: 35 }, // point1.y defines the maximum offset
        point2: { x: 0, y: 11 } // point2.y defines the minium offset
      },
      offsetRightLineGraphPoints: {
        point1: { x: 100, y: 28 }, // point1.y defines the minium offset
        point2: { x: 0, y: 43 } // point2.y defines the maximum offset
      },
      acceleration: 0.15,
      defaultDrag: 0.6,
      jellyDrag: 0.95
    };
    this.ctaTimeout = "";

    this.addListeners();
    this.animate();
  }

  addListeners() {
    $window.on("mousemove", event => this.handleMouseMove(event));
    this.els.$jelly.on("click", this.handleJellyClick.bind(this));
  }

  handleMouseMove(event) {
    this.state.mouse.x = event.clientX;
    this.state.mouse.y = event.clientY;
  }

  handleJellyClick(e) {
    e.preventDefault();
    if (this.state.jellyMode) {
      this.state.drag = this.options.defaultDrag;
      this.state.jellyMode = false;
    } else {
      this.state.drag = this.options.jellyDrag;
      this.state.jellyMode = true;

      // start positions from a corner to start jelly mode with a big bounce
      this.calculatePositions(-2000, -2000);
      this.render();
    }
    this.els.component.toggleClass(
      "hot-dog__jelly--jelly-mode",
      this.state.jellyMode
    );
  }

  straighLineEquation(point1, point2) {
    let lineObj = {
        gradient: (point1.y - point2.y) / (point1.x - point2.x)
      },
      parts;

    lineObj.yIntercept = point1.y - lineObj.gradient * point1.x;
    lineObj.toString = function() {
      if (Math.abs(lineObj.gradient) === Infinity) {
        return "x = " + point1.x;
      } else {
        parts = [];

        if (lineObj.gradient !== 0) {
          parts.push(lineObj.gradient + "x");
        }

        if (lineObj.yIntercept !== 0) {
          parts.push(lineObj.yIntercept);
        }

        return "y = " + parts.join(" + ");
      }
    };

    return lineObj;
  }

  getYFromLineGraph(x, point1, point2) {
    let lineObj = this.straighLineEquation(point1, point2),
      y = lineObj.gradient * x + lineObj.yIntercept;

    return y;
  }

  updateStatePositionWithEase(state, newPos) {
    state.speed += (newPos - state.current) * this.options.acceleration;
    state.speed *= this.state.drag;
    state.current += state.speed;

    return null;
  }

  newPosition(lineGraphX, point1, point2, state) {
    let newPos = this.getYFromLineGraph(lineGraphX, point1, point2);
    this.updateStatePositionWithEase(state, newPos);
  }

  calculatePositions(mouseX, mouseY) {
    let mousePercentageLeft = (mouseX / this.state.windowWidth) * 100;
    let mousePercentageTop = (mouseY / this.state.windowHeight) * 100;

    this.newPosition(
      mousePercentageLeft,
      this.options.offsetLeftLineGraphPoints.point1,
      this.options.offsetLeftLineGraphPoints.point2,
      this.state.offsetLeft
    );

    this.newPosition(
      mousePercentageLeft,
      this.options.offsetRightLineGraphPoints.point1,
      this.options.offsetRightLineGraphPoints.point2,
      this.state.offsetRight
    );

    this.newPosition(
      mousePercentageTop,
      this.options.scaleLineGraphPoints.point1,
      this.options.scaleLineGraphPoints.point2,
      this.state.scale
    );
  }

  render() {
    this.els.$textPath1.attr(
      "startOffset",
      `${this.state.offsetLeft.current}%`
    );
    this.els.$textPath2.attr(
      "startOffset",
      `${this.state.offsetRight.current}%`
    );
    this.els.$textPath3.attr(
      "startOffset",
      `${this.state.offsetLeft.current}%`
    );
    this.els.$svgPath.attr(
      "transform",
      `scale(1, ${this.state.scale.current})`
    );
  }

  animate() {
    if (this.state.mouse.x && this.state.mouse.y) {
      this.calculatePositions(this.state.mouse.x, this.state.mouse.y);
      this.render();
    }
    window.requestAnimationFrame(this.animate.bind(this));
  }
}

export default HotDog;
