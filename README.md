# Fitly Web

Fitly Web is a React/TypeScript frontend for a metadata-driven ERP system.

If you come from Java and ZK/ZUL, start with:

1. [`docs/java-zul-developer-guide.md`](docs/java-zul-developer-guide.md)
2. [`docs/frontend-architecture.md`](docs/frontend-architecture.md)
3. `src/app/main.tsx`
4. `src/app/App.tsx`
5. `src/layout/AppLayout.tsx`
6. `src/workspace/ui/WorkspaceRenderer.tsx`
7. `src/studio/screen/service/screen-service.ts`

## Main rule

Code dependencies flow in one direction:

```text
component -> hook -> service -> api
                         \-> mapper -> model
```

- `api` only communicates with the backend.
- `service` coordinates a use case.
- `mapper` converts backend/demo data to a UI model.
- `model` contains TypeScript contracts.
- `components` render UI and handle local interaction.
- `demo` and `metadata` contain development fallback data, not production logic.

Screen is a container only. `GRID`, `DETAIL`, `TREE`, `FORM`, and other
presentation types belong to Section and are dispatched by `SectionRenderer`.

See `ai-rules/project-rule.md` before changing the architecture.
