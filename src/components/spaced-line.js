'use strict';

const Layout = require('../components');
const log = require('../log');
const {modes} = require('../layout');

class SpacedLine extends Layout {
  serialize() {
    return {
      box: Object.assign({}, this.box),
      parentBox: Object.assign({}, this.parentBox),
      childBoxes: Object.assign({}, this.childBoxes),
      positionInfo: Object.assign({}, this.positionInfo)
    };
  }
  deserialize(state) {
    this.box = state.box;
    this.parentBox = state.parentBox;
    this.childBoxes = state.childBoxes;
    this.positionInfo = state.positionInfo;
  }

  getLayoutModes() {
    return {
      sizeMode: modes.SELF_AND_CHILDREN, // size depends entirely on self AND children
      positionMode: modes.PARENTS // position depends entirely on parent
    };
  }

  constructor() {
    super();
    this.childBoxes = [];
  }

  size(renderContext, {mode}, childBox, childCount) {
    this.childBoxes.push(childBox);

    // if we have all the child boxes, process!
    if (this.childBoxes.length === childCount) {
      // go through each child and assign a final { x, y } coord pair
      let _w = 0;
      let _h = 0;

      let tallest = 0;
      let widest = 0;
      for (let box of this.childBoxes) {
        box.x = _w;
        box.y = _h;

        switch (mode) {
          case 'vertical':
            _h += box.height;

            if (box.width > widest) {
              widest = box.width;
              _w = box.width; // set the width to the _last_ box's width
            }
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
            log('invalid layout mode in spacedLine:', mode);
        }
      }

      this.parentBox = {x: 0, y: 0, width: _w, height: _h}; // send a size up to the parent
      return;
    }

    //return false; // stops the traversal here
    this.parentBox = undefined;
  }

  // eslint-disable-next-line no-unused-vars
  position(renderContext, {mode, align}, updatedParentPosition, childCount) {
    this.box.x = updatedParentPosition.x;
    this.box.y = updatedParentPosition.y;

    // calculate the box we'll be in because we don't have this info in
    // this.box when this function is run - maybe later we can use that instead?
    const finalBox = this.childBoxes.reduce(
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

    let positionedChildren = [];
    let _y = updatedParentPosition.y;

    // go through each child and assign a final { x, y } coord pair
    for (let box of this.childBoxes) {
      let _x = updatedParentPosition.x;

      if (mode === 'horizontal') {
        switch (align) {
          case 'left':
            _x += box.x;
            break;
          case 'center':
            _x += box.x;
            _y = updatedParentPosition.y + finalBox.height / 2 - box.height / 2;
            break;
          case 'right':
            _x += box.x;
            _y = updatedParentPosition.y + finalBox.height - box.height;
            break;
          default:
            log('invalid alignment mode in spacedLine:', align);
            break;
        }
      } else if (mode === 'vertical') {
        switch (align) {
          case 'left':
            break;
          case 'center':
            _x += finalBox.width / 2 - box.width / 2;
            break;
          case 'right':
            _x += finalBox.width - box.width;
            break;
          default:
            log('invalid alignment mode in spacedLine:', align);
            break;
        }
      } else if (mode === 'diagonal') {
        _x += box.x;
      } else {
        log('invalid layout mode in spacedLine:', mode);
      }

      positionedChildren.push({x: _x, y: _y});

      switch (mode) {
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
          log('invalid layout mode in spacedLine:', mode);
          break;
      }
    }

    this.positionInfo = positionedChildren;
  }

  render() {}
}

module.exports = SpacedLine;
