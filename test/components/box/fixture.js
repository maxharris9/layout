'use strict';

const {c} = require('../../../src/layout');
const Box = require('../../../src/components/box');
const Root = require('../../../src/components/root');
const FlowBox = require('../../../src/components/flow-box');
const Label = require('../../../src/components/label');
const Rectangle = require('../../../src/components/rectangle');

module.exports = ({x, y, width, height}) => {
  return c(
    Root,
    {x, y, width, height, color: 'white'},
    c(
      FlowBox,
      {
        sizing: 'expand',
        mode: 'horizontal',
        align: 'center',
        showBoxes: true
      },
      c(
        FlowBox,
        {
          sizing: 'shrink',
          mode: 'vertical',
          align: 'right',
          showBoxes: false
        },
        c(Label, {
          font: 'SourceSansPro-Regular',
          color: 'black',
          size: 20,
          sizeMode: 'xHeight',
          text: 'above',
          showBoxes: false
        }),
        c(
          Box,
          {width: 200, height: 200, showBoxes: true},
          c(Rectangle, {color: 'rgba(128,128,0,0.5)'})
        ),
        c(Rectangle, {color: 'rgba(0,128,128,0.5)'}),
        c(Label, {
          font: 'SourceSansPro-Regular',
          color: 'black',
          size: 25,
          sizeMode: 'xHeight',
          text: 'below',
          showBoxes: false
        })
      )
    )
  );
};
