# Global AI source catalog

**Status: reconciled with code on 6 October 2026.** This classifies the user's suggestions; it is not a live scan report. [Türkçe](GLOBAL-SOURCE-CATALOG.md). `/sources` is authoritative for the latest attempt, errors, and counts. Being listed does not imply an active collector or AI-assisted development.

**Roles:** *Build discovery* follows an explicit repository/demo link; *news* stores a publisher headline, publication time and original URL; *research candidate* belongs in a future separate Research Gate; *pending* has no enabled collector. Two pages of one platform are not independent sources. News feeds do not satisfy the target of 25 working independent **build discovery** sources. News is not automatically a trend, recommendation, or runnable demo.

| Suggested source | Role | Current status and reason |
| --- | --- | --- |
| [TechCrunch AI](https://techcrunch.com/category/artificial-intelligence/) | News, lead | **News active** via AI category RSS. Product claims need separate verification. |
| [The Verge AI](https://www.theverge.com/ai-artificial-intelligence) | News | **News active** via AI RSS. |
| [Ars Technica](https://arstechnica.com/rss-feeds/) | Technical news | **News active** via the broad Technology Lab feed with an AI title gate. |
| [VentureBeat AI](https://venturebeat.com/category/ai/) | Enterprise news | **Pending**; tested RSS returned HTTP 429. |
| [MIT Technology Review](https://www.technologyreview.com/topic/artificial-intelligence/) | News/research | **News active** via AI feed. |
| [KnowEntry](https://knowentry.com/) | Secondary aggregator | **Pending**; check original links, duplicates and reuse terms. User-provided update frequency is unverified. |
| [AI News Hub](https://www.ainewshub.io/home) | Secondary aggregator | **Pending**; verify domain identity and original-source mapping; “200+ sources” not accepted as measured coverage. |
| [MarkTechPost](https://www.marktechpost.com/) | Build links | **Build discovery active**; explicit repo/Space links are leads, not endorsements. |
| [Synced Review](https://syncedreview.com/) | Asia coverage | **Pending**; RSS answered, but the newest sampled entry was dated 2025. |
| [The Decoder](https://the-decoder.com/) | News | **News active**. |
| [The Rundown AI](https://www.therundown.ai/) | Newsletter | **News active** via headlines; subscriber claims unverified. |
| [TLDR AI](https://tldr.tech/ai) | Newsletter | **Pending**; attempted RSS path returned 404. |
| [Ben's Bites](https://www.bensbites.com/) | Build links | **Build discovery active** via explicit links. |
| [The Batch](https://www.deeplearning.ai/the-batch/) | Research explainer | **Pending**; attempted feed path failed. |
| [Import AI](https://jack-clark.net/) | Build links/research | **Build discovery active**; links are not praise. |
| [Latent Space](https://www.latent.space/) | Author/publication links | **Build discovery active** via explicit project links, not a summary service. |
| [Last Week in AI](https://lastweekin.ai/) | Weekly news | **News active** via dated RSS. |
| [Superhuman AI](https://www.superhuman.ai/) / [The Neuron](https://www.theneurondaily.com/) | Newsletters | **Pending**; verify feed and reuse rights; the tested Neuron XML was invalid. |
| [arXiv cs.AI/cs.LG/cs.CL](https://info.arxiv.org/help/api/index.html) | Research | **Pending** separate Research Gate; three categories are one platform. |
| [Hugging Face Daily Papers](https://huggingface.co/papers) | Research | **Pending**; attempted RSS returned 401. Same platform family as Blog/Spaces. |
| [Hugging Face Blog](https://huggingface.co/blog) | Model/product news | **News active**; [Spaces](https://huggingface.co/spaces) **build discovery active**. One platform family. |
| [Papers with Code](https://paperswithcode.com/) | Paper↔code lead | **Pending**; verify current official endpoint/API; similarly named sites are not equivalent. |
| [Google DeepMind Blog](https://deepmind.google/blog/) | First-party lab news | **Pending**; tested feed response was inconsistent/unparseable. [Google Research](https://research.google/blog/) RSS is **news active**. |
| [OpenAI News/Research](https://openai.com/news/) | First-party lab news | **Pending**; find a stable official feed/API and verify terms. |
| [Anthropic Research](https://www.anthropic.com/research) | First-party lab news | **Pending**; attempted news RSS returned 404. |
| [Reddit r/MachineLearning](https://www.reddit.com/r/MachineLearning/) / [r/LocalLLaMA](https://www.reddit.com/r/LocalLLaMA/) | Community attention | **Pending** API/terms, dates, discussion and product matching. Both are one platform. |
| [Hacker News](https://news.ycombinator.com/) | Posts/discussion | **Build discovery active**, plus attention enrichment. Neither a recommendation nor AI-development proof. |
| [Hugging Face Forums](https://discuss.huggingface.co/) / Discord | Discussion | **Pending** official access/privacy terms. Same HF platform family. |
| [Kaggle Community](https://www.kaggle.com/discussions) | Research/practice | **Pending** distinguish product demos from competitions and verify access. |
| [OpenAI Developer Forum](https://community.openai.com/) | Developer discussion | **Pending** official access and reuse terms. |
| [X](https://x.com/) lists: @sama, @karpathy, @ylecun, @demishassabis, @DrJimFan | Person posts/attention | **X collector disabled** pending access/terms. Karpathy's separate public blog feed is active; that is not X coverage. |
| [daily.dev #ai](https://app.daily.dev/tags/ai) | Secondary developer feed | **Pending**; tested RSS returned no article entries. Need original links, API and duplicate review. |
| [GitHub](https://github.com/trending) + [Trending developers](https://github.com/trending/developers) | Code/build leads, platform attention | **Active** GitHub collector and local Trending; both Trending pages are one platform. Stars do not prove AI-assisted development. |

## Active news contract

`content/news-feeds.json` contains tested feed URLs. Every three hours, each reads at most 20 entries. Entries missing dates, dated in the future, or older than seven days are excluded. Broad feeds require AI-related titles. Canonical URLs deduplicate articles; publication and first-seen timestamps stay separate. `/news` shows original headlines, available short publisher descriptions and authors in 48-hour/seven-day views; `/briefing` lists the same articles in a separate compact headline section. No Build Entity, AI-development label, hype score, or AI-generated summary is inferred from a headline. `/sources` exposes each run and failure. All ten feeds completed their first live run; consult runtime data for current status. Details: [news pipeline contract](NEWS.en.md).

## Expansion gate

Enable a new source only after verifying **permitted/stable access, publication date, original URL, duplicate rate, sample quality, and an actual successful run**. Next priorities are official lab announcements, fresh first-party Asian publishers, and legitimate Reddit/Product Hunt API access, followed by a separate research flow. More news must not weaken the build showcase or lesson quality gate.
