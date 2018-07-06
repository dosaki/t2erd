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

module.exports.getNearestPointInPerimeter = getNearestPointInPerimeter;
