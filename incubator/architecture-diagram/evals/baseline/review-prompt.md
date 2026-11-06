You are a context-free reviewer of an architecture diagram. Read ONLY the source text in `scenario.md` and every PNG in the folder `images`. Read nothing else on the filesystem.

Report in English, concisely:

1. For each page: the question it answers, a score out of 10 for fidelity to the source and clarity, and anything misleading (lines that read as boundaries, detours, tangled or crossing lines, ambiguous membership, unclear line styles or ends).
2. Every line style and line end, and whether a key explains it or you had to guess.
3. Is the amount of content right for one image that a reader sees about 900 pixels wide in a wiki: too crowded, about right, or too sparse? Would splitting help or hurt? Is anything from the source missing?
4. An overall score out of 10, and the top three problems, most important first.

End your answer with one line in exactly this form, with one number: `SCORE: <overall score>`
