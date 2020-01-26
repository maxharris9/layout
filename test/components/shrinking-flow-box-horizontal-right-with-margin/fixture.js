'use strict';
const {c} = require('../../../src/layout');
const Root = require('../../../src/components/root');
const Label = require('../../../src/components/label');
const Margin = require('../../../src/components/margin');
const ShrinkingFlowBox = require('../../../src/components/shrinking-flow-box');

module.exports = ({x, y, width, height}) => {
  const marginA = 0;
  return c(
    Root,
    {x, y, width, height, color: 'black'},
    c(
      ShrinkingFlowBox,
      {mode: 'horizontal', align: 'right'},
      c(Label, {
        font: 'SourceSansPro-Regular',
        color: 'white',
        size: 90,
        sizeMode: 'capHeight',
        text: 'Push Me',
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
          sizeMode: 'capHeight',
          text: 'A',
          color: 'white',
          showBoxes: false,
          done: () => {}
        })
      )
    )
  );
};