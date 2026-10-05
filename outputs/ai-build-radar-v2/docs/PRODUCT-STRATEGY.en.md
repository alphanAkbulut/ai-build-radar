# AI Build Radar · product memory

**Status:** product intent and verified limits as of 5 October 2026. [Türkçe](PRODUCT-STRATEGY.md) · [Roadmap](ROADMAP.en.md) · [Architecture](ARCHITECTURE.en.md). This is a decision reference, not a conversation transcript. GitHub Issues tracks work; the live `/sources` page tracks source health.

## Why it exists

The founding question is: **What can people actually build with AI, which applications are drawing attention, and how can I use a good idea in my own product?** The intended visitor is a curious product manager, developer, or AI-assisted builder. They need more than headlines or a huge tool directory: see a working product, understand its maker and purpose, inspect evidence of attention, distinguish verified tools from guesses, and where feasible adapt a specific feature.

Radar has two layers. The **news/discovery feed** is current, source-backed discovery and attention. The **learning collection** is a small application school of tested, teachable examples. Roughly 30 strong case studies are preferable to 150 shallow cards; that number never relaxes the quality gate. A product may appear in the feed without qualifying as a lesson. Publisher headlines now appear separately and with original links on `/briefing`; papers and model announcements do not become working-demo cards. A deeper **Research Gate** remains future work.

## Core visitor journey

1. **See:** A card explains what was built, what is distinctive, where attention appeared, and when. New discovery, platform attention, a mention, and AI-assisted development remain different claims.
2. **Try:** The primary action opens the actual product/demo; code is secondary. Visual evidence comes from the product. A static image is not presented as live interaction. Broken, gated, or inaccessible demos are identified.
3. **Learn:** Show the maker's source-backed description, observed interaction, sourced praise or criticism where available, and a technical or product lesson. The maker's actual method and Radar's suggested method are separate.
4. **Adapt:** Only a tested recipe offers steps, acceptance checks, and context to carry into the user's AI development tool. Radar cannot know another ChatGPT/Claude conversation or the user's repository automatically; the handoff prompt must first inspect and verify the existing project. Do not promise 90% success without a measured benchmark.

## Claims that must remain distinct

| Claim | Possible evidence | Invalid inference |
| --- | --- | --- |
| Product uses AI | Documented feature or working demo | It was developed with AI |
| Developed with AI | Explicit maker statement or stronger direct record | A particular model wrote all its code |
| Drawing attention | Attributed recent votes/comments, Trending placement, or measured growth | It is good or universally praised |
| A person mentioned it | Dated, exact-match publication/post | The author endorsed it |
| Demo works | Dated real opening and interaction check | Every feature works |

Apply `Verified`, `Builder-stated`, `Derived`, and `Unknown` to the *specific claim*. Keep source URL, publication/event date, observation date, and Radar's first-seen date separate. Missing evidence means `Unknown`, not a negative claim. An AI feature or GitHub Trending placement does not establish AI-assisted development.

## Selection standard and current gap

The feed needs a distinct product URL, a meaningful source-backed description, resolved identity, and a correctly typed dated signal. Feed inclusion is not a quality award. The learning collection also needs a real interface/interaction review, a distinctive lesson, a reason to learn it, and applicable steps. Current code checks **presence and some freshness** of these fields; it does not autonomously browse like a person or verify the “wow” factor, review sentiment, or recipe success. Closing that gap is the first roadmap priority.

Publication must be source-backed and challengeable: why this product, what was tested, and what remains unknown? Long lists of missing popularity evidence must not dominate the card. Never invent praise or momentum. Do not combine incomparable platform signals into a synthetic score. A third-party directory's model tag is not Radar's independent verification.

## Scope and later ideas

- **Now:** private local Next.js app, evidence store, automatic candidate collection, a separate dated publisher-headline lane, feed, and a small editorial lesson set. The worker runs only while the computer is running. There is no connected hosted Supabase project, paid AI evaluation provider, or public deployment.
- **Next value:** stronger coverage and source health, sampled false-positive review, real demo/interaction evidence, five complete high-quality cases, and clear what/why/where/learn cards.
- **Further research:** YouTube reviews, social discussion context, multilingual sources including Asia, short sourced summaries of people's publications, and model/feature news. X, Reddit, Product Hunt, and YouTube are not running continuous collectors today.
- **Later:** tested adaptation, public accounts, follow/bookmark/comments, maker showcases, multilingual generation, open API/RSS, subscriptions, and geographic exploration. These are not current promises or reasons to expand the architecture prematurely. A hosting location or a country's capital must never be labeled as the maker's real city without evidence.

## What success means

Measure trust and use, not volume: false AI-development labels, broken demos, unsupported attention, incorrect merges, movement from card to product, the Try → Learn → Adapt funnel, and whether a visitor understands a card at a glance. Report sample size, check date, and thresholds before claiming any success percentage. Review rights, privacy, source terms, and cost before public launch.
