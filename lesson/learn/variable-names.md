---
slug: learn/variable-names
title: Variable Names
description: Learn how multiple programming languages share common patterns for naming variables.
---

# Variable Names

Each variable has a name to help you distinguish its value from all the other values in the program.

For example, you might have both a grocery list and a wedding registry list.
If you're going to send someone to the grocery store, you need to make sure they get the correct list!
If you gave them variable names, you might call one `groceryList` and the other `weddingGifts`.

> Naming things is _hard_.
> People who code for decades will still pause and think about how to best name a variable.

# Variable Name Rules

Most languages follow similar rules for variables names:

* Variable names start with a letter,
* ... or sometimes some other common characters like `_` (underscore) or `$` (dollar sign).
* They continue with letters, numbers, and underscores, usually.
* ... but **do not** contain spaces, tabs, or most other punctuation.

For example, `groceries2` would be an acceptable variable name, but `2groceries` would not.

> In most languages, uppercase and lowercase versions of letters are considered different for the purposes of variable names.

That is, the names `groceries` and `GrOcErIeS` would be names for different variables.

It's uncommon, but in some languages, uppercase and lowercase versions of letters mean the same thing in variable names.
For example, in BASIC, both `groceries` and `GrOcErIeS` would refer to the same variable.

# Variable Name Conventions

Different languages, and their communities, have different conventions for variable names.

* `lastKnownLocation` is an example of "Camel Case", because it has humps like a camel.
  That is, you leave the first word lowercase, and then capitalize the first letter of each word after that.
* `LastKnownLocation` is an example of "Title Case", which is similar, but you capitalize the first word, too.
  It's rare for variables, but is common in other parts of programming.
* `last_known_location` is an example of "Snake Case", because it's low to the ground and stretched out.
  You leave everything lower-cased, and join the words together with underscores.
* `last-known-location` is an example of "Spinal Case", or "Train Case".
  This one is uncommon, as most programming languages don't allow the `-` (hyphen) in variable names.

Wikipedia has a [very thorough article on naming conventions in programming](https://en.wikipedia.org/wiki/Naming_convention_(programming)).

You should research the preferred naming conventions for your language, and then just try to be consistent.

# Next Steps

* [Variable Assignment](/learn/variable-assignment/), setting and updating the value for a variable.
* [Variable Declaration](/learn/variable-declaration/), making it clear which variables your code will use.
