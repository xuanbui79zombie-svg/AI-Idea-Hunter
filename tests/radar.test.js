import assert from "node:assert/strict";
import test from "node:test";
import { buildRadarPoints, toSvgPoints } from "../src/js/radar.js";

test("radar geometry starts at the top and follows a clockwise seven-axis layout", () => {
  const points = buildRadarPoints([5, 5, 5, 5, 5, 5, 5]);
  assert.equal(points.length, 7);
  assert.deepEqual(points[0], { x: 180, y: 68 });
  assert.ok(points[1].x > 180);
  assert.ok(points[6].x < 180);
});

test("radar geometry scales values from the common center", () => {
  const outer = buildRadarPoints([5, 5, 5]);
  const inner = buildRadarPoints([1, 1, 1]);
  assert.equal(outer[0].y, 68);
  assert.equal(inner[0].y, 157.6);
  assert.equal(toSvgPoints(inner).split(" ").length, 3);
});

test("radar geometry rejects invalid dimensions and values", () => {
  assert.throws(() => buildRadarPoints([1, 2]), /at least three/);
  assert.throws(() => buildRadarPoints([1, 2, 6]), /between 0 and 5/);
  assert.throws(() => buildRadarPoints([1, 2, 3], { radius: 0 }), /positive finite/);
  assert.throws(() => toSvgPoints([]), /at least three/);
});
