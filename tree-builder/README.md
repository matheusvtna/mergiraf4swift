# merge-and-code-review

This project contains a small Node-based parser that uses `tree-sitter-swift` to parse Swift source files.

## Usage

- Place your Swift file(s) into `src/inputs/`.
- Run the parser with the filename as an argument (from project root):

```bash
# direct node invocation
node src/tree-build.js src/inputs/example.swift

# or via npm scrip:
npm start inputs/example.swift
```

## Output

- The parser writes a textual representation of the parse tree to `src/outputs/` using the same filename with the suffix `_tree` (e.g. `example_tree.swift`).

## Notes
**The devcontainer is misconfigured and needs to be fixed**
- The devcontainer is configured to use the official Node devcontainer image and includes minimal build tools required for native Node modules.
- If your `tree-sitter` native modules fail to build, ensure `build-essential`, `python3`, and `g++` are available.
