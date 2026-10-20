# Fitly Frontend Architecture

Fitly Web is a metadata-driven ERP frontend. The backend owns screen definitions,
permissions, validation, translations, and business rules. The frontend renders
those contracts through a stable application shell.

## Source structure

```text
src/
  app/          Bootstrap, providers, and centralized routes
  auth/         Login, password recovery, session, API, service, and demo fallback
  layout/       AppLayout and AppHeader
  workspace/    Open targets, tabs, and WorkspaceRenderer
  api/          Cross-domain API primitives when required
  common/api/   Shared API envelope contracts
  studio/
    navigation/ Workspace navigation UI and API
    screen/     Screen container API, service, mapper, demo data, model, and renderer
    section/    Section API, mapper, models, and GRID/DETAIL/TREE renderers
    field/      Field models, registry, components, and shared primitives
    shared/     Utilities shared by Studio domains
  theme/        MUI theme and brand assets
  components/   Fitly components with shared behavior
```

## Rendering flow

```text
AppLayout
  -> Navigation opens a WorkspaceTarget
  -> WorkspaceRenderer loads ScreenMetadata
  -> ScreenService coordinates API calls and mapping
  -> ScreenRenderer iterates ScreenMetadata.sections
  -> SectionRenderer selects GRID, DETAIL, TREE, FORM, or another section type
  -> The selected Section component delegates values to FieldRenderer
  -> FieldRenderer resolves a component from FieldRegistry
  -> The data-type-specific field delegates reusable behavior to field/shared
  -> MUI renders the component
```

Screen is only a container for ordered sections. It has no GRID, DETAIL, TREE, or
CUSTOM type. Those presentation types belong to Section. ScreenRenderer never
selects a presentation implementation; it only renders the screen's sections.
SectionRenderer is the single dispatcher for section types.

Navigation does not render screens. Workspace, ScreenRenderer, and SectionRenderer
do not interpret field data types. Every StudioDataType has its own registered
field component.

## Metadata contracts

```text
ScreenMetadata
  screenId
  title
  subtitle?
  sections: SectionMetadata[]

SectionMetadata
  sectionId
  title
  sectionType: GRID | DETAIL | TREE | HERO | STATS | FORM | WORKFLOW | PROFILE
```

`GRID`, `DETAIL`, and `TREE` must never be added back to ScreenMetadata.

## UI foundation

Material UI and MUI X Data Grid are the only component framework. Shared colors,
typography, density, and component defaults belong in `src/theme/theme.ts`.
Application screens use Fitly-owned components only where they centralize real
behavior, such as the standard ERP DataGrid.

## Authentication

Login and password recovery send account credentials only; the backend determines
the deployment context. Auth pages remain outside AppLayout.

## Layer responsibilities

Inside a feature domain, dependencies flow in this direction:

```text
component -> hook -> service -> api
                         \-> mapper -> model
```

- `api` contains backend calls only.
- `service` coordinates a complete use case.
- `mapper` converts API DTO or demo metadata into UI models.
- `model` contains contracts without UI behavior.
- `components` render models and own local interaction state.
- `demo` and `metadata` are explicit development fallbacks.

API and service modules must never import React components. Cross-domain cleanup
such as resetting Workspace during sign-out belongs in the application composition
layer, not inside Auth services.
