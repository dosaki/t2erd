# Text 2 ER Diagram
Currently **Work In Progress**!
Don't use this yet.

## To do:
  - [x] Draw tables
  - [ ] Draw relationships
  - [ ] Support colours
  - [ ] Probably better tests
  - [ ] Support custom dimensions / positions

Issues:
  - [x] Fix dimension calculations

# Usage

As a CLI tool it automatically converts the SVG into a PNG. In addition it will print the SVG code to the terminal.
```
./src/t2erd.js -i=/path/to/input.erd -o=/path/to/ouput.png
```

Using as a library:
```javascript
const t2erd = require('./t2erd.js');
const svgString = t2erd(diagramTextHere);
```

# Syntax
## Comments
Comments start with `#` and are ignored by the parser.
```
# Comment
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

## Table Relationships

Table relationships are declared with a table name followed by the cardinality a double dash, the other table cardinality and the table it links to.

They can be declared anywhere even in the middle of table column definitions.


*Borrowed some of the syntax from https://github.com/BurntSushi/erd*


## Example
```
# Users table that only contains login info
[user]
*id
username
hashed_password

# This one contains other information about the user
[user_info]
*id
+user_id
email
bio
date_of_birth
registered_date

user_info 1--1 user

# Posts (a thread starts on a post without a parent)
[post]
*id
+poster
+parent
content
timestamp

post *--1 post
post *--1 user
```
