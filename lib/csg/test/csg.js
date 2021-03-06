'use strict';

const tape = require('tape-catch');
const {clearTerminal, screenshot} = require('../../../test/lib/util');
const {createCanvas} = require('canvas');

const {fromPolygons} = require('../src/csg');

const {renderPolygon} = require('../../geometry-utils/src/util');

clearTerminal();

tape('polygon subtraction', t => {
  const subjectPolygon = fromPolygons([
    [
      [10, 10],
      [110, 10],
      [60, 150]
    ]
  ]);
  const clipPolygon = fromPolygons([
    [
      [10, 100],
      [60, 10],
      [110, 100]
    ]
  ]);
  const polygons = subjectPolygon.subtract(clipPolygon).toPolygons();

  const canvas = createCanvas(600, 600);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, 600, 600);

  for (const polygon of polygons) {
    renderPolygon(ctx, polygon);
  }

  screenshot(
    `${__dirname}/../../../test/csg/csg-subtract`,
    canvas,
    (isSameDimensions, exactMatch) => {
      t.ok(isSameDimensions);
      t.ok(exactMatch);
      t.end();
    }
  );
});

tape('polygon addition', t => {
  const subjectPolygon = fromPolygons([
    [
      [10, 10],
      [110, 10],
      [60, 150]
    ]
  ]);
  const clipPolygon = fromPolygons([
    [
      [10, 100],
      [60, 10],
      [110, 100]
    ]
  ]);
  const polygons = subjectPolygon.union(clipPolygon).toPolygons();

  const canvas = createCanvas(600, 600);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, 600, 600);

  for (const polygon of polygons) {
    renderPolygon(ctx, polygon);
  }

  screenshot(
    `${__dirname}/../../../test/csg/csg-union`,
    canvas,
    (isSameDimensions, exactMatch) => {
      t.ok(isSameDimensions);
      t.ok(exactMatch);
      t.end();
    }
  );
});

tape('polygon intersection', t => {
  const subjectPolygon = fromPolygons([
    [
      [10, 10],
      [110, 10],
      [60, 150]
    ]
  ]);
  const clipPolygon = fromPolygons([
    [
      [10, 100],
      [60, 10],
      [110, 100]
    ]
  ]);
  const polygons = subjectPolygon.intersect(clipPolygon).toPolygons();

  const canvas = createCanvas(600, 600);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, 600, 600);

  for (const polygon of polygons) {
    renderPolygon(ctx, polygon);
  }

  screenshot(
    `${__dirname}/../../../test/csg/csg-intersection`,
    canvas,
    (isSameDimensions, exactMatch) => {
      t.ok(isSameDimensions);
      t.ok(exactMatch);
      t.end();
    }
  );
});
