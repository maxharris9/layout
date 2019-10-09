'use strict';
const {c} = require('../../src/layout');
const Root = require('../../src/components/root');
const Label = require('../../src/components/label');
const Margin = require('../../src/components/margin');
const SpacedLine = require('../../src/components/spaced-line');

module.exports = ({x, y, width, height}) => {
  const marginA = 0;
  return c(
    Root,
    {x, y, width, height, color: 'black'},
    c(
      SpacedLine,
      {mode: 'horizontal', align: 'left'},
      c(Label, {
        font: 'SourceSansPro-Regular',
        color: 'white',
        size: 90,
        text: 'Push Me',
        sizeMode: 'capHeight',
        showBoxes: false,
        done: () => {}
      }),
      c(
        Margin,
        {
          top: marginA,
          bottom: marginA,
          left: marginA,
          right: marginA,
          showBoxes: true
        },
        c(Label, {
          font: 'SourceSansPro-Regular',
          size: 100,
          text: 'A',
          sizeMode: 'capHeight',
          showBoxes: false,
          color: 'white',
          done: () => {}
        })
      )
    )
  );
};
