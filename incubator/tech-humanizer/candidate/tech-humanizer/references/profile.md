# Writing profile

Store personal voice in `~/.tech-humanizer/profile.json` and project vocabulary in `.tech-humanizer.json` at the project root. Read existing profiles before rewriting or learning. Create them when learning evidence appears. Report malformed JSON and continue with the valid profile data.

## Voice and precedence

**Global voice** captures stable word choices, directness, sentence shapes, punctuation, and ways of explaining or requesting.

**Context voice** captures formality, warmth, structure, detail, greetings, and closings for a particular occasion:

| Context | Includes |
| --- | --- |
| `business-document` | Proposals, reports, executive summaries, and client deliverables. |
| `technical-document` | Design documents, RFCs, guides, architecture notes, and procedures. |
| `email` | Email, scoped by audience and relationship where relevant. |
| `message` | Chat, SMS, Slack, Teams, and conversational exchanges. |

Choose the context from the text's purpose and format. Scope narrower habits by audience or relationship.

Resolve conflicting rules in this order:

1. Current user instructions.
2. Explicit preferences and `do_not_change` entries.
3. Project terms and local preferences.
4. Observed context patterns, then global patterns.
5. Channel defaults.

Prefer the more specific scope within a priority level. Ask about equally specific explicit rules when the choice materially changes the rewrite.

## Evidence and promotion

| Evidence | Action |
| --- | --- |
| Explicit preference, correction, or revert | Save immediately with `confidence: "explicit"`, scoped to the feature the user addressed. |
| User-authored conversation or identified writing sample | Save an inferred habit in `candidates`. |
| Three independent observations agree | Promote the candidate to a context pattern. |
| Those observations span at least two contexts | Promote it to a global pattern. |

Count one conversation or independently supplied sample as one observation per pattern. Short messages can establish word choices; infer sentence or passage habits from substantial prose. Use text known to be user-authored; exclude quotations and drafts supplied only for humanization.

Store concise English descriptions of style behavior, evidence, language, context, and date. Retain a short original-language phrase when it is needed to express an exact wording preference. Keep sensitive source content out of the profile.

## User profile schema

```json
{
  "version": 2,
  "global_voice": {
    "preferences": [
      {
        "rule": "Use plain verbs; keep 'get' instead of replacing it with 'retrieve'.",
        "language": "en",
        "confidence": "explicit",
        "evidence": "User reverted this replacement.",
        "updated_at": "2026-10-19"
      }
    ],
    "patterns": [
      {
        "rule": "Lead with the decision, then give the reason.",
        "language": "en",
        "confidence": "observed",
        "evidence_count": 3,
        "contexts_observed": ["technical-document", "email"],
        "evidence": [
          "Conversation about a design choice",
          "User-authored client email",
          "Correction to a project update"
        ],
        "updated_at": "2026-10-19"
      }
    ],
    "do_not_change": []
  },
  "contexts": {
    "business-document": {
      "patterns": [
        {
          "rule": "State the recommendation before the supporting detail.",
          "language": "en",
          "audience": "executive",
          "confidence": "observed",
          "evidence_count": 3,
          "updated_at": "2026-10-19"
        }
      ]
    },
    "technical-document": { "patterns": [] },
    "email": { "patterns": [] },
    "message": {
      "patterns": [
        {
          "rule": "Omit greetings in an active team thread.",
          "language": "en",
          "audience": "teammate",
          "confidence": "explicit",
          "updated_at": "2026-10-19"
        }
      ]
    }
  },
  "candidates": [
    {
      "pattern": "Uses a brief question to introduce a tradeoff.",
      "language": "en",
      "context": "technical-document",
      "audience": "peer engineer",
      "observation_count": 1,
      "evidence": ["Conversation about an API design"],
      "updated_at": "2026-10-19"
    }
  ]
}
```

Keep at most 50 entries in each global list, each context list, and `candidates`. Merge duplicate rules. Remove the oldest low-confidence candidate first when the limit is reached.

## Project profile schema

```json
{
  "version": 1,
  "terms": [
    {
      "term": "canary deployment",
      "preferred_over": ["gradual rollout"],
      "context": "Release engineering",
      "updated_at": "2026-10-19"
    }
  ],
  "local_preferences": [
    {
      "rule": "Use the service name as the grammatical subject in incident updates.",
      "language": "en",
      "context": "technical-document",
      "confidence": "explicit",
      "updated_at": "2026-10-19"
    }
  ]
}
```

Keep at most 100 terms and 50 local preferences. Merge duplicate entries.

## Profile updates

Read the complete current file before updating it. Preserve unknown fields, merge matching entries, and date changes as `YYYY-MM-DD`. Remove or revise preferences when the user asks. Parse the saved JSON and confirm the updated rule can be read back.
