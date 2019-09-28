'use strict';

const Layout = require('../components');

class Viewport extends Layout {
  constructor() {
    super();
    this.childBoxes = [];
  }

  size(renderContext, {width, height}, childBox) {
    this.childBoxes.push(childBox);

    this.box = Object.assign({}, {width, height});
    return {width, height};
  }

  position(renderContext, {offsetX, offsetY}, updatedParentPosition) {
    this.box.x = updatedParentPosition.x;
    this.box.y = updatedParentPosition.y;

    const absX = (this.box.width - this.childBoxes[0].width) * offsetX;
    const absY = (this.box.height - this.childBoxes[0].height) * offsetY;

    const result = [
      {
        x: this.box.x + absX,
        y: this.box.y + absY
      }
    ];

    return result;
  }

  render(renderContext) {
    renderContext.strokeStyle = 'teal';
    renderContext.strokeRect(
      this.box.x,
      this.box.y,
      this.box.width,
      this.box.height
    );

    renderContext.beginPath();
    renderContext.rect(this.box.x, this.box.y, this.box.width, this.box.height);
    renderContext.clip();
  }

  intersect(x, y) {
    const {box} = this;
    if (
      x >= box.x &&
      x <= box.x + box.width &&
      y >= box.y &&
      y <= box.y + box.height
    ) {
      return {
        hit: false,
        descend: true
      };
    }
    return {
      hit: false,
      descend: false
    };
  }
}

module.exports = Viewport;
