Scenario 03 — Property observers vs default value change

Goal
- Show a case where one branch adds property observers to a property and another branch changes the property's default value.

Why this is interesting
- These two edits touch the same declaration (`var nicknames: [String] = ...`) but in different ways:
  - OURS adds `willSet`/`didSet` blocks around the property
  - THEIRS changes the initializer/default value
- A line-based merge will likely produce a conflict because both branches edit the same lines.
- mergiraf (AST-aware): depending on node-level identity and whether property modifiers/observers are matched as independent children, it may be able to merge the observer blocks and the new default value into a single declaration automatically.
- mergiraf-semi: may be conservative and either produce a semi-merge or keep the conflict, since observers and initializer interact semantically.

Files
- `BASE.swift` — original property with empty array default
- `OURS.swift` — adds observers (willSet/didSet)
- `THEIRS.swift` — changes default initializer value

Expected difference in outputs (qualitative)
- diff3 / git merge: conflict on the property declaration block.
- mergiraf: might be able to merge both edits (property with observers and the new default value) into a single declaration if the language config treats the initializer value and the observer clauses as independent children.
- mergiraf-semi: may not auto-merge due to potential semantic interaction; may produce a semi-merge highlighting the change.
