'use strict';
const {c} = require('../../src/layout');
const Root = require('../../src/components/root');
const Label = require('../../src/components/label');
const Margin = require('../../src/components/margin');
const ShrinkingFlowBox = require('../../src/components/shrinking-flow-box');
const Button = require('../../src/components/button');
const log = require('../../src/log');

module.exports = ({x, y, width, height}) => {
  return c(
    Root,
    {x, y, width, height, color: 'black'},
    c(
      ShrinkingFlowBox,
      {mode: 'vertical', align: 'center'},
      c(
        Button,
        {onInput: log, onClick: log},
        c(
          Margin,
          {top: 10, bottom: 10, left: 10, right: 10, showBoxes: true},
          c(Label, {
            font: 'SourceSansPro-Regular',
            color: 'white',
            size: 70,
            sizeMode: 'capHeight',
            text: 'B',
            showBoxes: false
          })
        )
      ),
      c(
        ShrinkingFlowBox,
        {mode: 'horizontal', align: 'center'},
        c(
          Button,
          {onInput: log, onClick: log},
          c(
            Margin,
            {top: 10, bottom: 10, left: 10, right: 10, showBoxes: true},
            c(Label, {
              font: 'SourceSansPro-Regular',
              color: 'white',
              size: 70,
              sizeMode: 'capHeight',
              text: 'B',
              showBoxes: false
            })
          )
        ),
        c(
          Margin,
          {top: 10, bottom: 10, left: 10, right: 10, showBoxes: true},
          c(Label, {
            font: 'SourceSansPro-Regular',
            color: 'white',
            size: 70,
            sizeMode: 'capHeight',
            text: 'B',
            showBoxes: false
          })
        ),
        c(
          Margin,
          {top: 10, bottom: 10, left: 10, right: 10, showBoxes: true},
          c(Label, {
            font: 'SourceSansPro-Regular',
            color: 'white',
            size: 70,
            sizeMode: 'capHeight',
            text: 'B',
            showBoxes: false
          })
        ),
        c(
          Margin,
          {top: 200, bottom: 10, left: 10, right: 100, showBoxes: true},
          c(Label, {
            font: 'SourceSansPro-Regular',
            color: 'white',
            size: 150,
            sizeMode: 'capHeight',
            text: 'Butter',
            showBoxes: false
          })
        ),
        c(
          Margin,
          {top: 10, bottom: 10, left: 10, right: 10, showBoxes: true},
          c(Label, {
            font: 'SourceSansPro-Regular',
            color: 'white',
            size: 70,
            sizeMode: 'capHeight',
            text: 'B',
            showBoxes: false
          })
        )
      ),
      c(
        ShrinkingFlowBox,
        {mode: 'diagonal', align: 'center'},
        c(
          Button,
          {onInput: log, onClick: log},
          c(
            Margin,
            {top: 10, bottom: 10, left: 10, right: 10, showBoxes: true},
            c(Label, {
              font: 'SourceSansPro-Regular',
              color: 'white',
              size: 70,
              sizeMode: 'capHeight',
              text: 'B',
              showBoxes: false
            })
          )
        )
      )
    )
  );
};
