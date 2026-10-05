# Local usage analytics

**Status:** private local implementation as of 5 October 2026. [Türkçe](ANALYTICS.md).

`/analytics` shows the last 7/30 UTC calendar days of **Try** and **Learn from this** button events by lesson. Collection-card primary actions and lesson demo/external-project actions are instrumented. Candidate browsing, source-code links, screenshots, articles, page views, and unique visitors are outside this scope. These counts do not prove the destination loaded or learning succeeded.

The client sends only real clicks on marked `data-radar-action` controls, using keepalive without blocking navigation. Middle-click/context-menu actions are not counted. Global Privacy Control and Do Not Track suppress sending; network failures can lose events. The API requires a session and same origin, validates UUID event ID, allowed action and known lesson slug, and timestamps server-side. Exclusive file creation deduplicates repeated IDs. IP, user identity, cookies, URL parameters, and form contents are not stored. The random event ID is not a visitor identifier.

`learning-data/analytics` stays outside Git. There is no automatic deletion yet; the 30-day report is just a view window. Before public deployment, decide retention/deletion, administrator roles, bot/rate limits, and durable storage. Counts include authorized developers and visitors and cannot be presented as unique users or conversion.
