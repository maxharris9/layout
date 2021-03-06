'use strict';

const Component = require('../component');
const {insertSorted} = require('../geometry');
const {fromPolygons} = require('../../lib/csg/src/csg');
const {measureText, fillText} = require('../font');
const encode = require('hashcode').hashCode;
const {redo} = require('../util');

function createTextContinuation({hyphenChar, rawText, text}) {
  const textHash = encode().value(rawText);

  const tracking = {
    syllableCounter: 0,
    tokenCursor: 0,
    lastLineVisited: 0,
    lastContinuationIdVisited: -1
  };

  return () => ({
    text,
    hyphenChar,
    textHash,
    tracking
  });
}

function split(
  renderContext,
  input,
  font,
  fontName,
  size,
  sizeMode,
  hyphenChar
) {
  // first split by newlines, ensuring that the newlines make it through as tokens, then split on whitespace
  const words = input
    .split(/(\n)/)
    .reduce((accum, current) => accum.concat(current.split(/[ [\]/\\]+/)), []);

  let result = [];
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (!word) {
      continue;
    }
    const syllables = word.split(hyphenChar);

    if (syllables.length > 1) {
      const measurements = syllables.map(syl => {
        const {textMetrics, width, height} = measureText(
          renderContext,
          font,
          fontName,
          syl,
          size,
          sizeMode
        );
        return {
          width: width - textMetrics.xOffsetStart - textMetrics.xOffsetEnd,
          height,
          textMetrics
        };
      });
      result.push({token: syllables, type: 'syllables', measurements});
    } else {
      const {textMetrics, width, height} = measureText(
        renderContext,
        font,
        fontName,
        word,
        size,
        sizeMode
      );
      result.push({token: word, type: 'word', width, height, textMetrics});
    }
  }
  return result;
}

function polyToBoundingBoxX(polygon) {
  let minX;
  let maxX = 0;

  for (let {x} of polygon) {
    if (minX === undefined || x < minX) {
      minX = x;
    } else if (x > maxX) {
      maxX = x;
    }
  }

  return [minX, maxX];
}

function polysToBoundingBox(polygons) {
  let minX;
  let maxX = 0;
  let minY;
  let maxY = 0;

  for (let polygon of polygons) {
    for (let {x, y} of polygon) {
      if (minX === undefined || x < minX) {
        minX = x;
      } else if (x > maxX) {
        maxX = x;
      }

      if (minY === undefined || y < minY) {
        minY = y;
      } else if (y > maxY) {
        maxY = y;
      }
    }
  }

  return [minX, minY, maxX, maxY];
}

function getLineBoxes(lineIndex, stepHeight, width, polygons) {
  let boxes = [];
  const y = lineIndex * stepHeight;
  const maxY = y + stepHeight;
  const linePolygon = fromPolygons([
    [
      [0, y],
      [width, y],
      [width, maxY],
      [0, maxY]
    ]
  ]);
  const splitPolys = polygons.intersect(linePolygon).toPolygons();

  // as we get the horizontal boxes, get the bounding x coords
  const row = [];
  for (const splitPolygon of splitPolys) {
    if (splitPolygon.length < 3) {
      continue;
    } // filter out points, lines

    const [minX, maxX] = polyToBoundingBoxX(splitPolygon, y, maxY);

    if (minX === maxX) {
      continue;
    }

    insertSorted(row, minX); // ensure that each box will be sorted by the x coord
    insertSorted(row, maxX);
  }

  for (let j = 0; j < row.length - 1; j += 2) {
    const minX = row[j];
    const maxX = row[j + 1];

    boxes.push({
      startX: minX,
      endX: maxX,
      startY: y,
      endY: maxY,
      lineIndex: lineIndex
    });
  }

  return boxes;
}

function getLineBox(lineIndex, stepHeight, width) {
  const startY = lineIndex * stepHeight;
  return {
    startX: 0,
    endX: width,
    startY,
    endY: startY + stepHeight,
    lineIndex: lineIndex
  };
}

function typesetLine(
  {startX, endX, startY, endY, lineIndex},
  tokens,
  tracking,
  lineHeight,
  spaceWidth,
  dashWidth,
  showBoxes
) {
  const finalX = startX;
  const finalY = startY;
  const finalW = endX - startX;
  const finalH = endY - startY;

  let tempWidth = 0;

  let result = [];
  let debugBoxes = [];

  if (showBoxes) {
    debugBoxes.push({
      color: 'teal',
      x: finalX,
      y: finalY,
      width: finalW,
      height: finalH
    });
  }

  while (tempWidth < finalW) {
    const token = tokens[tracking.tokenCursor];
    if (!token) {
      break;
    }
    const previousToken =
      tracking.tokenCursor > 0 ? tokens[tracking.tokenCursor - 1] : {token: ''};

    if (token.token === '\n') {
      tracking.tokenCursor++; // don't render the newline token
      if (previousToken.token === '\n' && lineIndex === 0) {
        tracking.lastLineVisited = lineIndex;
        continue;
      } else {
        tracking.lastLineVisited = lineIndex + 1;
        break; // skip to the next box
      }
    }

    if (token.type === 'word') {
      if (tempWidth > finalW - token.width) {
        tracking.lastLineVisited = lineIndex;
        break;
      }

      result.push({
        text: token.token,
        x: finalX + tempWidth,
        y: finalY,
        xOffsetStart: token.textMetrics.xOffsetStart,
        xOffsetEnd: token.textMetrics.xOffsetEnd,
        height: token.height
      });

      if (showBoxes) {
        debugBoxes.push({
          color: 'rgba(200, 200, 200, 0.6)',
          x: finalX + tempWidth,
          y: finalY,
          width: token.width,
          height: lineHeight
        });
      }

      tempWidth += token.width + spaceWidth;
      tracking.tokenCursor++;
    } else {
      // assume token.type is 'syllables'
      while (token.token[tracking.syllableCounter]) {
        const syl = token.token[tracking.syllableCounter];
        const meas = token.measurements[tracking.syllableCounter];
        const yyy = finalY;

        if (tempWidth + meas.width + dashWidth <= finalW) {
          if (showBoxes) {
            debugBoxes.push({
              color: 'rgba(127, 63, 195, 0.6)',
              x: finalX + tempWidth,
              y: finalY,
              width: meas.width,
              height: lineHeight
            });
          }

          result.push({
            text: syl,
            x: finalX + tempWidth,
            y: yyy,
            xOffsetStart: 0,
            xOffsetEnd: 0,
            height: token.measurements[tracking.syllableCounter].height
          });

          tempWidth += meas.width;
          tracking.syllableCounter++;
        } else if (tracking.syllableCounter > 0) {
          result.push({
            text: '-',
            x: finalX + tempWidth,
            y: yyy,
            xOffsetStart: 0,
            xOffsetEnd: 0,
            height: token.measurements[tracking.syllableCounter].height
          });

          tracking.lastLineVisited = lineIndex;
          break;
        } else {
          tracking.lastLineVisited = lineIndex;
          break;
        }
      }

      if (tracking.syllableCounter >= token.token.length) {
        tracking.syllableCounter = 0;
        tracking.tokenCursor++;
        tempWidth += spaceWidth;
      } else {
        tracking.lastLineVisited = lineIndex;
        break;
      }
    }
  }

  return {result, debugBoxes};
}

function layoutText(props, {cache, renderContext, box, depth, path}) {
  const {width, height} = box;

  const {
    size,
    sizeMode,
    polygons,
    overflow,
    font,
    lineHeight = 20,
    showBoxes,
    textContinuation
  } = props;
  const {text, hyphenChar, tracking} = textContinuation();

  if (typeof props.continuationId !== 'undefined') {
    if (tracking.lastContinuationIdVisited - props.continuationId === -1) {
      tracking.lastContinuationIdVisited++;
    } else {
      return;
    }
  }

  let tokens = [];
  {
    const hashThis = Object.assign({}, props, {depth, path});
    const tokenHash = encode().value(hashThis);
    const cachedState = cache[tokenHash];
    if (cachedState) {
      tokens = cachedState.tokens;
    } else {
      tokens = split(
        renderContext,
        text,
        renderContext.fonts[font],
        font,
        size,
        sizeMode,
        hyphenChar
      );
      if (!cache[tokenHash]) {
        cache[tokenHash] = {};
      }
      cache[tokenHash].tokens = tokens;
    }
  }

  tracking.lastLineVisited = 0;

  const f = renderContext.fonts[font];
  const dashMeasurements = measureText(
    renderContext,
    f,
    font,
    '-',
    size,
    sizeMode
  );

  const dashWidth = dashMeasurements.width;
  const spaceWidth = measureText(renderContext, f, font, ' ', size, sizeMode)
    .width;

  let maxY = 0;

  let lineIndex = 0;
  let finalBoxes = [];
  let _debugBoxes = [];

  if (polygons) {
    const textHeight = 1e6; // TODO: get rid of this?!
    const framePolygons = fromPolygons([
      [
        [0, 0],
        [width, 0],
        [width, textHeight],
        [0, textHeight]
      ]
    ]);
    let foo = framePolygons['subtract'](polygons);

    let [, , , maxYY] = polysToBoundingBox(foo.toPolygons());
    maxY = maxYY;
    for (;;) {
      const lineBoxes = getLineBoxes(lineIndex, lineHeight, width, foo);
      for (let x = 0; x < lineBoxes.length; x++) {
        const {result, debugBoxes} = typesetLine(
          lineBoxes[x],
          tokens,
          tracking,
          lineHeight,
          spaceWidth,
          dashWidth,
          showBoxes
        );

        // keep these next two things seprate from each other. finalBoxes are
        // used to lay the words out, so if these two were stored together, the
        // debug layout view would would have jumbled words
        finalBoxes.push(...result);
        _debugBoxes.push(...debugBoxes);
      }

      const currentY = lineIndex * lineHeight;
      if (currentY > maxY) {
        break;
      }
      if (tracking.tokenCursor === tokens.length) {
        maxY = currentY + lineHeight;
        break;
      }
      lineIndex++;
    }
  }

  if (overflow !== 'clip') {
    for (;;) {
      const subLineBox = getLineBox(lineIndex, lineHeight, width);
      const {result, debugBoxes} = typesetLine(
        subLineBox,
        tokens,
        tracking,
        lineHeight,
        spaceWidth,
        dashWidth,
        showBoxes
      );

      finalBoxes.push(...result);
      _debugBoxes.push(...debugBoxes);

      const currentY = lineIndex * lineHeight;

      if (
        !props.autoSizeHeight &&
        currentY >= height - lineHeight - dashMeasurements.height
      ) {
        break;
      }
      if (tracking.tokenCursor === tokens.length) {
        maxY = currentY + lineHeight;
        break;
      }
      lineIndex++;
    }
  }

  const finalHeight = maxY - lineHeight + dashMeasurements.height;
  if (props.autoSizeHeight && box.height === 0) {
    box.height = finalHeight;
  }

  return {
    box,
    tokens,
    finalBoxes,
    debugBoxes: _debugBoxes
  };
}

class Text extends Component {
  constructor(props) {
    super(props);
    this.childBoxes = [];
    this.debugBoxes = [];
    this.finalBoxes = [];
  }

  size(
    props,
    {
      sizing,
      parentBox,
      cache,
      renderContext,
      expandSizeDeps,
      shrinkSizeDeps,
      component,
      redoList,
      collectSizeDone,
      depth,
      path
    }
  ) {
    if (sizing !== 'expand') {
      return;
    }
    expandSizeDeps.addNode(component.name, component);

    if (props.autoSizeHeight && this.box.width === 0) {
      redoList.push(redo(component, shrinkSizeDeps));
    }

    if (props.autoSizeHeight) {
      this.box.width = parentBox.width;
    } else {
      this.box = {
        width: parentBox.width,
        height: parentBox.height
      };
    }

    const blop = layoutText(props, {
      cache,
      renderContext,
      box: this.box,
      depth,
      path
    });
    if (blop) {
      const {tokens, finalBoxes, debugBoxes} = blop;
      this.tokens = tokens;

      if (finalBoxes.length > 0) {
        this.finalBoxes = finalBoxes;
      }
      if (debugBoxes.length > 1) {
        // TODO: this is jacked
        this.debugBoxes = debugBoxes;
      }
    }

    collectSizeDone(props.groupId, props.continuationId, () => {
      const blop = layoutText(props, {
        cache,
        renderContext,
        box: this.box,
        depth,
        path
      });
      if (blop) {
        const {tokens, finalBoxes, debugBoxes} = blop;
        this.tokens = tokens;
        if (finalBoxes.length > 0) {
          this.finalBoxes = finalBoxes;
        }
        if (debugBoxes.length > 1) {
          // TODO: this is jacked
          this.debugBoxes = debugBoxes;
        }
      }
    });
  }

  position(props, {parentBox}) {
    this.box.x = parentBox.x;
    this.box.y = parentBox.y;
  }

  render({font, size, color, showBoxes = false}, {renderContext}) {
    renderContext.beginPath();
    if (showBoxes) {
      for (let {color, x, y, width, height} of this.debugBoxes) {
        renderContext.strokeStyle = color;
        renderContext.strokeRect(this.box.x + x, this.box.y + y, width, height);
      }
    }

    for (let tempy of this.finalBoxes) {
      const {text, x, y, xOffsetStart, height} = tempy;
      const box = {
        x: this.box.x + x,
        y: this.box.y + y,
        height
      };

      fillText(renderContext, {
        fontName: font,
        text,
        box,
        xOffsetStart,
        size,
        color
      });
    }

    if (showBoxes) {
      renderContext.setLineDash([10, 10]);
      renderContext.strokeStyle = 'orange';
      renderContext.strokeRect(
        this.box.x,
        this.box.y,
        this.box.width,
        this.box.height
      );
    }
  }

  sizingVertical() {
    return 'expand';
  }
  sizingHorizontal() {
    return 'expand';
  }
}

module.exports = {Text, createTextContinuation};
