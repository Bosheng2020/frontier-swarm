# Security Policy

Frontier Swarm is preview software for orchestrating AI agents. It has not received a public security audit and is not warranted for production or high-impact use.

## Supported versions

Security fixes are made on a best-effort basis for the current `main` branch only.

| Version | Supported |
| --- | --- |
| `main` / latest preview | Yes, best effort |
| Older commits, forks, or deployments | No |

Until a stable release exists, updates may include breaking changes.

## Reporting a vulnerability

Please do **not** open a public issue for a suspected vulnerability.

Use the repository's GitHub **Report a vulnerability** flow to create a private security advisory. Include only the information needed to reproduce and assess the issue:

- affected commit or version;
- affected component and deployment mode;
- impact and realistic attack scenario;
- minimal reproduction steps or proof of concept;
- whether credentials, user data, external side effects, or cross-tenant access are involved;
- suggested mitigation, if known.

Remove live secrets, personal data, customer content, and production tokens from the report. If private reporting is not enabled, contact a maintainer through a non-public channel listed on their GitHub profile and ask for a secure reporting path; do not send exploit details in the first message.

## What to expect

Maintainers will make a best-effort attempt to:

1. acknowledge a complete private report;
2. reproduce and assess severity;
3. coordinate a fix and disclosure plan where appropriate;
4. credit the reporter if requested and safe to do so.

This community preview has no guaranteed response or remediation SLA. Please allow reasonable time for investigation before public disclosure.

## In scope

- authorization or authentication bypass;
- secrets exposed to prompts, models, sandboxes, logs, or other users;
- cross-session or cross-tenant data access;
- sandbox escape caused by repository code or configuration;
- approval bypass for external side effects;
- prompt-injection paths that cross a documented security boundary;
- dependency or workflow compromise specific to this repository;
- denial-of-service or cost-amplification flaws that bypass documented limits.

## Usually out of scope

- inaccurate, biased, or undesirable model output without a security-boundary violation;
- provider outages or vulnerabilities in an upstream service with no project-specific impact;
- attacks requiring the reporter's own already-authorized credentials and causing no privilege escalation;
- social engineering, spam, or physical attacks;
- findings from automated scanners without a reproducible security impact;
- exposed credentials that are examples, placeholders, expired, or already revoked.

Upstream vulnerabilities should also be reported to the relevant upstream maintainer. Please still report them here privately when Frontier Swarm makes the impact materially worse.

## Safe research

Test only against accounts, data, and infrastructure you own or are authorized to assess. Do not access other users' data, degrade shared services, persist access, or incur material provider costs. Stop testing and report immediately if you encounter real secrets or personal data.

## Deployment responsibility

Operators are responsible for route authentication, tool authorization, approval policy, connection scopes, sandbox isolation, network egress, budget limits, logging, retention, and legal compliance. Review the full [security model and hardening checklist](docs/security.md) before deploying.
