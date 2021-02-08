---
slug: learn/variables
title: Variables
description: Learn basic concepts of variables in multiple languages.
---

# Variables

Whether in a program or in any real-life task, you will likely need to keep track of things.
Maybe it's a list of groceries for your next trip to the store.
Or maybe it's jus a mental note to keep track of the name of the person you just met.

> Variables are names for the things your program needs to track.

They are called "variables" because they "vary" — that is, a variable can change as your program runs.

For example, you might create a variable to track your favorite color.
This favorite color might change as you grow older — it varies over time.
That's okay!
Your `favoriteColor` variable will always hold the latest value, whatever it is.

# Parts of a Variable

Variables have only a few parts:

* The **name** of the variable is what you see in the code.

  Example: `favoriteColor` or `groceries`

* The **value** is what you associate with the variable — the thing you're tracking.

  Example: That `favoriteColor` variable might have a value of "blue", or "yellow", etc.

* The **address** is used by the computer to link the **name** and **value**.
  In most modern programming languages, you won't see the address — it's handled behind the scenes for you.

# Variable Names

Each variable has a name to help you distinguish its value from all the other values in the program.

For example, you might have both a grocery list and a wedding registry list.
If you're going to send someone to the grocery store, you need to make sure they get the correct list!
If you gave them variable names, you might call one `groceryList` and the other `weddingGifts`.

> Naming things is _hard_.
> People who code for decades will still pause and think about how best to name a variable.

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

# Variable Assignment

Changing the value of a variable is called **assignment**.
Most languages follow the same convention: the variable name followed by `=` (equals) and the value.

::: walkthrough variable-assignment
:::

In the example above, you see:

* The numeric value `3` assigned to the variable for "count".
* The string (text) value "blue" assigned to the variable for "favorite color".
* The Boolean `false` value assigned to the variable named "hungry now".
  Note that some languages just use `0` (zero) for this, while others have a `false` keyword.

Other things you'll notice:

* Some languages add characters like `$` (dollar sign) to some variables to help identify them.
  For example, BASIC adds one at the end for [string](/learn/strings/) (text) variables.
  Perl puts them at the beginning.
* Pascal uses `:=` for assignment, while most other languages use `=` by itself.
  Some other, more exotic languages use other things like `<-` and more.

# Variable Declaration

Some languages, especially the ones which use strong data types, require you to **declare** your variables before you use them.
That is, they require you to be explicit about the variables you're going to use.

In many cases, this is a safety measure: it helps the computer tell if you've accidentally mis-typed a variable name.
That is, the computer can tell that `vaforiteLocor` is probably a typo.
It's not running spell-check — it knows because you did not declare a variable with that name.

Variable declaration is often accompanied by **initializing** the variable: giving its first value.
The example above could add declarations:

::: walkthrough variable-declaration-and-initialization
:::

In the example above, you see:

* Some languages, like Bash, don't declare variables — you just use them.
* Some languages, like Pascal, divide their declaration (specifying the data type) and their initialization (setting the value).
* Many languages use different words for how they store text values, like `char` and [`string`](/learn/strings/).

# Next Steps

Read more about:

* [Increment and Decrement](/learn/increment-and-decrement/), adding one and subtracting one to the value in a variable.
* [Strings](/learn/strings/), how variables keep track of text.
