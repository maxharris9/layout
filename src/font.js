'use strict';

const opentype = require('opentype.js');

// const POINTS_PER_INCH = 72;
// const UNITS_PER_EM = 2048;

// https://stackoverflow.com/a/26047748
// the canvas default resolution is 96dpi (CSS inches, not based on the actual screen). a scaleFactor of 2 gives 192dpi, 3 is 288dpi
// const fUnitsToPixels = (fUnitValue, pointSize, resolution) =>
//   (fUnitValue * pointSize * resolution) / (POINTS_PER_INCH * UNITS_PER_EM);

const fUnitsToPixels = (value, size) => ((value / -10) * size) / 100;

const getSideBearings = (font, size, character) => {
  // glyph xMax, xMin not defined for spaces
  if (character === ' ' || character === '\n') {
    return {
      left: 0,
      right: 0
    };
  }

  const {xMax, xMin, advanceWidth, leftSideBearing} = font.charToGlyph(
    character
  );

  const rightSideBearing = advanceWidth - (leftSideBearing + xMax - xMin);
  return {
    left: fUnitsToPixels(leftSideBearing, size),
    right: fUnitsToPixels(rightSideBearing, size)
  };
};

function getAdvanceWidth(font, text, size) {
  if (text === '\n') {
    return 0;
  }

  return font.getAdvanceWidth(text, size);
}

function getHorizontalTextMetrics(font, text, size) {
  let xOffsetStart = 0;
  let xOffsetEnd = 0;
  let advanceWidths = [0];

  if (text.length > 0) {
    const firstLabelChar = text[0];
    const lastLabelChar = text[text.length - 1];

    xOffsetStart = getSideBearings(font, size, firstLabelChar).left;
    xOffsetEnd = getSideBearings(font, size, lastLabelChar).right;

    let accum = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const aw = font.getAdvanceWidth(char, size);
      if (i === 0) {
        accum += aw + xOffsetStart;
      } else if (i === text.length - 1) {
        accum += aw + xOffsetEnd;
      } else {
        accum += aw;
      }
      advanceWidths.push(accum);
    }
  }

  return {
    ascender: fUnitsToPixels(font.tables.hhea.ascender, size),
    descender: fUnitsToPixels(font.tables.hhea.descender, size),
    xHeight: fUnitsToPixels(font.tables.os2.sxHeight, size),
    capHeight: fUnitsToPixels(font.tables.os2.sCapHeight, size),
    advanceWidth: getAdvanceWidth(font, text, size),
    xOffsetStart,
    xOffsetEnd,
    advanceWidths
  };
}

function getTextHeight(textMetrics, sizeMode) {
  return textMetrics[sizeMode] * -1;
}

function measureText(renderContext, font, fontName, text, size, sizeMode) {
  renderContext.font = `${size}px ${fontName}`;
  const width = renderContext.measureText(text).width;
  const textMetrics = getHorizontalTextMetrics(font, text, size);
  const {xOffsetStart, xOffsetEnd} = textMetrics;
  return {
    textMetrics,
    width: width + xOffsetStart + xOffsetEnd,
    height: getTextHeight(textMetrics, sizeMode)
  };
}
exports.measureText = measureText;

// NB: opentype.js has font.draw(), but you can't set the color if you use it!
function fillText(
  renderContext,
  {fontName, text, box, xOffsetStart, size, color}
) {
  // renderContext.textBaseline = 'top';
  renderContext.font = `${size}px ${fontName}`;
  renderContext.fillStyle = color;
  renderContext.fillText(text, box.x + xOffsetStart, box.y + box.height);

  // const outlines = font.getPath(
  //   text,
  //   box.x + xOffsetStart,
  //   box.y + box.height,
  //   size
  // );
  // outlines.fill = color;
  // outlines.draw(renderContext);
}
exports.fillText = fillText;

/**
 * makes the font available to canvas
 * @param {*} name - font name
 * @param {*} weight - font weight
 * @param {*} buffer - buffer containing font data
 */
const addFontToCanvasBrowser = async (name, weight, buffer) => {
  const fontName = `${name}-${weight}`;
  const font = new FontFace(fontName, buffer);
  await font.load();
  document.fonts.add(font);

  const options = {};
  return opentype.parse(buffer, options);
};

/**
 * makes the font available to canvas
 * @param {*} name - font name
 * @param {*} weight - font weight
 * @param {*} buffer - buffer containing font data
 */
const addFontToCanvasNode = async (name, weight, buffer) => {
  const options = {};
  return opentype.parse(buffer, options);
};

/**
 * makes the font available to canvas
 * @param {*} name - font name
 * @param {*} weight - font weight
 * @param {*} buffer - buffer containing font data
 */
const addFontToCanvas = async (name, weight, buffer) => {
  const isBrowser =
    typeof window !== 'undefined' && typeof window.document !== 'undefined';

  if (isBrowser) {
    return addFontToCanvasBrowser(name, weight, buffer);
  } else {
    return addFontToCanvasNode(name, weight, buffer);
  }
};
exports.addFontToCanvas = addFontToCanvas;
