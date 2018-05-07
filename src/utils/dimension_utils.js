const pixelWidth = require('string-pixel-width');
const pixelHeight = (string, options) => {
  return pixelWidth(string, options)*2;
};

module.exports = (string, options) => {
  return {
    width: pixelWidth(string, options),
    height: pixelHeight(string, options)
  }
};
