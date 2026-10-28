# Channel Style Guide

Use these defaults for the target format where the user's profile is silent.

## Universal Style Controls

- Audience knowledge: expert, mixed, non-technical, client, teammate, reviewer.
- Purpose: inform, request, decide, warn, document, persuade, summarize.
- Consequence: what the reader should know or do after reading.
- Evidence boundary: what is known, inferred, missing, or needs a source.
- Register: formal, semi-formal, direct, casual, terse.

## Business Documents

Outcome:

- recommendation or decision is easy to find;
- evidence and commercial consequence are explicit;
- claims stay within the supplied evidence;
- formality fits the audience without bureaucratic padding;
- next steps, owners, and dates are clear when the source provides them.

Prefer:

```text
Approve the two-year renewal. It holds the unit price at the current rate and removes the migration fee.
```

Avoid:

```text
This strategic renewal represents a pivotal opportunity to unlock value and strengthen our long-term partnership.
```

## Technical Documentation

Outcome:

- precise, direct, skimmable;
- technical terms preserved;
- examples included only when they clarify behavior;
- warnings explicit;
- no marketing adjectives.

Prefer:

```text
The API returns 401 when the token is expired. Refresh the token and retry the request once.
```

Avoid:

```text
It is important to note that this robust API framework handles authentication errors in a seamless manner.
```

## Design Docs and RFCs

Outcome:

- decision-oriented;
- tradeoffs named;
- uncertainty visible;
- ownership and constraints clear.

Prefer:

```text
Use Redis for short-lived session state. It keeps reads under 10 ms, but we need a fallback path for regional outages.
```

Avoid:

```text
Redis represents a pivotal component in the evolving caching landscape, offering both benefits and challenges.
```

## Release Notes

Outcome:

- user-visible change first;
- concrete behavior;
- no internal triumph language;
- migration or action items clear.

Prefer:

```text
Exports now include archived projects. No migration is required.
```

Avoid:

```text
This release marks a major milestone in our commitment to empowering users with robust export capabilities.
```

## Pull Request Descriptions

Outcome:

- what changed;
- why it changed;
- how it was tested;
- risk or rollback note if relevant.

Prefer:

```text
Adds token expiry checks before the database call. Tested with unit coverage for expired, missing, and valid tokens.
```

Avoid:

```text
This PR enhances authentication robustness and showcases a meticulous approach to security.
```

## PR Review Comments

Outcome:

- direct, kind, specific;
- actor and requested change clear;
- no canned praise or policy fog.

Prefer:

```text
Please reject expired tokens before the database call. That keeps failed auth attempts out of the query logs.
```

Avoid:

```text
Thank you for your contribution. You raise a valid point, and best practices suggest improving clarity and readability.
```

## Team Chat

Outcome:

- short;
- concrete;
- natural shorthand;
- one clear next step when needed.

Prefer:

```text
Deploy is done. Please check your service dashboards and ping me if anything looks off.
```

Avoid:

```text
I am pleased to inform you that the deployment has completed successfully. Please review your services at your earliest convenience.
```

## Client Email

Outcome:

- professional but not padded;
- clear ask or update;
- no AI-assistant service phrases;
- no unexplained jargon unless shared context exists.

Prefer:

```text
The migration finished at 14:30 UTC. We found no data loss in the post-migration checks. Please review the dashboard by Friday.
```

Avoid:

```text
I hope this message finds you well. We are pleased to inform you that the migration represents a pivotal step in our ongoing partnership.
```

## Wikipedia or Encyclopedia-Like Prose

Outcome:

- neutral;
- source-bound;
- no unsourced interpretation;
- no broad importance claims;
- no promotional phrasing;
- no Markdown or broken citation residue.

Prefer:

```text
The institute was established in 1989 by the regional government.
```

Avoid:

```text
The institute was established in 1989, marking a pivotal moment in the evolution of regional statistics.
```

## Personal Voice Adaptation

Apply the matching profile rules using [profile.md](profile.md#voice-and-precedence). Use the channel guidance above to fill gaps in the user's profile.
