# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project intends to use [Semantic Versioning](https://semver.org/spec/v2.0.0.html) once versioned releases begin.

## [Unreleased]

### Added

- Preview implementation of a staged multi-agent pipeline: Planner → parallel Analyst/Researcher/Builder → parallel Critic/Verifier → Synthesizer.
- eve v0.81.1 project configuration and specialist subagent roles.
- Seven deterministic schema contract tests, agent discovery validation, and build CI.
- Search-oriented README structure, direct-answer FAQ, Chinese overview, primary-source map, and machine-readable project metadata.
- Architecture, evaluation, security, contribution, and community documentation.

### Security

- Documented that subagent delegation is not an authorization boundary.
- Added guidance for route authentication, tool approval, sandbox isolation, least-privilege credentials, budget limits, and private vulnerability reporting.

### Known limitations

- The project remains preview software with no stability or production-support guarantee.
- No public benchmark results are available, and no state-of-the-art claim is made.
- Parallel model execution can materially increase token usage and monetary cost.

<!--
Release checklist:
1. Move Unreleased entries into a dated version section.
2. Link the version diff after the repository URL is known.
3. Include migration notes for every breaking change.
4. Link reproducible benchmark artifacts for any performance claim.
-->
