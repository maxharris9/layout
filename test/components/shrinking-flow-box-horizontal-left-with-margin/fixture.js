'use strict';
const {c} = require('../../../src/layout');
const Root = require('../../../src/components/root');
const Label = require('../../../src/components/label');
const Margin = require('../../../src/components/margin');
const FlowBox = require('../../../src/components/flow-box');

module.exports = ({x, y, width, height}) => {
  const marginA = 0;
  return c(
    Root,
    {x, y, width, height, color: 'black'},
    c(
      FlowBox,
      {
        sizingHorizontal: 'shrink',
        sizingVertical: 'shrink',
        alignVertical: 'top',
        alignHorizontal: 'left',
        stackChildren: 'horizontal'
      },
      c(Label, {
        font: 'SourceSansPro-Regular',
        color: 'white',
        size: 90,
        text: 'Push Me',
        sizeMode: 'capHeight',
        showBoxes: false
      }),
      c(
        Margin,
        {
          sizingVertical: 'shrink',
          sizingHorizontal: 'shrink',
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
          color: 'white'
        })
      )
    )
  );
};
