'use strict';

const Layout = require('../components');
const log = require('../log');
const PropTypes = require('introspective-prop-types');

class ShrinkingFlowBox extends Layout {
  constructor() {
    super();
    this.childBoxes = [];
  }

  size(props, {mode, children}) {
    if (mode !== 'shrink') {
      return;
    }

    // go through each child and assign a final { x, y } coord pair
    let _w = 0;
    let _h = 0;

    let tallest = 0;
    let widest = 0;
    for (let child of children) {
      const {box} = child.instance;

      switch (props.mode) {
        case 'vertical':
          if (box.width > widest) {
            widest = box.width;
            _w = box.width; // set the width to the _last_ box's width
          }
          _h += box.height;
          break;
        case 'horizontal':
          if (box.height > tallest) {
            tallest = box.height;
            _h = box.height; // set the height to the _last_ box's height
          }
          _w += box.width;
          break;
        case 'diagonal':
          _w += box.width;
          _h += box.height;
          break;
        default:
          log('invalid layout mode in spacedLine:', props.mode);
      }
      this.childBoxes.push({
        x: 0,
        y: 0,
        width: box.width,
        height: box.height
      });
    }

    this.box = {x: 0, y: 0, width: _w, height: _h};
  }

  position(props, {childPosition, parent}) {
    const parentBox = parent.instance.childBoxes[childPosition];

    // calculate the box we'll be in because we don't have this info in
    // this.box when this function is run - maybe later we can use that instead?
    const biggestBox = this.childBoxes.reduce(
      (accum, curr) => {
        if (curr.height > accum.height) {
          accum.height = curr.height;
        }

        if (curr.width > accum.width) {
          accum.width = curr.width;
        }

        return accum;
      },
      {width: 0, height: 0}
    );

    this.box.x = parentBox.x;
    this.box.y = parentBox.y;

    let _y = parentBox.y;
    let _x = parentBox.x;

    for (let box of this.childBoxes) {
      if (props.mode === 'horizontal') {
        switch (props.align) {
          case 'left':
            _x += box.x;
            break;
          case 'center':
            _x += box.x;
            _y = parentBox.y + biggestBox.height / 2 - box.height / 2;
            break;
          case 'right':
            _x += box.x;
            _y = parentBox.y + biggestBox.height - box.height;
            break;
          default:
            log('invalid alignment props.mode in spacedLine:', props.align);
            break;
        }
      } else if (props.mode === 'vertical') {
        switch (props.align) {
          case 'left':
            break;
          case 'center':
            _x = parentBox.x + biggestBox.width / 2 - box.width / 2;
            break;
          case 'right':
            _x = parentBox.y + biggestBox.width - box.width;
            break;
          default:
            log('invalid alignment props.mode in spacedLine:', props.align);
            break;
        }
      } else if (props.mode === 'diagonal') {
        _x += box.x;
      } else {
        log('invalid layout props.mode in spacedLine:', props.mode);
      }

      box.x = _x;
      box.y = _y;

      switch (props.mode) {
        case 'vertical':
          _y += box.height;
          break;
        case 'horizontal':
          _x += box.width;
          break;
        case 'diagonal':
          _x += box.width;
          _y += box.height;
          break;
        default:
          log('invalid layout props.mode in spacedLine:', props.mode);
          break;
      }
    }
  }

  render({color, showBoxes}, {renderContext}) {
    if (!showBoxes) {
      return;
    }
    renderContext.strokeStyle = color;
    renderContext.strokeRect(
      this.box.x,
      this.box.y,
      this.box.width,
      this.box.height
    );
  }
}
ShrinkingFlowBox.propTypes = {
  mode: PropTypes.oneOf(['vertical', 'horizontal', 'diagonal']).isRequired,
  align: PropTypes.oneOf(['left', 'right', 'center']).isRequired
};
module.exports = ShrinkingFlowBox;
