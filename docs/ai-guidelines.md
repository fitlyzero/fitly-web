# AI Development Guidelines for Fitly UI

Read `ai-rules/project-rule.md` and `docs/frontend-architecture.md` before changing
the project.

## Boundaries

- Keep bootstrap and routing in `app`.
- Keep authentication outside the application layout.
- Navigation resolves menu targets but never renders screen content.
- Workspace owns open content and tabs but never interprets field types.
- Screen is only a container of sections and has no presentation type.
- ScreenRenderer only iterates sections; SectionRenderer dispatches section types.
- GridSection delegates all field presentation to FieldRenderer and FieldRegistry.
- MUI is the visual foundation; do not add or mix another component framework.

## Change discipline

- Inspect existing components before creating one.
- Keep state local unless multiple application areas genuinely share it.
- Put typed backend calls in the owning API module.
- Put multi-request orchestration in the owning service module.
- Put DTO-to-UI conversion in a mapper; API/service modules must not import components.
- Keep existing local fallback records under an explicitly named `demo` directory.
- Preserve current visual density and workflows.
- Avoid speculative screen types, wrappers, hooks, contexts, barrels, demos, and mocks.
- Do not run build, tests, lint, dependency installation, or the application unless
  explicitly requested.
