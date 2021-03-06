'use strict';

const fs = require('fs');

const {c} = require('../../../src/layout');
const Root = require('../../../src/components/root');
const Label = require('../../../src/components/label');
const Margin = require('../../../src/components/margin');
const FlowBox = require('../../../src/components/flow-box');

const {Text, createTextContinuation} = require('../../../src/components/text');

const createHyphenator = require('hyphen');
const hyphenationPatternsEnUs = require('hyphen/patterns/en-us');

const hyphenateEnglish = rawText => {
  const hyphenChar = '\uFFFF';
  const hyphen = createHyphenator(hyphenationPatternsEnUs, {hyphenChar});
  const text = hyphen(rawText);

  return {hyphenChar, rawText, text};
};

const exampleText = hyphenateEnglish(
  fs.readFileSync('./test/fixtures/jobs-long.txt', 'utf-8')
);

module.exports = ({x, y, width, height}) => {
  const textContinuation = createTextContinuation(exampleText);
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
        c(Text, {
          lineHeight: 20,
          font: 'SourceSerifPro-Regular',
          size: 12,
          sizeMode: 'capHeight',
          textContinuation,
          operation: 'add',
          overflow: 'continue',
          color: 'black',
          showBoxes,
          continuationId: 0,
          groupId: 'Steve Jobs quotes'
        }),
        c(
          Margin,
          {
            sizingVertical: 'shrink',
            sizingHorizontal: 'shrink',
            top: 200,
            bottom: 0,
            left: 0,
            right: 0,
            showBoxes
          },
          c(Label, {
            font: 'SourceSerifPro-Regular',
            color: 'black',
            size: 40,
            sizeMode: 'capHeight',
            text: 'Down Here',
            showBoxes
          })
        )
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
        c(
          Margin,
          {
            sizingVertical: 'expand',
            sizingHorizontal: 'expand',
            top: 20,
            bottom: 20,
            left: 20,
            right: 20,
            showBoxes
          },
          c(Text, {
            color: 'black',
            lineHeight: 20,
            font: 'SourceSerifPro-Regular',
            size: 12,
            sizeMode: 'capHeight',
            textContinuation: textContinuation,
            operation: 'add',
            overflow: 'continue',
            showBoxes,
            continuationId: 1,
            groupId: 'Steve Jobs quotes'
          })
        )
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
        c(Text, {
          lineHeight: 20,
          font: 'SourceSerifPro-Regular',
          size: 12,
          sizeMode: 'capHeight',
          textContinuation: textContinuation,
          operation: 'add',
          overflow: 'continue',
          color: 'black',
          showBoxes,
          continuationId: 2,
          groupId: 'Steve Jobs quotes'
        })
      )
    )
  );
};
