# Text 2 ER Diagram
Currently **Work In Progress** but I guess it's ok to use.

## To do:
  - [x] Draw tables
  - [x] Draw relationships
  - [x] Draw self-referential relationships
  - [ ] Support relationship declarations via table aliases
  - [x] Support colours
  - [x] Support custom positions
  - [ ] Support custom table dimensions


# Usage

## CLI
As a CLI tool, it automatically converts the ERD into an SVG and then into a PNG. In addition it will print the SVG code to the terminal.
```
./src/t2erd.js -i=/path/to/input.erd -o=/path/to/ouput.png
```

## Library
Using as a library:
```javascript
const t2erd = require('./t2erd.js');
const svgString = t2erd(diagramTextHere);
```

# Syntax
*Borrowed some of the syntax from https://github.com/BurntSushi/erd*
## Comments
Comments start with `//` and are ignored by the parser.
```
// Comment
```
Anything to the right of a `//` is also a comment
```
Foo // Comment
```

## Tables
Table definitions start with a name between square brackets (`[Table Name]`) and end when the file ends or when another table definition starts.

Column names are any line written under the beginning of a table definition and can be denoted with `*` to mark them as a Primary Key or `+` for a Foreign Key.
```
[Table1Name]
*primary key
column
+foreign key
```

You can optionally specify an alias for the table name (to make it easier for layout definition) by adding any text after a `-` (any whitespace is ignored).
```
[Table1Name] - t1
*primary key
column
+foreign key
```

## Table Styles
Styles can be declared anywhere after a table has been defined and will always belong to the previously defined table.
They always start with a `{` and end with a `}`. Properties must be a key/value pair separated by a `:`. Each key/value pair can be separated by a `;` when inline.

The supported styles, so far are:
```
background: #96c7ff;   // Table background colour
stroke: #385372;       // Table border colour
color: #2c4056;        // Table text colour
```


They can be declared inline:
```
[Table]
{background:red;stroke:green;}
column1
column2
```

And non inline:
```
[Table]
{
  background:red;
  stroke:green;
}
column1
column2
```

A table can have multiple styles definitions as well... if that's your thing. The latest ones will always overwrite the previous if they contain properties that had been defined already.
```
[Table]
{
  background:red;
  stroke:green;
}
column1
{background:blue;} # On second thought, I want blue and I don't feel like updating the definition above.
column2
```

## Table Relationships

Table relationships are declared with a table name followed by the cardinality a double dash, the other table cardinality and the table it links to.
```
table1 *--1 table2
```
Supported cardinality characters are:
* `*` for many
* `1` for one

These can be declared anywhere even in the middle of table column definitions.

## Layouts
You can specify how you want the tables to be organized by declaring a layout.
If your diagram is too complex I'd recommend using this since the automatic position calculations might not organize things the tables in the best way.

Any line starting with a `|` is added to a layout in order of appearance:
```
|p| |
|u|i|
```
Where `|` is the divider between the tables and between a set of `|` is a table name or alias.

Each line of a layout can be separated by any other definition and it'll still belong to the layout

## Example

![Outputted ER Diagram](https://github.com/dosaki/t2erd/blob/master/diagram.png)

```
// Users table that only contains login info
[user] - u
{
  background: #96c7ff;
  stroke: #385372;
  color: #2c4056;
}
*id
username
hashed_password

// This one contains other information about the user
[user_info] - i
{background:#ceffd0;stroke:#4d664e;}
*id
+user_id
email
bio
date_of_birth
registered_date

user_info 1--1 user

// Posts (a thread starts on a post without a parent)
[post] - p
*id
+poster
+parent
content
timestamp

post *--1 post
post *--1 user

|p| |
|u|i|
```
