const COMMENT_SYMBOL = '//';
const RELATIONSHIP_LINE = '--';
const RELATIONSHIP_LINE_REGEX = / (\*|\d+)--(\*|\d+) /;
const TABLE_CHARACTER = {
  start: '[',
  end: ']'
};
const KEY_INDICATOR = {
  primary: '*',
  foreign: '+'
}
const LAYOUT_LINE = '|';
const TABLE_ALIAS_SEPARATOR = /-(?![^\[]*])/;
const STYLING_START = '{';
const STYLING_END = '}';
const STYLING_PROPERTY_DELIMITER = ';';
const STYLING_PROPERTY_KEY_VALUE_DELIMITER = ':';

const isTableNameDefinition = (rawLine) => {
  const line = rawLine.trim();
  const splitDefinition = line.split(TABLE_ALIAS_SEPARATOR)[0].trim();
  return splitDefinition.startsWith(TABLE_CHARACTER.start) && splitDefinition.endsWith(TABLE_CHARACTER.end);
}

const findRelationshipLine = (rawLine) => {
  const line = rawLine.trim();
  const match = line.match(RELATIONSHIP_LINE_REGEX);
  return match ? match[0] : null;
}

const isCommentLine = (rawLine) => {
  const line = rawLine.trim();
  return (line.startsWith(COMMENT_SYMBOL)) || (line === "");
}

const isLayoutLine = (rawLine) => {
  const line = rawLine.trim();
  return LAYOUT_LINE === line[0];
}

const isRelationship = (rawLine) => {
  const line = rawLine.trim();
  const relationshipLine = findRelationshipLine(rawLine);

  return relationshipLine !== null;
}

const isInlineStyleDefinition = (rawLine, currentTable) => {
  const line = rawLine.trim();
  return line.startsWith(STYLING_START)
      && line.endsWith(STYLING_END)
      && (currentTable === 0 || !!currentTable);
}

const isStyleStartDefinition = (rawLine, currentTable, inStylingDefinition) => {
  const line = rawLine.trim();
  return line.startsWith(STYLING_START)
      && !isInlineStyleDefinition(rawLine, currentTable)
      && !inStylingDefinition
      && (currentTable === 0 || !!currentTable);
}

const isStyleEndDefinition = (rawLine, currentTable, inStylingDefinition) => {
  const line = rawLine.trim();
  return line.startsWith(STYLING_END)
      && !isInlineStyleDefinition(rawLine, currentTable)
      && inStylingDefinition
      && (currentTable === 0 || !!currentTable);
}

const isStyleProperty = (rawLine, inStylingDefinition) => {
  const line = rawLine.trim();
  return inStylingDefinition
    && line.endsWith(STYLING_PROPERTY_DELIMITER)
    && line.indexOf(STYLING_PROPERTY_KEY_VALUE_DELIMITER) !== -1;
}

const isColumn = (rawLine, currentTable, inStylingDefinition) => {
  const line = rawLine.trim();
  return !inStylingDefinition
      && !isTableNameDefinition(line)
      && !isRelationship(line)
      && !isLayoutLine(line)
      && !isCommentLine(line)
      && (currentTable === 0 || !!currentTable);
}

const stripComments = (rawLine) => {
  return rawLine.split(COMMENT_SYMBOL)[0].trim()
}


module.exports.isTableNameDefinition = isTableNameDefinition;
module.exports.findRelationshipLine = findRelationshipLine;
module.exports.isCommentLine = isCommentLine;
module.exports.isRelationship = isRelationship;
module.exports.isColumn = isColumn;
module.exports.isLayoutLine = isLayoutLine;
module.exports.stripComments = stripComments;
module.exports.isInlineStyleDefinition = isInlineStyleDefinition;
module.exports.isStyleStartDefinition = isStyleStartDefinition;
module.exports.isStyleEndDefinition = isStyleEndDefinition;
module.exports.isStyleProperty = isStyleProperty;
module.exports.constants = {
  COMMENT_SYMBOL: COMMENT_SYMBOL,
  RELATIONSHIP_LINE: RELATIONSHIP_LINE,
  RELATIONSHIP_LINE_REGEX: RELATIONSHIP_LINE_REGEX,
  TABLE_CHARACTER: TABLE_CHARACTER,
  KEY_INDICATOR: KEY_INDICATOR,
  LAYOUT_LINE,
  TABLE_ALIAS_SEPARATOR,
  STYLING_START,
  STYLING_END,
  STYLING_PROPERTY_DELIMITER,
  STYLING_PROPERTY_KEY_VALUE_DELIMITER
};
