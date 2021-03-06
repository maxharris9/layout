'use strict';

const Component = require('../component');

class Box extends Component {
  size({width, height}) {
    this.box = {x: 0, y: 0, width, height};
    this.childBoxes = [{x: 0, y: 0, width, height}];
  }

  position(props, {parentBox}) {
    this.box.x = parentBox.x;
    this.box.y = parentBox.y;

    for (let childBox of this.childBoxes) {
      childBox.x += parentBox.x;
      childBox.y += parentBox.y;
    }
  }

  render({width, height, showBoxes}, {renderContext}) {
    if (showBoxes) {
      renderContext.strokeStyle = 'orange';
      renderContext.strokeRect(this.box.x, this.box.y, width, height);
      renderContext.fillStyle = 'lightgray';
      renderContext.fillRect(this.box.x, this.box.y, width, height);
    }
  }
}

module.exports = Box;
