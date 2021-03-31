---
slug: learn/variable-declaration
title: Variable Declaration
description: Learn how to clarify how your code uses variables in multiple languages.
---

# Variable Declaration

Some languages, especially the ones which use strong data types, require you to **declare** your [variables](/learn/variables/) before you use them.
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

* [Increment and Decrement](/learn/increment-and-decrement/), adding one and subtracting one to the value in a variable.
* [Strings](/learn/strings/), how variables keep track of text.
