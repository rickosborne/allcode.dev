---
slug: learn/constants
title: Constants
description: Learn how multiple programming languages handle values that are known when the code is written, and will never change.
---

# Constants

Values in your running program will often need to change over time.
When you give a value a name, so you can keep track of it, it becomes a [variable](/learn/variables/).
You might also want to give a value a name even if it will never change, because it's used in several places, or because using the name actually makes your code easier to read than using the exact value.

> **Constants** are named values which never change at run time.

In most languages, constants look and work similarly to variables, even though their value never changes.
Behind the scenes the interpreter or compiler may do some optimization because it knows the value is constant, but that's usually hidden away at coding time.

One word you'll often hear used with or instead of "constant" is **immutable**.
This is just a fancy way of saying "doesn't change".
All constants are immutable.

::: walkthrough scalar-constants
:::

In the example above, you see:

* Constants follow the same rules as variables.
* Because they are values defined in code, most constants are [scalar literals](/learn/literal-values/).
* A common convention across many languages is to give constants `UPPER_SNAKE_CASE` names.

# Next Steps

* [Strings](/learn/strings/) are used for human-readable text values.
* [Booleans](/learn/booleans/) are used for true/false values.
* [Numbers](/learn/numbers/) are used for numeric values, such as financials or scientific data.
