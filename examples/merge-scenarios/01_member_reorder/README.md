Scenario 01 — Member reorder

Goal
- Create a small class where one branch (OURS) inserts a new method, and the other branch (THEIRS) reorders existing methods.

Why this is interesting
- Line-based three-way merge (diff3 / git merge) often reports conflicts when lines are moved or reordered even if changes are independent.
- AST-aware merging (mergiraf) can match members by their identifier (method name) and merge additions/reorders without conflict.
- mergiraf-semi (semi-commutative) may behave differently depending on whether reordering is considered safe for the language; it might produce a conservative result or semi-merge markers when reorder could change semantics (rare for method order, but ordering can matter for readability/tools).

Files
- `BASE.swift` — original file
- `OURS.swift` — adds `subtract` between `add` and `multiply`
- `THEIRS.swift` — moves `multiply` above `add`

Expected difference in outputs (qualitative)
- diff3 / standard git merge: likely a conflict because THEIRS moved `multiply` and OURS changed the lines around it.
- mergiraf: likely a clean merge (adds `subtract` and keeps methods present; ordering may be normalized by the AST policy — merged result typically contains all three methods with a deterministic order).
- mergiraf-semi: may either cleanly merge or produce a semi-merge depending on project rules; useful to test.
