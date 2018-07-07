// See original in Lua http://stackoverflow.com/questions/20453545/how-to-find-the-nearest-point-in-the-perimeter-of-a-rectangle-to-a-given-point

const clamp = (n, lower, upper) => {
  return Math.max(lower, Math.min(upper, n));
}

const getNearestPointInPerimeter = (l, t, w, h, x, y) => {
  const r = l + w;
  const b = t + h;

  const newX = clamp(x, l, r);
  const newY = clamp(y, t, b);

  const dl = Math.abs(newX - l);
  const dr = Math.abs(newX - r);
  const dt = Math.abs(newY - t);
  const db = Math.abs(newY - b);

  var m = Math.min(dl, dr, dt, db);

  return m === dt ? [newX, t] : m === db ? [newX, b] : m === dl ? [l, newY] : [r, newY];
}

const lineSlope = (coords1, coords2) => {
  return (coords1.y - coords2.y) / (coords1.x - coords2.x);
}

const isMostlyVertical = (coords1, coords2, tolerance) => {
  const slope = lineSlope(coords1, coords2);
  return slope === Infinity || Math.abs(slope) >= tolerance;
}

const isMostlyHorizontal = (coords1, coords2, tolerance) => {
  return Math.abs(lineSlope(coords1, coords2)) <= tolerance;
}

const isMostlyDiagonal = (coords1, coords2, tolerance) => {
  const slope = lineSlope(coords1, coords2);
  if(tolerance === 0){
    return slope === 1;
  }

  return 1 - Math.abs(slope) <= tolerance && 1 - Math.abs(slope) >= -1*tolerance;
}

module.exports.getNearestPointInPerimeter = getNearestPointInPerimeter;
module.exports.slope = lineSlope;
module.exports.orientation = {
  isMostlyVertical: isMostlyVertical,
  isMostlyHorizontal: isMostlyHorizontal,
  isMostlyDiagonal: isMostlyDiagonal
};
