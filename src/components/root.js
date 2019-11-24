'use strict';

const Layout = require('../components');
const PropTypes = require('introspective-prop-types');

class Root extends Layout {
  size(renderContext, props, childBox) {
    this.box.x = props.x;
    this.box.y = props.y;
    this.box.width = props.width;
    this.box.height = props.height;

    if (!isNaN(childBox.width)) {
      this.box.width = childBox.width;
    }
    if (!isNaN(childBox.height)) {
      this.box.height = childBox.height;
    }

    // no need to return anything here because the root node has no parent
  }

  position(
    renderContext,
    {align, width, height},
    updatedParentPosition,
    childCount
  ) {
    if (align === 'center') {
      this.box.x = width / 2 - this.box.width / 2;
      this.box.y = height / 2 - this.box.height / 2;
    } else {
      this.box.x = updatedParentPosition.x;
      this.box.y = updatedParentPosition.y;
    }

    return Array(childCount).fill(Object.assign({}, this.box));
  }

  render(renderContext, {color}) {
    renderContext.fillStyle = color;
    renderContext.fillRect(
      this.box.x,
      this.box.y,
      this.box.width,
      this.box.height
    );
  }

  intersect() {
    return {
      hit: false,
      descend: true
    };
  }
}

Root.propTypes = {
  align: PropTypes.oneOf(['left', 'right', 'center']).isRequired,
  layers: PropTypes.arrayOf(PropTypes.string).isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  showBoxes: PropTypes.bool.isRequired
};

module.exports = Root;
