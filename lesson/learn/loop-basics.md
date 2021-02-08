---
$schema: "../../publish/LessonFrontMatter-v1.schema.json"
slug: learn/loop-basics
title: Loop Basics
description: Learn basic concepts of loops in multiple languages.
forward:
- href: learn/while-loops
  title: While Loops
- href: learn/for-loops
  title: Counting (for) Loops
---

# Loop Basics

One of the fundamental control structures for programming is the **loop**.

> Loops are used any time the same work must be done over and over, as long as needed.

Loops break up repetition into parts:

* **Initialization**, or **setup**, where you prepare everything you'll need.
* **Body**, the work you want to perform with each repetition.
* **Exit Condition**, or **test**, where you decide whether to **continue** (repeat) or **break** (exit).

In some ways, the exit condition is the most important part of a loop: if your code never tells the loop to stop, the computer will stay in it forever!

# Loop Keywords

Common keywords for loops include:

* [`while`](/learn/while-loops/), which assumes you want to continue until something specific is changed.
  
  For example: "while there is daylight, keep playing ball".
  
* [`forEach`, or just `each`](/learn/for-each-loops/), which repeats the same work on each of some collection of items.
  
  For example: "for each kid going on the field trip, make sure they have a signed permission slip".
  
* [`for`](/learn/for-loops/), which repeats a specific number of times.
  
  For example: "for the next five nights, pack a lunch for the next day".

There are other variations, as well.
Each keyword has different ways of working with their initializations and exit conditions.

# Everyday Examples

You already use loops in your life:

* Tasks like mowing the lawn have repetitive parts: go forward, turn, repeat until all the grass is cut.
  The prep you have to do before you start is the **loop initialization**.

* You start most days with the same routine: sleep, wake up, eat breakfast, etc.
  Each morning is a little like a **loop body**.

* When you practice something like a musical instrument or sports, you repeat it, improving each time.
  You might eventually move on to a new skill, or give up and try something else.
  These decisions, to keep going or move on, are like **loop exit conditions**.

# Loop Examples

This example counts from 1 to 5 using a loop with the `while` keyword.
It doesn't do anything with the count for now.

Most languages have more natural and specific syntax when counting with loops.
The `while` keyword isn't the best for counting, but it has the simplest syntax.

::: walkthrough counting-with-while-loop
:::

As you can see in all the languages above:

* A variable is used to hold the count.
* That variable is **initialized** with a value of `1`.
* The `while` keyword evaluates an **exit condition** at the start of each time through (iteration of) the loop.
* The condition [evaluates](/learn/expression-evaluation/) to `true` as long as the count is less than or equal to `5`.
  This causes the loop to keep repeating.
* The **loop body** [increments](/learn/increment-and-decrement/) the counting variable, adding `1` to it.

# Next Steps

Read more about:

* [`while` Loops](/learn/while-loops/), and their `do-while` counterpart.
* [`for-each` Loops](/learn/for-each-loops/), for repeating work on a collection of items.
* [`for` Loops](/learn/for-loops/), for counting.
* [Variables](/learn/variables/), which help you keep track of things in your loops.
* [Boolean Expressions](/learn/boolean-expressions/), which loops use to evaluate exit conditions.
* [Expression Evaluation](/learn/expression-evaluation/), the rules for how exit conditions are tested.
* [Blocks](/learn/blocks/), grouped and related sections of code.
* [Increment and Decrement](/learn/increment-and-decrement/), adding one and subtracting one.
