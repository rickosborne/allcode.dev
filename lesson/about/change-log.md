---
title: Change Log
section:
  title: About
  href: "/about/"
description: A running history of changes to allcode.dev.
slug: about/change-log
---

# Change Log

TODO
  ~ Replace `lit-element` and `lit-html` with plain WebComponents.
    They are overkill, and bring in a ton of bloat.
  ~ Major code clean-up and documentation is needed.
  ~ Test suite
  ~ Have `publish` try harder to leave unchanged files in place, to preserve file modification times.

Future Topics
  ~ [What is programming?](/learn/what-is-programming/)
  ~ What is a programming language?
  ~ What is a computer?
  ~ What are syntax and semantics?
  ~ Operators & Operands
  ~ Comparisons
  ~ Control Flow
  ~ Conditionals
  ~ Expressions
  ~ Evaluation
  ~ Precedence
  ~ Re-binding
  ~ Increment & Decrement
  ~ Errors
  ~ Types
  ~ Casting
  ~ Blocks
  ~ Loops
  ~ Counting (for) Loops
  ~ For-Each Loops
  ~ Until Loops
  ~ Break
  ~ Continue
  ~ Infinite Loops
  ~ String Operations
  ~ Functions
  ~ Algorithms
  ~ Search Algorithms
  ~ Bisection Search
  ~ Recursion
  ~ Console Output
  ~ Console Input
  ~ File Output
  ~ File Input
  

2021-03-31
  ~ Split out [Variable Names](/learn/variable-names/), [Variable Assignment](/learn/variable-assignment/), and [Variable Declaration](/learn/variable-declaration/) into their own pages.
  ~ Started [Strings](/learn/strings/), [Booleans](/learn/booleans/), [Constants](/learn/constants/), [Literal Values](/learn/literal-values/), [Numbers](/learn/numbers/).

2021-01-07
  ~ Tweaks to `amble-viewer` layout to make it a little more mobile-friendly.
  ~ Fix change-log dates, because it's 2021, not 2020.
  ~ New settings!
    You can now set your body font style (serif/sans), size, line width, and code viewer color.
  ~ Filled out the [Loop Basics](/learn/loop-basics/) lesson.
  ~ New lesson: [Variables](/learn/variables/).

2021-01-06
  ~ Fixed regression: `highlightWhen` wasn't working for questions — they were all waiting for the answer to be revealed, when some should have shown at the question.
  ~ Added this change log!
  ~ Added the [About](/about/) page.
  ~ Added the [License](/about/license/) page.
  ~ Footer tweaks to accommodate the above.
  ~ New _Settings_ widget!
    For now, it's just the Light/Dark mode selector.
    This should eventually grow to also include language preference.
  - Better font handling for Safari.
    (Which is just a hot mess.)

2021-01-05
  ~ Fixed the busted Safari fullscreen interaction.
    Though, it's still pretty busted because Safari does some really hinky things with its fullscreen API.
    I may just remove the button on Safari for now.
  ~ Fixed the busted syntax-specific highlighting.
  ~ Much better light/dark handling.
    This should set up the ability to force light/dark mode via a setting.
    Also, learned a valuable lesson about `prefers-color-scheme` media queries: making them rely on `var` is much more efficient than duplicating rules.
  ~ Minor cleanup of print colors.
