---
slug: learn/numbers
title: Numbers
description: Learn how numbers are represented and managed in multiple programming languages.
---

# Numbers

Numeric [literals](/learn/literal-values/) are very common in source code.
It's uncommon to see code without _any_ numbers!

Many languages make distinctions between integers (counting numbers) and real numbers (with decimal points and fractional parts).
Some languages, such as JavaScript, abstract away these differences, while others, like C, have _many_ different options for working with numbers.

When working in base-10, which is by far the most common, most numeric literals are easy to read and understand:

::: walkthrough number-literals
:::

In the example above, you see:

* Four different number literals, each assigned to a variable.
* Some languages use suffixes like `L` for long (large) values, or `F` for floating-point (fractional) values.
* All modern languages allow exponential (scientific) notation for number values.

Many languages also allow you to work with numbers in bases other than 10.
For example, CSS numbers are commonly represented in base-16 (hexadecimal) because they are actually easier to read and understand in that format.
Common bases include:

* **binary**, base-2, for very low-level hardware code
* **octal**, base-8, for older hardware, or hardware designed to run on very low power or resources
* **decimal**, base-10, for financial and scientific, and every-day human-readable uses
* **hexadecimal**, base-16, for large, machine-readable numbers
* **base64**, uncommon in code, but quite common in text-based Internet services, like HTTP and email

# Next Steps

* [Variables](/learn/variables/) keep track of your values.
* [Constants](/learn/constants/) are fixed values, often numbers, which never change when your code is run.
