const COMMENT_CHARACTER = '#';
const RELATIONSHIP_LINE = "--";
const RELATIONSHIP_LINE_REGEX = / (\*|\d*)--(\*|\d*) /;
const TABLE_CHARACTER = {
  start: '[',
  end: ']'
};
const KEY_INDICATOR = {
  primary: '*',
  foreign: '+'
}

const isTableNameDefinition = (rawLine) => {
  const line = rawLine.trim();
  return line.startsWith(TABLE_CHARACTER.start) && line.endsWith(TABLE_CHARACTER.end);
}

const findRelationshipLine = (rawLine) => {
  const line = rawLine.trim();
  const match = line.match(RELATIONSHIP_LINE_REGEX);
  return match ? match[0] : null;
}

const isCommentLine = (rawLine) => {
  const line = rawLine.trim();
  return (COMMENT_CHARACTER === line[0]) || (line === "");
}

const isRelationship = (rawLine) => {
  const line = rawLine.trim();
  const relationshipLine = findRelationshipLine(rawLine);

  return relationshipLine !== null;
}

const isColumn = (rawLine, currentTable) => {
  const line = rawLine.trim();
  return !isTableNameDefinition(line)
      && !isRelationship(line)
      && currentTable !== null;
}


module.exports.isTableNameDefinition = isTableNameDefinition;
module.exports.findRelationshipLine = findRelationshipLine;
module.exports.isCommentLine = isCommentLine;
module.exports.isRelationship = isRelationship;
module.exports.isColumn = isColumn;
module.exports.constants = {
  COMMENT_CHARACTER: COMMENT_CHARACTER,
  RELATIONSHIP_LINE: RELATIONSHIP_LINE,
  RELATIONSHIP_LINE_REGEX: RELATIONSHIP_LINE_REGEX,
  TABLE_CHARACTER: TABLE_CHARACTER,
  KEY_INDICATOR: KEY_INDICATOR
};