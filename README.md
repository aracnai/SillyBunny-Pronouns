# SillyBunny Pronouns — Multiple Pronouns [Extension]

Pronoun management for **SillyBunny** personas *and* characters, built to make
**multiple pronouns** actually work in chat.

LLMs tend to collapse "she/they" down to just "she" and refer to the persona only
one way. This extension fixes that two ways at once:

1. **An ordered list of pronoun sets** per persona/character (instead of a single set),
   with rotating macros so pronoun usage varies naturally where macros are placed.
2. **An injected directive** — when an entity has two or more sets, a short system
   instruction is added telling the model to alternate between them. This is the part
   that makes the model itself use varied pronouns in its own writing.

Ported from and inspired by the [SillyTavern-Pronouns](https://github.com/SillyTavern/SillyTavern-Pronouns)
extension by Wolfsblvt (AGPL-3.0).

## Installation

Install using SillyBunny's extension installer from the URL:

```txt
https://github.com/aracnai/SillyBunny-Pronouns
```

Or copy this folder into your SillyBunny third-party extensions directory, named
exactly **`SillyBunny-Pronouns`** (the folder name must match so templates resolve):

```
<SillyBunny>/data/<your-user>/extensions/SillyBunny-Pronouns/
```

Then enable **Pronouns (Multiple)** in the Extensions panel. Requires the macro
engine, which is enabled by default in SillyBunny.

## How it works

### Multiple pronoun sets

Each persona and character holds a list of pronoun sets. Add one set for a single
pronoun, or several for multiple pronouns:

- `she/her`
- `she/her` + `they/them` → **she/they**
- `she/her` + `he/him` + `they/them` → **any/all**

Use the editor under the **persona description** (Persona Management) and under the
**character description** (character panel). Quick buttons append single presets
(She/Her, He/Him, …) or replace everything with a multi preset (She/They, He/They, Any/All).

### Resolution mode

When an entity has 2+ sets, the **When multiple** selector controls how the macros resolve:

| Mode | Behavior | Example output |
|---|---|---|
| **Rotate** (default) | Varies between sets per occurrence | "She grabbed their bag." |
| **Primary** | Always the first set | "She grabbed her bag." |
| **Join** | All sets joined | "she/they grabbed she/they bag." |

### The directive

When an entity has 2+ sets, a system note like this is injected:

> *[System note: {{user}} uses multiple sets of pronouns — she/her and they/them.
> When referring to {{user}}, alternate naturally between these sets throughout the
> conversation instead of defaulting to only one. Every listed set is equally correct.]*

This is the lever that makes NPCs actually refer to you with varied pronouns. It's
toggleable globally (Extensions → Pronouns (Multiple) settings), per-entity (the
**Directive** selector: Default / Always on / Off), and the wording, injection depth,
and role are all configurable.

## Macros

Persona (the user) and character (the bot) each get their own family. All resolve
through the entity's mode (rotate/primary/join).

| Persona | Character | Pronoun type | Examples |
|---|---|---|---|
| `{{pronounSubjective}}` | `{{charPronounSubjective}}` | Subjective | she / he / they |
| `{{pronounObjective}}` | `{{charPronounObjective}}` | Objective | her / him / them |
| `{{pronounPosDet}}` | `{{charPronounPosDet}}` | Possessive determiner | her / his / their |
| `{{pronounPosPro}}` | `{{charPronounPosPro}}` | Possessive pronoun | hers / his / theirs |
| `{{pronounReflexive}}` | `{{charPronounReflexive}}` | Reflexive | herself / themselves |
| `{{pronounVerbBe}}` | `{{charPronounVerbBe}}` | Verb-be agreement | is / are |

**Compatibility (opt-in, persona-mapped):**

- WyvernChat dot-notation (`{{pronoun.subjective}}` …) is rewritten automatically.
- WyvernChat capitalized variants (`{{pronounSubjectiveCap}}` …) — toggle.
- JanitorAI (`{{sub}}`, `{{obj}}`, `{{poss}}`, `{{poss_p}}`, `{{ref}}`) — toggle.
- English shorthands (`{{she}}`, `{{him}}`, `{{their_}}` …) — toggle.

## Slash commands

| Command | Description |
|---|---|
| `/pronouns-set key=<key> [target=persona\|character] [index=N] <value>` | Set one field of set `N`. |
| `/pronouns-preset [target=…] <preset>` | Replace all sets with a preset (`she`/`he`/`they`/`it` or `sheThey`/`heThey`/`sheHe`/`any`). |
| `/pronouns-add [target=…] <preset>` | Append a single preset set. |
| `/pronouns-mode [target=…] <rotate\|primary\|join>` | Set the resolution mode. |
| `/pronouns-clear [target=…]` | Remove all sets. |
| `/pronouns-replace [target=…] [shorthands=…] <text>` | Replace pronoun words in text with macros. |
| `/pronouns-open-replacer [target=…] [shorthands=…] [text]` | Open the replacer popup. |

## Data & storage

- **Persona** pronouns are stored on the persona descriptor (alongside the description),
  so they survive exports and backups. Old single-set data from the original extension
  is migrated in place.
- **Character** pronouns are stored in this extension's settings (keyed by the character's
  avatar), so chatting with a card never modifies the card file.

Uninstalling removes all pronoun data and the injected directives.

## License

AGPL-3.0 — see [LICENSE](LICENSE). Based on SillyTavern-Pronouns by Wolfsblvt.
