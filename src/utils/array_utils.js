const getNext = (array, item, isLooped) => {
  const indexCandidate = array.indexOf(item) + 1;
  return array[indexCandidate >= array.length && isLooped ? 0 : indexCandidate];
};

const getPrevious = (array, item, isLooped) => {
  const indexCandidate = array.indexOf(item) - 1;
  return array[indexCandidate <= 0 && isLooped ? (array.length - 1) : indexCandidate];
};

module.exports = {
  getNext: getNext,
  getPrevious:getPrevious
}
