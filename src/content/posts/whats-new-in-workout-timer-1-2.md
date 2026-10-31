---
title: "What's new in Workout Timer: group classes, cue volume, and a one-tap restart"
description: "Workout Timer 1.2 adds class mode (beta) for running one workout across a room of phones, a volume setting for the app's own cues, and a Restart button on the Done screen. Free on iPhone and Android, with no paywall, no ads, no tracking, and no accounts."
dek: "Most of what changed in the last few releases started as a message from someone who uses the app."
app: "free-workout-timer"
kind: "update"
published: "2026-10-31"
---

Workout Timer is an interval and Tabata timer for iPhone and Android. Set your work and rest, press start, and put the phone down. No paywall. No ads. No tracking. No accounts.

Version 1.2 is out now on both stores, and the 3 biggest changes in it were not my ideas. They came from people using the app who took a minute to tell me what was missing.

## Why your requests decide what gets built

Workout Timer has no analytics in it. I can't see which screens you open, how long your workouts run, or which features get used. That is on purpose: your data stays with you, and I don't collect it. The trade-off is that I have fewer ways to learn what's working, so I depend on the people who use the app to tell me. The Send feedback button in the app comes straight to me.

Here is what came out of that inbox lately.

## Run a group class (beta)

<figure class="shots">
  <img src="/assets/blog/workout-timer-1-2/class-setup.webp" width="600" height="1304" loading="lazy" decoding="async" alt="The Class mode screen in Workout Timer, with a Join a class section and a Scan class code button, and a Run a class section listing saved timers to pick from." />
  <img src="/assets/blog/workout-timer-1-2/class-instructor.webp" width="600" height="1304" loading="lazy" decoding="async" alt="The instructor's screen during a class, marked Instructor, Beta and Live, counting down to the start of the class." />
  <figcaption>Class mode: join by scanning the instructor's code, or pick a timer and run the class yourself.</figcaption>
</figure>

The request: a way for an instructor to run one workout for a whole room, where everyone follows along on their own phone, in their own headphones.

Class mode does that. The instructor picks a timer and shows a class code. Everyone else opens Workout Timer, taps Class mode, and scans it. From then on every phone runs the same workout in step, each with its own sounds. When the instructor pauses, skips, or goes back, every phone does it at the same moment. Someone who arrives late scans in and lands right where the class is, and a phone that loses signal keeps running on schedule.

Nobody in the room makes an account. The workout itself travels inside the class code. During a class, the instructor's pause and skip pass between phones end-to-end encrypted, through free public relays I don't run and can't read. Outside a class, the only time the app goes online is to check for app updates.

It's labeled beta because a room full of different phones is hard to test from one desk. If you run a class with it, the Send feedback link on the Class mode screen is the fastest way to tell me how it went.

## Turn the cues down, not your music

<figure class="shot">
  <img src="/assets/blog/workout-timer-1-2/cue-volume.webp" width="600" height="1304" loading="lazy" decoding="async" alt="Workout Timer's Settings screen, Sounds section, with a Volume slider set to 50 percent above the list of cue sounds." />
  <figcaption>Settings &gt; Sounds: the Volume slider only changes Workout Timer's own cues.</figcaption>
</figure>

The request: let the beeps and voice cues sit under the music or podcast I'm already playing, without turning that down.

Settings &gt; Sounds now starts with a Volume slider. It sets how loud Workout Timer's own tones and spoken cues are, relative to your phone's volume, and leaves every other app's audio alone. A short sample plays when you let go of the slider, so you can hear where it landed.

## Go again in one tap

<figure class="shot">
  <img src="/assets/blog/workout-timer-1-2/restart-workout.webp" width="600" height="1304" loading="lazy" decoding="async" alt="The Done screen at the end of a workout in Workout Timer, with a Restart workout button under the Done check mark and a Back to timers button below." />
  <figcaption>The Done screen now offers Restart workout.</figcaption>
</figure>

The request: after the last round, start the same workout again without backing out to the list to find it.

The Done screen now has a Restart workout button. It runs the same timer again from the top, with the round count and time cleared. Back to timers is still right there if you're finished.

## Also new lately

- **A steadier clock.** The timer now keeps time from the phone's own steady clock instead of counting seconds, so it doesn't drift on a busy phone, and pausing never adds or loses time.
- **Custom sequences.** Name each interval, set its length, mark it work or rest, and repeat the list. The voice reads each name aloud.
- **AMRAP and For Time.** A countdown or a stopwatch, each with a big tap-to-count round counter.
- **Duplicate a timer** to make a variation without starting over.

All of it works the same on iPhone and Android.

## What hasn't changed

The whole app is still the whole app. Every feature above is in the free download, with no Pro tier and no subscription, and nothing that shipped free will ever move behind a paywall. No ads, ever, so there is never a video between your rounds. No streaks, no badges, and no notifications nudging you to come back: the app is there when you want it and quiet when you don't. The code is open source [on GitHub](https://github.com/Josh-Approved/workout-timer), so you can check every one of these claims yourself.

Josh Approved is supported by the people who use it. No ads, no subscriptions, no data harvest. What keeps this sustainable is whether it's worth a few dollars to you. If it is, there's an optional tip jar in the app.

## Get it, and keep the requests coming

Workout Timer is free to use on the [App Store](https://apps.apple.com/us/app/workout-timer-josh-approved/id6767314178) and [Google Play](https://play.google.com/store/apps/details?id=com.joshapproved.freeworkouttimer). If there's something you wish it did, tap Send feedback in the app or email feedback@joshapproved.com. Most of this update started exactly that way.
