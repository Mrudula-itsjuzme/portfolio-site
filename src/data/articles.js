export const articles = [
  {
    id: "validation-gates-markerless-mocap",
    title: "Why Markerless Motion Capture Needs Validation Gates, Not Just Pretty Skeletons",
    date: "Sep 2026",
    readTime: "6 min read",
    status: "Published",
    excerpt: "A pose overlay can look convincing while the underlying geometry is unusable. Good mocap needs coverage, confidence, reprojection error, synchronization, and explicit failure gates.",
    content: `A markerless motion-capture demo can lie to you without technically being broken.

The skeleton moves. The joints look plausible. The video is smooth. It feels finished.

But motion capture is not really a drawing problem. It is a measurement problem.

If the system is meant to produce kinematics, gait parameters, 3D trajectories, or clinically meaningful movement features, visual plausibility is not enough. A wrong knee point can still look like a knee point. A triangulated joint can sit in a believable place while being geometrically inconsistent with both cameras. A detector can produce a complete-looking frame while confidence quietly collapses on one side of the body.

That is why I started treating validation as part of the pipeline rather than something done after the pipeline.

For single-camera pose estimation, the first useful questions are boring but essential: how much of the sequence has usable landmarks? Which joints fail most often? Is confidence stable across frames? Are there sudden jumps that suggest detector swaps or occlusions? How much smoothing is required before the trajectory stops looking physically absurd?

For dual-camera reconstruction, the bar gets higher. Synchronization matters. Calibration matters. Reprojection error matters. If the same reconstructed 3D point projects badly back into one or both camera views, the 3D result should not be trusted just because it looks neat in a plot.

In my motion-capture work, this changed the way I thought about output. Instead of treating a successful run as “the script completed,” I started defining quality gates.

A sequence can fail even when the code succeeds.

That distinction is important.

A right-side pose stream with poor usable coverage should not silently feed gait analysis. A calibration with unstable reprojection error should not be promoted into confident 3D claims. A large frame-to-frame motion jump should be treated as a diagnostic signal, not smoothed away until the graph looks nicer.

The system should be allowed to say: this result is not reliable enough.

That sounds conservative, but it is actually what makes later analysis more useful. Once validity is explicit, downstream features can inherit trust levels. Gait events can distinguish measured values from estimates. Reports can expose where confidence dropped. Experiments become comparable because “good” has a repeatable definition.

This also changes model evaluation. A detector with slightly lower headline accuracy can be better for motion capture if it gives more stable temporal trajectories. A smoother detector can be worse if it hides fast movements. A model that performs well on average can still be unusable for a specific joint or camera angle.

So the useful metrics are layered: detection coverage, landmark confidence, temporal stability, synchronization quality, reprojection error, reconstruction success, and finally task-level outputs such as gait parameters.

The order matters.

If upstream geometry is weak, downstream clinical-looking numbers become decoration.

This is one of the stranger lessons of computer vision: the more impressive the visualization becomes, the easier it is to forget that a visualization is not evidence.

A good markerless mocap system should make its uncertainty visible. It should tell you what it measured, what it inferred, what it rejected, and why.

The skeleton is the interface.

The validation layer is the actual instrument.`
  },
  {
    id: "ids-accuracy-is-not-the-whole-story",
    title: "Why 99% Accuracy Can Still Be a Bad Intrusion Detector",
    date: "Sep 2026",
    readTime: "5 min read",
    status: "Published",
    excerpt: "Security models live in the tails. Accuracy matters, but recall, false positives, class imbalance, and operational cost decide whether an IDS is actually useful.",
    content: `Intrusion-detection results become suspiciously easy to oversell when the first number on the page is accuracy.

A model reports 99% accuracy. It sounds excellent. The instinct is to stop reading.

But security systems do not fail on the average case. They fail in the minority class, the weird packet, the rare attack, the distribution shift, and the false alarm that trains an operator to ignore the next alert.

That is why I care much more about the shape of the errors than the headline score.

Suppose network traffic is heavily dominated by benign examples. A classifier can achieve high accuracy while still missing a meaningful fraction of attacks. In that setting, recall becomes critical because it answers the operational question: of the attacks that actually happened, how many did we catch?

Then comes the opposite problem. If the model catches everything by flagging half the network, it is still useless. False-positive rate matters because every false alarm consumes attention. A security system that constantly cries wolf eventually becomes background noise.

The trade-off is not academic. It maps directly to deployment.

In my smart-grid intrusion-detection work on IEC 60870-5-104 traffic, the published results included 99.29% accuracy, 94.8% recall, and a 4.1% false-positive rate. Those numbers are more informative together than any one of them alone.

The recall tells us the detector is not perfect. Some attacks are still missed. The false-positive rate tells us the system still creates operational noise. That is exactly the kind of thing a responsible evaluation should expose instead of burying under a strong accuracy number.

The next layer is class structure. “Attack” is rarely one homogeneous thing. Different attacks can leave very different signatures, and a model can perform well on common attack families while failing on rare or subtle ones. Aggregate metrics can hide that.

Then there is data leakage.

Security datasets are especially vulnerable to accidental shortcuts. If train and test splits share near-duplicate flows, sessions, timestamps, source-specific artefacts, or preprocessing leakage, a model can look brilliant while learning the dataset rather than the attack behaviour.

The safest evaluation is therefore adversarial toward your own result.

Ask what information the model could be exploiting. Ask whether the split matches deployment reality. Ask how performance changes when traffic characteristics shift. Ask what happens to recall under rare attacks. Ask whether false positives cluster around particular benign behaviours.

And if the model is intended for a real industrial protocol, evaluate the consequences of each error type.

A false negative may allow malicious control traffic through. A false positive may interrupt legitimate operations or overwhelm analysts. Those are not symmetric costs.

This is why security ML needs more than model selection. It needs threat-aware evaluation.

The goal is not to make the confusion matrix look pretty. The goal is to understand what the system will do when somebody actively tries to make it wrong.`
  },
  {
    id: "evidence-first-financial-reconciliation",
    title: "Matching Numbers Is Not the Same as Proving Money Moved",
    date: "Sep 2026",
    readTime: "6 min read",
    status: "Published",
    excerpt: "Financial reconciliation gets dangerous when similarity is treated as proof. Evidence-first systems separate plausible matches from transactions that can actually be closed safely.",
    content: `A payment record and a bank transaction can have the same amount and still have nothing to do with each other.

That sounds obvious until you look at how many reconciliation systems are built.

The common pattern is score-based matching. Same amount? Good. Similar timestamp? Better. Matching reference text? Better again. Add enough similarity and the system decides the records belong together.

That is useful for finding candidates.

It is not proof.

Financial workflows need a distinction between “these records look related” and “the evidence is strong enough to close this reconciliation.” I built my finance-controller project around that gap.

The key idea is provenance.

Instead of treating reconciliation as one pairwise comparison, represent the movement of money as a chain of evidence: order, payment, fees, taxes, settlement, bank transaction. A match becomes stronger when the system can explain how value moved through that chain and where deductions came from.

This matters because real payment flows are messy.

A single settlement can contain multiple payments. Fees may be deducted before settlement. Taxes can appear as separate components. Timestamps drift. Bank narration is inconsistent. A transaction can be split, aggregated, delayed, or partially refunded.

A naive exact matcher fails on these cases.

A naive fuzzy matcher can be worse because it may confidently close the wrong records.

So reconciliation should be layered.

Exact matching is useful where identifiers or totals genuinely align. Composite matching is needed when multiple child transactions explain one settlement. Fuzzy matching can rank ambiguous candidates. An AI layer can help interpret messy context or explain anomalies.

But those layers should not have equal authority.

The AI should not be allowed to invent missing financial evidence just because a pattern looks familiar. If a fee seems plausible but there is no supporting record, the system should mark the explanation as a hypothesis, not convert it into accounting truth.

That one design choice changes the entire safety profile.

It also makes abstention valuable.

Most ML demos treat abstention as failure. In finance, refusing to close an uncertain case can be the correct result. If the evidence is incomplete, the system should escalate or leave the item unresolved instead of forcing a match to improve a completion percentage.

That means evaluation should measure unsafe closure separately from correct closure.

A system that reconciles 98% of records but incorrectly closes 2% of financially ambiguous cases may be worse than a system that reconciles 93% and safely abstains on the rest.

The metric has to reflect the cost of being wrong.

This is also why I prefer evidence-first explanations over generic AI summaries. A useful explanation should point to the exact records, the amounts, the deductions, and the path that connects them. If the explanation cannot be traced back to data, it is commentary, not evidence.

The broader lesson is bigger than finance.

Whenever an AI system is making a decision with real consequences, similarity should not silently become certainty.

Candidate generation, reasoning, evidence, and authority are different layers.

Good systems keep them separate.`
  },
  {
    id: "why-prompts-are-not-an-ai-strategy",
    title: "Why Prompts Are Not an AI Strategy",
    date: "Jun 2026",
    readTime: "7 min read",
    status: "Published",
    excerpt: "Prompting is interface-level thinking. Reliable AI strategy starts with data, retrieval, evaluation, fallbacks, and ownership.",
    content: `Most companies begin their AI work with a prompt.

It feels like the obvious place to start. A blank box, a quick instruction, a useful response. Then another instruction. Then a better one. Then a longer one with rules, examples, formatting, tone, and a polite little sentence telling the model not to hallucinate.

It feels productive because the feedback is immediate. Change the prompt, change the output. The work feels visible. The system feels like it is improving.

But that is the trap.

Prompting is not strategy. It is interface-level thinking. It shapes how the model responds, but it does not decide whether the system is reliable, measurable, maintainable, or safe to use inside a real business.

A prompt can make an AI workflow sound better before it becomes meaningfully better. The wording improves. The tone improves. The output becomes cleaner. But the underlying system may still be guessing from weak data, pulling from the wrong source, missing context, or producing answers nobody can properly evaluate.

The real question is not “what should we ask the model?” That question comes too early. The better question is: what decision is this AI system supposed to support? What data does it need? Where does that data come from? How fresh does it need to be? What happens when the data is missing? How do we know whether the output is good? Who is responsible when it is wrong?

Those are strategy questions. The prompt is only one instruction inside a much larger operating system.

Most AI problems are not actually prompt problems. They are data problems wearing a prompt costume. Documentation is scattered. Product catalogues are inconsistent. Support logs are messy. Internal policies are outdated. Files are duplicated. Important context lives in someone’s head instead of the system.

A model cannot reliably reason over information it cannot access, cannot trust, or cannot separate from noise. A better prompt will not fix a broken knowledge base. It may hide the problem for a while because the answer sounds polished, but polished is not the same as correct.

This is why AI strategy starts with structure. What information matters? Where does it live? How should it be retrieved? Which sources are current? Which ones should be ignored? What needs human review? What should the system refuse to answer?

Retrieval is often treated like a technical detail, but it is a product decision. What the model sees decides what the user gets. If the system retrieves the wrong document, the answer may still sound confident. If old information sits beside new information with no priority, the system may give outdated advice.

The prompt controls expression. Retrieval controls grounding.

And without grounding, AI becomes confidence with a nice interface.

There is another problem with prompt-first work: nobody knows whether it is actually improving. Teams keep editing instructions until the answer feels better. But “feels better” is not a measurement system.

AI needs evaluation. Even a simple eval set changes the quality of the work. Take 20 real user questions. Define what a good answer looks like. Define what a bad answer looks like. Include edge cases, missing-context cases, and examples the system must refuse. Then test every change against the same standard.

Without evals, prompt changes are just vibes with better formatting.

A serious AI workflow also needs fallback paths. AI systems will be uncertain. They will miss context. They will misunderstand users. They will face inputs they were not designed for. The product needs to know what happens next.

Does it ask a clarifying question? Show source material? Route to a human? Refuse unsafe output? Log the issue for review? Fall back to search? Stop before pretending?

An AI system that always answers is not automatically helpful. Sometimes the most valuable behaviour is knowing when not to answer.

Model choice is another place teams get distracted. They ask whether to use GPT, Claude, Gemini, or an open-source model before they have defined the system around it. The model matters, but it is not the strategy.

Models change. Pricing changes. Latency changes. Output formats change. Provider behaviour changes quietly. If the whole workflow depends on one model behaving one specific way forever, the business has built a fragile dependency.

Model-agnostic architecture does not mean every model is equal. It means the business logic is not trapped inside one provider’s behaviour. The system should be able to adapt when the model layer shifts.

A prompt library can still be useful. It can create consistency. It can speed up repeated workflows. But a prompt library is not ownership.

Ownership means someone knows what the system is supposed to do, what it should never do, where the data comes from, how quality is measured, what gets reviewed, what gets logged, and what happens when something breaks.

AI strategy is a set of decisions about data, behaviour, risk, measurement, and maintenance. It decides where AI should sit in the business, what problem it is allowed to solve, what information it can use, what quality standard it must meet, where humans stay involved, how the system improves, and how it fails safely.

The prompt comes after that.

Prompts shape the answer. Systems shape the outcome.

A company can keep rewriting prompts forever and still never build a reliable AI workflow. Or it can step back and design the real thing: usable data, intentional retrieval, measurable quality, safe fallbacks, adaptable architecture, and clear ownership.

That is AI strategy. Everything else is just better wording.`
  },
  {
    id: "what-production-ready-ai-actually-means",
    title: "What Production-Ready AI Actually Means",
    date: "Jun 2026",
    readTime: "8 min read",
    status: "Published",
    excerpt: "Reliability is not a model feature. Production AI is the system around the model: grounding, retrieval, evals, fallbacks, monitoring, and ownership.",
    content: `Reliability is not a model feature. It is an architecture decision.

A lot of companies are trying to bring AI into their products right now. Some want chatbots. Some want internal copilots. Some want recommendation systems, document search, workflow automation, AI agents, or customer-facing assistants.

The surface looks different, but the mistake is often the same. They treat AI as something you add.

A model is connected. A prompt is written. A response appears. The feature starts to feel real.

But production-ready AI is not about whether the system can produce a good answer once. It is about whether the system can keep producing useful, safe, measurable answers when the inputs are messy, the data changes, users behave unpredictably, and the business starts depending on it.

A model can generate language. It cannot automatically decide where truth lives inside your business. It cannot know which document is current, which policy is outdated, which customer record matters, or which answer should be blocked without the system around it telling it how to behave.

The first layer is data grounding. The AI needs to know what information it is allowed to use. That might be product documentation, support logs, internal policies, user history, catalogue data, transaction records, or research files. If that information is scattered, duplicated, outdated, or poorly structured, the AI will inherit the mess.

A stronger model does not fix weak data. It may only make the weak answer sound more convincing.

The second layer is retrieval. Retrieval decides what the model sees before it responds. This is not a small backend detail. It shapes the entire user experience.

If the system retrieves the wrong source, the answer can be wrong even if the model behaves perfectly. If old and new documents are treated equally, the answer may sound right while being outdated. If the system pulls too much context, the model gets noise. If it pulls too little, it misses the point.

Production-ready AI needs retrieval that is intentional. It needs ranking, metadata, source control, freshness checks, and refusal paths when the right information is not available.

The third layer is evaluation.

This is where many AI systems become dangerously vague. Teams keep changing prompts, switching models, adjusting temperature, rewriting instructions, and saying the output “feels better.”

But feeling better is not a quality standard.

A production AI system needs a way to measure whether it is improving. Take real questions users might ask. Define what a good answer looks like. Define what a bad answer looks like. Include edge cases. Include missing-context situations. Include examples where the system should refuse instead of guessing. Then test changes against the same set.

Without evals, AI improvement becomes a taste debate. With evals, it becomes engineering.

The fourth layer is fallback behaviour.

AI systems will fail. They will misunderstand a question. They will miss context. They will face unclear inputs. They will sometimes lack enough information to answer well.

That is not the problem. The problem is pretending this will not happen.

Production-ready AI knows what to do when confidence is low. It can ask a clarifying question. It can show source material. It can route to a human. It can refuse to answer. It can fall back to search. It can log the issue for review. It can stop before producing something risky.

The fifth layer is monitoring.

Once AI is live, it does not stay still. User behaviour changes. Data changes. Business rules change. Model providers update silently. A workflow that performed well last month can start failing quietly this month.

Production AI needs visibility. Someone should be able to see repeated failures, low-confidence outputs, retrieval misses, strange user patterns, latency issues, cost spikes, and output drift.

Monitoring does not make the system perfect. It makes the system accountable.

The sixth layer is human review.

Not every AI output should go directly to a user or business process. Some use cases are low-risk. Others affect customer trust, financial decisions, legal exposure, medical information, hiring, operations, or brand reputation.

Human review is not a weakness in the system. It is part of the design. The goal is not to automate everything. The goal is to automate the right things, with the right level of control.

The seventh layer is model flexibility.

Models change. Pricing changes. Latency changes. Output formats change. Provider behaviour changes. If the entire workflow depends on one model behaving one exact way forever, the business has created a fragile dependency.

Production-ready AI should be designed so the business logic is not trapped inside a single provider.

The final layer is ownership.

AI systems age. They need maintenance. They need review. They need updates when business rules change, when data changes, when users behave differently, or when failure patterns appear.

Someone needs to know what the system is supposed to do, what it should never do, how quality is measured, what gets logged, what gets reviewed, and what happens when something breaks.

That is the real definition of production-ready AI.

It is not a better prompt. It is not a more powerful model. It is not a feature label on a product page.

It is a system with usable data, grounded retrieval, measurable quality, safe fallbacks, live monitoring, human review where needed, flexible architecture, and clear ownership.

The visible part of AI is the answer. The valuable part is everything that makes the answer dependable.`
  },
  {
    id: "why-ai-assisted-brand-marketing-matters",
    title: "Why AI-Assisted Brand Marketing Matters",
    date: "Jun 2026",
    readTime: "7 min read",
    status: "Published",
    excerpt: "AI’s real marketing advantage is not infinite content. It is faster exploration, cheaper testing, and a shorter distance between an idea and evidence.",
    content: `Modern brand marketing does not move in one straight line anymore.

A brand is no longer built through one campaign, one photoshoot, one slogan, and one set of visuals repeated everywhere. It has to show up across product pages, Instagram, LinkedIn, ads, email, reels, marketplaces, landing pages, launch campaigns, seasonal drops, and customer touchpoints that all behave differently.

Every platform wants a different format. Every audience responds to a different angle. Every campaign needs more variation than the last one.

Brands do not just need more content. They need faster creative thinking.

That is why AI-assisted brand marketing matters.

Not because AI can generate images, captions, or campaign ideas on command. The real value is speed of exploration.

AI gives brands a faster way to test directions before committing heavily to one. It helps teams explore different moods, formats, product contexts, audience angles, campaign visuals, and message variations without turning every creative question into a full production cycle.

A campaign is a bet. A photoshoot is a bet. A visual direction is a bet. A positioning angle is a bet. Traditional creative production often makes those bets expensive before the brand has enough evidence.

AI-assisted marketing changes that rhythm. It lets a brand explore before it spends heavily. It lets the team see multiple possible creative worlds before choosing one. It turns early campaign thinking into something more visual, more testable, and less dependent on guesswork.

This does not mean strategy disappears. It means strategy gets more room to breathe.

When execution is slow, teams often become conservative. They choose safer ideas because every experiment costs time, money, and coordination. When execution becomes faster, teams can test more possibilities without treating every variation like a major commitment.

That is useful for almost every brand, but especially for D2C, fashion, beauty, jewellery, food, lifestyle, and e-commerce brands where visual identity directly affects trust.

Customers do not evaluate a brand only by what it says. They evaluate it by how it feels.

The product image. The model. The background. The colour tone. The styling. The lighting. The layout. The ad creative. The landing page visual. The way the brand appears in the first three seconds of attention.

All of that shapes perception before the customer reads a single line of copy.

AI-assisted brand marketing helps brands work with that perception more intelligently. A skincare brand can test different skin tones, routines, settings, ingredient-led visuals, or premium editorial directions. A fashion brand can explore styling variations, body types, seasonal contexts, and campaign moods. A jewellery brand can test close-up product focus, on-model imagery, luxury gifting angles, or everyday wear positioning.

These are not just aesthetic choices. They are business decisions.

The right visual direction can make a product feel more premium, more relatable, more trustworthy, more giftable, more wearable, or more urgent. The wrong one can make the same product feel generic, confusing, or forgettable.

More assets do not automatically mean better marketing. A brand can generate hundreds of visuals and still say nothing clearly.

AI assistance matters when it is guided by taste, positioning, and intent.

What is this campaign supposed to do? Sell a product faster? Make the brand feel more premium? Explain a new feature? Reduce hesitation? Support a launch? Refresh tired ad creative? Show the product in use? Create enough variation for testing?

Each goal needs a different creative direction. AI can help produce the options faster, but the direction still has to come from strategy.

AI-assisted brand marketing is not about handing the brand over to a tool. It is about using AI inside a considered creative workflow. Strategy decides the purpose. Human judgement decides what feels right. AI helps explore, produce, adapt, and scale the work faster than traditional production alone.

That combination is powerful because modern marketing has a speed problem.

Ad creative gets tired quickly. Product launches need assets faster. Seasonal campaigns move in shorter cycles. Social platforms reward freshness. E-commerce pages need constant improvement. Brands need more variants, more often, without making every refresh feel like a full campaign rebuild.

AI assistance helps reduce that friction.

A single product can be explored across multiple visual settings. A campaign can be adapted for different formats. A product image can become a social creative, a marketplace visual, a launch banner, an ad variant, and a landing page asset. A brand can test which direction earns attention before scaling production around it.

That is not just faster production. That is better marketing intelligence.

AI-assisted workflows also help smaller brands compete with larger ones. AI lowers the cost of exploration. It gives smaller teams access to more visual possibilities without requiring the same production overhead. That does not remove the need for taste. If anything, it makes taste more important, because the number of possible outputs becomes much larger.

When everyone can produce more, the advantage moves to the brands that can choose better.

The future of brand marketing will not belong to the brands that generate the most assets. It will belong to the brands that learn faster, test smarter, and keep their visual identity consistent while adapting to new channels.

Without strategy, AI creates noise. With strategy, it creates range.

Modern brands need to move quickly without becoming careless. They need more variation without losing consistency. They need to test more without making every experiment expensive. They need to stay visually fresh without rebuilding their identity every month.

AI assistance gives them a way to do that. Not as a shortcut. As a sharper workflow.`
  }
];
