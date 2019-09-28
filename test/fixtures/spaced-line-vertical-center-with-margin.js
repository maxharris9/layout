'use strict';
const {c} = require('../../src/layout');
const {SpacedLine, Button} = require('../../src/components');
const {Root} = require('../../src/components/root');
const {Label} = require('../../src/components/label');
const {Margin} = require('../../src/components/margin');
const log = require('../../src/log');

module.exports = ({x, y, width, height}) => {
  return c(
    Root,
    {x, y, width, height, color: 'black'},
    c(
      SpacedLine,
      {mode: 'vertical', align: 'center'},
      c(
        Button,
        {onInput: log, onClick: log},
        c(
          Margin,
          {top: 10, bottom: 10, left: 10, right: 10, showBoxes: true},
          c(Label, {
            font: 'sans',
            color: 'white',
            size: 70,
            text: 'B',
            showBoxes: true
          })
        )
      )
    )
  );
};
