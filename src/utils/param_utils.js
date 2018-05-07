const merge = require('deepmerge');

const resolveParams = (params, defaults) => {
  let _params = !params ? {} : params;
  let _defaults = !defaults ? {} : defaults;

  return merge(_defaults, _params);
};

const isAuto = (prop) => {
  return !!prop && prop.toLowerCase() === "auto";
}


module.exports.resolveParams = resolveParams;
module.exports.isAuto = isAuto;
