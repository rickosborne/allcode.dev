---
title: Change Log
section:
  title: About
  href: "/about/"
description: A running history of changes to allcode.dev.
slug: about/change-log
---

# Change Log

2020-01-06
  ~ Identified regression: `highlightWhen` isn't working for questions at the moment — they are all waiting for the answer to be revealed, when some should show at the question.
  ~ Added this change log!
  ~ Added the [About](/about/) page.
  ~ Added the [License](/about/license/) page.
  ~ Footer tweaks to accommodate the above.

2020-01-05
  ~ Fixed the busted Safari fullscreen interaction.
    Though, it's still pretty busted because Safari does some really hinky things with its fullscreen API.
    I may just remove the button on Safari for now.
  ~ Fixed the busted syntax-specific highlighting.
  ~ Much better light/dark handling.
    This should set up the ability to force light/dark mode via a setting.
    Also, learned a valuable lesson about `prefers-color-scheme` media queries: making them rely on `var` is much more efficient than duplicating rules.
  ~ Minor cleanup of print colors.
