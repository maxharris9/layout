'use strict';

const {c} = require('../../../src/layout');
const Root = require('../../../src/components/root');
const Label = require('../../../src/components/label');
const Margin = require('../../../src/components/margin');
const FlowBox = require('../../../src/components/flow-box');
const Rectangle = require('../../../src/components/rectangle');

module.exports = ({x, y, width, height}) => {
  const showBoxes = true;
  return c(
    Root,
    {x, y, width, height, color: 'white'},
    c(
      FlowBox,
      {
        sizingHorizontal: 'expand',
        sizingVertical: 'expand',
        alignVertical: 'center',
        alignHorizontal: 'left',
        stackChildren: 'horizontal',
        showBoxes,
        color: 'red'
      },
      c(
        FlowBox,
        {
          sizingHorizontal: 'expand',
          sizingVertical: 'expand',
          alignVertical: 'center',
          alignHorizontal: 'left',
          stackChildren: 'vertical',
          showBoxes,
          color: 'blue'
        },
        c(
          FlowBox,
          {
            sizingHorizontal: 'expand',
            sizingVertical: 'shrink',
            alignVertical: 'center',
            alignHorizontal: 'left',
            stackChildren: 'vertical',
            color: 'green',
            showBoxes
          },
          c(
            Margin,
            {
              sizingVertical: 'shrink',
              sizingHorizontal: 'shrink',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              showBoxes
            },
            c(Label, {
              font: 'SourceSerifPro-Regular',
              color: 'black',
              size: 30,
              sizeMode: 'capHeight',
              text: 'First Heading',
              showBoxes
            })
          )
        ),
        c(Rectangle, {
          sizingHorizontal: 'expand',
          sizingVertical: 'expand',
          color: 'rgba(255, 221, 0, 1)',
          topLeft: 0,
          topRight: 0,
          bottomLeft: 0,
          bottomRight: 0,
          showBoxes
        }),
        c(Label, {
          font: 'SourceSerifPro-Regular',
          color: 'black',
          size: 30,
          sizeMode: 'capHeight',
          text: 'Down Here',
          showBoxes
        })
      ),
      c(
        FlowBox,
        {
          sizingHorizontal: 'expand',
          sizingVertical: 'expand',
          alignVertical: 'center',
          alignHorizontal: 'left',
          stackChildren: 'vertical',
          showBoxes,
          color: 'blue'
        },
        c(
          FlowBox,
          {
            sizingHorizontal: 'expand',
            sizingVertical: 'shrink',
            alignVertical: 'center',
            alignHorizontal: 'left',
            stackChildren: 'vertical',
            color: 'red',
            showBoxes
          },
          c(
            Margin,
            {
              sizingVertical: 'shrink',
              sizingHorizontal: 'shrink',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              showBoxes
            },
            c(Label, {
              font: 'SourceSerifPro-Regular',
              color: 'black',
              size: 30,
              sizeMode: 'capHeight',
              text: 'Second Heading',
              showBoxes
            })
          )
        ),
        c(Rectangle, {
          sizingHorizontal: 'expand',
          sizingVertical: 'expand',
          color: 'orange',
          topLeft: 0,
          topRight: 0,
          bottomLeft: 0,
          bottomRight: 0,
          showBoxes
        })
      ),
      c(
        FlowBox,
        {
          sizingHorizontal: 'expand',
          sizingVertical: 'expand',
          alignVertical: 'center',
          alignHorizontal: 'left',
          stackChildren: 'vertical',
          showBoxes,
          color: 'blue'
        },
        c(
          FlowBox,
          {
            sizingHorizontal: 'expand',
            sizingVertical: 'shrink',
            alignVertical: 'center',
            alignHorizontal: 'left',
            stackChildren: 'vertical',
            color: 'red',
            showBoxes
          },
          c(
            Margin,
            {
              sizingVertical: 'shrink',
              sizingHorizontal: 'shrink',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              showBoxes
            },
            c(Label, {
              font: 'SourceSerifPro-Regular',
              color: 'black',
              size: 30,
              sizeMode: 'capHeight',
              text: 'Third Heading',
              showBoxes
            })
          )
        ),
        c(Rectangle, {
          sizingHorizontal: 'expand',
          sizingVertical: 'expand',
          color: 'red',
          topLeft: 0,
          topRight: 0,
          bottomLeft: 0,
          bottomRight: 0,
          showBoxes
        })
      )
    )
  );
};
