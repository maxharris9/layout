'use strict';
const {c} = require('../../../src/layout');
const Root = require('../../../src/components/root');
const Label = require('../../../src/components/label');
const Margin = require('../../../src/components/margin');
const FlowBox = require('../../../src/components/flow-box');
const Button = require('../../../src/components/button');
const log = require('../../../src/log');

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
        alignVertical: 'center',
        alignHorizontal: 'right',
        stackChildren: 'vertical'
      },
      c(Label, {
        font: 'SourceSansPro-Regular',
        color: 'white',
        sizeMode: 'capHeight',
        size: 20,
        text: 'Push Me',
        showBoxes: false,
        done: () => {}
      }),
      c(Label, {
        font: 'SourceSansPro-Regular',
        color: 'white',
        sizeMode: 'capHeight',
        size: 20,
        text: 'Push Me',
        showBoxes: false,
        done: () => {}
      }),
      c(Label, {
        font: 'SourceSansPro-Regular',
        color: 'white',
        sizeMode: 'capHeight',
        size: 20,
        text: 'Push Me',
        showBoxes: false,
        done: () => {}
      }),
      c(Label, {
        font: 'SourceSansPro-Regular',
        color: 'white',
        sizeMode: 'capHeight',
        size: 20,
        text: 'Push Me',
        showBoxes: false,
        done: () => {}
      }),
      c(
        Button,
        {onInput: log, onClick: log},
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
            color: 'white',
            sizeMode: 'capHeight',
            size: 100,
            text: 'A',
            showBoxes: false,
            done: () => {}
          })
        )
      ),
      c(
        Button,
        {onInput: log, onClick: log},
        c(
          Margin,
          {
            sizingVertical: 'shrink',
            sizingHorizontal: 'shrink',
            top: 10,
            bottom: 10,
            left: 10,
            right: 10,
            showBoxes: true
          },
          c(Label, {
            font: 'SourceSansPro-Regular',
            color: 'white',
            sizeMode: 'capHeight',
            size: 200,
            text: 'B',
            showBoxes: false
          })
        )
      ),
      c(
        Button,
        {onInput: log, onClick: log},
        c(
          Margin,
          {
            sizingVertical: 'shrink',
            sizingHorizontal: 'shrink',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            showBoxes: true
          },
          c(Label, {
            font: 'SourceSerifPro-Regular',
            color: 'white',
            sizeMode: 'capHeight',
            size: 30,
            text: 'C',
            showBoxes: false
          })
        )
      )
    )
  );
};
