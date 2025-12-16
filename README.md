# Mergiraf for Swift

This project aims to extend **[mergiraf](https://mergiraf.org/)**—a syntax-aware git merge driver—to support the **Swift** programming language.

By leveraging syntax-aware merging, this adaptation seeks to reduce merge conflicts in Swift projects, particularly in scenarios where standard line-based tools (like `diff3`) struggle.

## Project Goal

The primary objective is to adapt `mergiraf` and `mergiraf-semi` to parse and merge Swift code structurally. This repository serves as the development workspace for:

1.  **Integrating Swift Grammar**: Adding support for Swift to `mergiraf` and `mergiraf-semi`.
2.  **Validation**: Benchmarking the new Swift capabilities against standard merge tools using a custom test suite.

## Repository Structure

  * **`.devcontainer/`**: Docker configuration for a consistent development environment (currently misconfigured).
  * **`mergiraf-semi/`**: The core source code (Rust) for the merge driver.
      * **`examples/swift/`**: A collection of 3-way merge scenarios (Left, Base, Right) used to test Swift merging.
      * **`tools/`**: Python scripts developed to run these scenarios, verify outputs, and generate accuracy metrics (Confusion Matrices, Pairwise Comparisons).

## Getting Started

### Prerequisites

  * **Rust**: To build the merge driver.
  * **Python 3.7+**: To run the validation scripts.
  * **VS Code (Optional)**: Open this folder in a container using the provided `.devcontainer` configuration.

### Build and Test

1.  **Build the Project**:
    Navigate to the source directory and build the binaries.

    ```bash
    cd mergiraf-semi
    cargo build
    ```

2.  **Run Swift Scenarios**:
    We have implemented a suite of tools to validate the Swift integration. To run the merge driver against all Swift examples:

    ```bash
    # Runs the merge driver on all scenarios in examples/swift
    python3 tools/run_merge_examples.py --build
    ```

3.  **Compute Metrics**:
    To see how `mergiraf` compares to `diff3` on the Swift codebase:

    ```bash
    # Generates success/conflict statistics and pairwise comparisons
    python3 tools/compute_comparison_metrics.py
    ```

For detailed documentation on the testing scripts, please refer to [mergiraf-semi/tools/README.md](https://www.google.com/search?q=mergiraf-semi/tools/README.md).