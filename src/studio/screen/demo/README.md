# Demo screen data

This directory is a fallback repository for local development. It is not part of
the Studio backend contract and must not contain production business rules.

- `demo-workspace-catalog.ts` registers local ERP screens.
- `demo-sales-document-record.ts` provides sales-order rows and columns.
- `demo-user-form.ts` provides a sample metadata form.

Application code accesses this data only through
`findDemoWorkspaceModule()` in `screen-service.ts`. New backend-driven screens
belong in `screen/api`, `screen/service`, and `screen/mapper` instead.
