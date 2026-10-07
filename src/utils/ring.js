/**
 * `n` points evenly spaced on an ellipse, as percentages of a box, starting at the top and going clockwise.
 * Rounded to two decimals so server-rendered and client-rendered markup agree.
 */
export function ringPoints(n, rx = 40, ry = 38) {
  return Array.from({ length: n }, (_, i) => {
    const a = ((360 / n) * i - 90) * (Math.PI / 180);
    return [Number((50 + rx * Math.cos(a)).toFixed(2)), Number((50 + ry * Math.sin(a)).toFixed(2))];
  });
}
