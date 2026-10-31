# Search visibility measurement · mrudula.tech

The site has no hidden tracking scripts or Google Analytics added by this change. Google Search Console (GSC) needs to be configured and read using the website owner's authenticated account.

## Set up / check
1. Open https://search.google.com/search-console and select the **Domain** property for `mrudula.tech` (or create one and complete DNS ownership verification).
2. Use **URL Inspection** for each live page:
   - `https://mrudula.tech/`
   - `https://mrudula.tech/profile.html`
   - `https://mrudula.tech/research.html`
   - `https://mrudula.tech/work-with-me.html`
3. Check **Page indexing** for each page. If a page is reachable but not indexed, request indexing. An indexing request is not a guarantee.
4. Open **Sitemaps** and submit `https://mrudula.tech/sitemap.xml`. The repo maintains the four canonical page locations.
5. In **Performance → Search results**, filter by individual page and compare:
   - impressions
   - clicks
   - CTR
   - average position
   - queries
   - country and device splits (if useful)
6. Compare consistent 28-day periods after publication, allowing time for data to arrive and Google to recrawl. Avoid claiming that any schema or sitemap change alone caused ranking gains.

## Questions to answer
- Does the homepage get impressions for “Pedamallu Sai Mrudula” and “Sai Mrudula Pedamallu”?
- Does `research.html` get impressions for exact paper titles and smart-grid IDS / PV fault terms?
- Does `work-with-me.html` attract queries about internships or software engineering?
- What is the click-through rate for branded searches, and are title/description snippets accurate?
- Are all four URLs indexed with Google-selected canonicals matching the declared canonicals?

## Content and SEO safeguards
- Research claims link to DOI or official records; accepted-but-unpublished work is labelled accordingly.
- Do not add false reviews, self-rated SEO stars, job-posting schema for an individual seeking jobs, or invented results.
- Do not publish private Search Console credentials or verification values into source control.
- Dedicated per-project pages are deliberately deferred pending content/design discussion.

This document is a measurement playbook, not a report of live Search Console traffic or indexing.
