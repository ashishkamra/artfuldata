# Repository Guidelines

## Project Structure & Module Organization
This repository currently holds only top-level docs (`README.md`, `LICENSE`). Place all production code under `src/artfuldata/` and keep modules cohesive by domain (e.g., `src/artfuldata/ingest`, `src/artfuldata/transform`). Store reusable notebooks under `notebooks/` with a short preface explaining their intent; export any datasets or fixtures to `data/raw/` or `data/processed/` as appropriate. Tests live in `tests/` and mirror the package layout. Static assets such as diagrams or reference CSV schemas go in `assets/` to keep `src/` focused on executable code.

## Build, Test, and Development Commands
- `python3 -m venv .venv && source .venv/bin/activate` – create an isolated environment before installing dependencies.
- `pip install -r requirements.txt` – install runtime and development packages; pin versions to keep the data pipelines reproducible.
- `pytest` – run the default test suite; use `pytest -k smoke` for quick validation prior to pushing.
- `ruff check src tests` and `black src tests` – lint and format Python sources; run both before opening a PR.

## Coding Style & Naming Conventions
Target Python 3.11. Use `black` defaults (88 char width) and `ruff` to enforce imports and docstring conventions. Name modules and packages with snake_case; reserve PascalCase for classes and SCREAMING_SNAKE_CASE for constants. Keep notebooks lightweight and export reusable code into modules; annotate key functions with type hints to help reviewers orient quickly.

## Testing Guidelines
Write tests with `pytest` and organize them by feature (`tests/ingest/test_sources.py`). Prefer descriptive test names such as `test_fetch_artwork_returns_expected_columns`. Add fixtures for sample datasets instead of committing large files; use factories in `tests/fixtures/` for repeated setups. Maintain ≥80% coverage on new modules and document any intentional gaps in the PR description.

## Commit & Pull Request Guidelines
Follow Conventional Commits (`feat:`, `fix:`, `docs:`) so release notes can be generated automatically. Keep commits scoped to a single concern and include context on data sources touched. For every PR, link the tracking issue, summarize the change, note any schema or configuration updates, and attach screenshots for UI-facing outputs (e.g., dashboards). Confirm that lint, tests, and data validations were run locally before requesting review.
