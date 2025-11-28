Scenario 02 — Enum cases (implicit raw-value/order implications)

Goal
- Demonstrate how adding enum cases in different places can lead to different merge outcomes.

Why this is interesting
- Swift enums without explicit raw values use implicit ordering/indices; inserting a case in the middle can change the numeric values of subsequent cases.
- diff3 may conflict when both branches modify the same line (the `case` list) even if both edits add different names.
- mergiraf (AST-aware, commutative settings) can often merge the additions by recognizing case identifiers.
- mergiraf-semi may be conservative because inserting in the middle changes implicit raw value semantics and could emit a semi-merge or warn; behaviour depends on language config and safety rules.

Files
- `BASE.swift` — `case red, green, blue`
- `OURS.swift` — inserts `yellow` between `red` and `green` (changes implicit ordering)
- `THEIRS.swift` — appends `cyan` after `blue` (safe append)

Expected difference in outputs (qualitative)
- diff3 / git merge: likely a conflict because the `case` line was edited in both branches.
- mergiraf: if enum entries are considered commutative (or if identity rules match by case name), it can merge both additions into a list containing all four names; ordering may be normalized or preserved depending on rules.
- mergiraf-semi: may flag the middle insertion as risky (changes implicit indices) and either refuse to reorder or produce a semi-merge with markers or comments.
