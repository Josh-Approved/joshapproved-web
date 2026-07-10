---
title: "How you're tracked, and when it stops being for you"
description: "Almost every app and website records what you look at and tap. Here's how that works in plain terms, the fair reason it exists, and where it turns against you."
dek: "Almost every app and website records what you look at and tap. Here's how it actually works, the fair reason it exists, and the point where it stops being for you."
order: 1
updated: "2026-07-10"
apps: ["grocery-list", "tend", "private-ai-summary"]
---

Open almost any app or website and, before you've done anything, it has already started taking notes. Which screen you landed on. How long you stayed. What you tapped, what you scrolled past, where your thumb hovered and didn't commit. The page you were on when you closed it.

This is normally done with tools you'd recognize by name if you worked in tech and probably wouldn't otherwise: Google Analytics, Amplitude, Mixpanel, and a dozen others like them. They're not exotic. Adding one is a few lines of code, it's usually free to start, and it's so standard that shipping an app without one is the unusual choice. The default state of the software you use is that it watches you.

## The fair version of why this exists

I want to be fair to the other side, because I've watched it up close.

When you're building something, you genuinely cannot see what people do with it. You watch ten friends use it and learn a lot; you ship to ten thousand strangers and you're blind again. Analytics is the instrument that gives that sight back. Used well, it answers useful questions: Where do people give up? Which step is confusing enough that half of them quit? Did the change I just shipped make things better or worse?

I've watched these tools find a screen where most people got stuck, watched it get fixed, and watched the frustration disappear. That's a real, good use. Most of the people adding analytics believe, accurately at first, that they're doing it to make the product better for you.

## Where it stops being for you

The turn is rarely a decision anyone makes out loud.

The same recording that tells you "people get stuck here" also tells you "people who do X are worth more money." Once a company can measure engagement, it's under enormous pressure to increase engagement, because engagement is what its growth is graded on. So the question mutates. It starts as "where do users struggle?" and slides to "which notification gets them back?" and "which screen order makes them spend more?" and "what's the smallest nudge that keeps them here longer?"

Nobody has to be cynical for this to happen. The instrument that was pointed at your problems gets turned around and pointed at your behavior. And because the data is collected continuously and kept, "we wanted to help you" and "we want you to spend more time here" run through the same pipe. From the outside you can't tell which one you're getting.

There's a second cost that's easy to miss: the data doesn't just sit there. It's stored, often tied to an identifier for you specifically, sometimes shared with other companies, and it survives every future change of owner, policy, and intention. You consented, technically, to a version of this you were never actually shown.

## What I do instead

My apps don't have analytics in them. Not a stricter analytics, not anonymized analytics. None.

That has a real cost and it lands on me: I'm partly blind. I don't know which feature you use most. I don't get a chart when something confuses you. I find out the slower, older way. You email me, or you don't come back and I have to think hard about why. That's a fair price, and the burden of being a little blind belongs on me, not on you.

So your data stays with you. There's no server collecting a record of what you did, because there's no server. No stored profile to leak, sell, or hand over, and no database that changes meaning the day a company is acquired. There is no company.

You don't have to take my word for any of this. The apps are open source. If you want to confirm that none of this is being recorded, the code is right there, and so is a person whose name is on it.
