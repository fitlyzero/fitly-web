# FITLY WEB FRONTEND DEVELOPMENT RULES

You are working on **Fitly Web**, a metadata-driven ERP frontend.

The frontend stack is:

* React
* TypeScript
* Vite
* Material UI (MUI)
* MUI X Data Grid where appropriate

The backend is responsible for business logic, metadata, permissions, translations, validation rules, and screen definitions.

The frontend is responsible for rendering those definitions consistently.

The main goals are:

* clean code
* predictable architecture
* reusable UI components
* minimal duplication
* easy maintenance
* easy AI-assisted development
* support for Dynamic UI
* support for custom screens in the future

Do not redesign the architecture unless explicitly requested.

---

# 1. MOST IMPORTANT DEVELOPMENT PRINCIPLES

Always inspect the existing project before writing code.

Before creating anything new:

1. Find whether an equivalent component already exists.
2. Find whether an existing abstraction can be reused.
3. Follow the existing project structure.
4. Make the smallest reasonable change.
5. Do not perform unrelated refactoring.

Prefer simple and explicit code over clever abstractions.

Do not generate code just because an abstraction might theoretically be useful later.

Create variables close to where they are used.

Do not move every value, callback, dependency, or configuration to the top of the component unless there is a clear reason.

Do not create unnecessary intermediate variables.

Do not create wrappers whose only purpose is renaming another component.

---

# 2. DO NOT OVER-ENGINEER

Do not automatically create:

* hooks
* contexts
* providers
* services
* utility classes
* generic components
* adapter layers
* factories
* managers
* helper files
* index/barrel files

unless there is a clear architectural reason.

Do not split a 20-line component into five files.

Do not create a custom hook simply to move code out of a component.

A custom hook should only exist when:

* the logic has meaningful React lifecycle/state behavior,
* it is reused,
* or separating it creates a clear responsibility boundary.

Do not introduce global state for data used only in one area.

Keep state as local as reasonably possible.

---

# 3. PROJECT STRUCTURE

Use a domain-oriented structure.

Preferred high-level structure:

src/
├── auth/
├── layout/
├── navigation/
├── workspace/
├── screen/
├── field/
├── api/
├── model/
├── theme/
└── components/

Do not create generic folders such as:

* common
* shared
* misc
* helpers
* stuff

unless there is a genuinely clear reason.

Components should live near the feature that owns them.

---

# 4. APPLICATION ARCHITECTURE

The application has four primary areas:

1. Auth
2. Application Layout
3. Navigation
4. Workspace

High-level structure:

App
├── Auth
│   ├── AuthLayout
│   ├── LoginPage
│   └── ForgotPasswordPage
│
└── AppLayout
├── AppHeader
├── Navigation
│   └── MenuTree
└── Workspace

Responsibilities must remain clearly separated.

---

# 5. AUTH

Authentication screens are outside the main application layout.

Initial screens:

* Login
* Forgot Password

Structure:

AuthLayout
├── LoginPage
└── ForgotPasswordPage

Auth screens must not display:

* application header
* navigation menu
* workspace

Do not put authentication API implementation directly inside low-level visual components.

Do not mix authentication business logic and page layout unnecessarily.

---

# 6. APPLICATION LAYOUT

After authentication, the user enters AppLayout.

AppLayout consists of:

AppLayout
├── AppHeader
├── Navigation
└── Workspace

AppLayout is responsible only for global application positioning and layout.

It must not:

* interpret screen metadata
* render field types
* contain business logic of screens
* contain grid-specific behavior
* call arbitrary screen APIs

Keep AppLayout stable.

Screens must not control the global application layout.

---

# 7. HEADER

The application header contains:

Left side:

* Fitly logo

Right side:

* user avatar
* user display name

Avatar and user display name belong to the same user profile area.

Clicking this area navigates to the user's personal information/profile screen.

Do not implement profile as a popup unless explicitly requested.

Preferred structure:

AppHeader
└── UserProfileButton

Do not duplicate profile UI logic elsewhere.

Header styling must follow the central theme.

---

# 8. NAVIGATION

The navigation area is a sidebar containing a tree menu.

Preferred structure:

Navigation
└── MenuTree
└── MenuItem

Navigation must support:

* hierarchical menu
* expand
* collapse
* active item
* selecting menu entries
* hiding/collapsing the navigation sidebar

When navigation is hidden, Workspace expands to use the available space.

Menu data must come from a model/API.

Never hard-code the actual ERP menu structure in JSX.

Navigation is responsible for navigation only.

Navigation must NOT render screens directly.

When a menu item is selected:

MenuTree
→ resolve menu target
→ request Workspace to open target

Navigation must not know how the target screen is rendered.

---

# 9. WORKSPACE

Workspace is the central application area where functions are opened.

Workspace must support multiple content types over time.

Potential workspace types:

* SCREEN
* DASHBOARD
* REPORT
* CUSTOM
* POS

Do not implement unused types until requested.

Currently focus on:

SCREEN

Preferred flow:

User selects Menu
→ Workspace opens target
→ WorkspaceRenderer
→ ScreenRenderer
→ Screen implementation

Structure:

Workspace
└── WorkspaceRenderer
└── ScreenRenderer

Workspace must not know:

* individual field types
* MUI field components
* how a GridSection renders a date
* how a reference field works

Workspace manages opened content, not field rendering.

---

# 10. SCREEN ARCHITECTURE

Screen is only an ordered container of Section metadata.

Required contract:

ScreenMetadata
└── sections: SectionMetadata[]

Screen must not contain `screenType`, GRID, DETAIL, TREE, FORM, or CUSTOM
presentation decisions. ScreenRenderer only iterates `screen.sections` and delegates
every item to SectionRenderer.

Architecture:

ScreenRenderer
└── SectionRenderer
    ├── GridSection
    ├── DetailSection
    ├── TreeSection
    ├── FormSection
    └── ...

SectionRenderer is the single responsibility point for selecting section
implementations.

---

# 11. GRID SECTION

Grid is a Section presentation type.

GridSection is responsible for:

* receiving section metadata
* receiving field metadata
* creating grid columns
* displaying records
* coordinating grid-level actions
* delegating field display to the Field layer

GridSection must NOT contain field-type-specific rendering logic.

Forbidden inside GridSection:

if (field.dataType === "DATE") {
...
}

if (field.dataType === "BOOLEAN") {
...
}

switch (field.dataType) {
...
}

GridSection must delegate field behavior to the FieldRegistry / FieldRenderer.

---

# 12. FIELD ARCHITECTURE

Field rendering is an independent architecture layer.

Structure:

field/
├── FieldRenderer
├── FieldRegistry
├── input/
└── cell/

Conceptually:

Field Metadata
→ FieldRenderer
→ FieldRegistry
→ Fitly Field Component
→ MUI

Screens must not decide which MUI component represents a field type.

The Field layer owns that decision.

---

# NOTE: NAMING CONVENTION UPDATE (reflects current code)

The `Fitly<Type>Field` naming used as an example in sections 13-16 below was
never adopted for field components. The convention actually implemented and
registered in `src/studio/field/renderer/field-registry.ts` is `<Type>Field`
(`StringField`, `AmountField`, `SearchField`, `BooleanField`, ...), matching
`ai-rules/AGENTS.md`. Read sections 13-16 for the *architectural intent*
(one component per StudioDataType, centralized registry, input/cell split),
not for the exact component names — check `field-registry.ts` for those.
`FitlyDataGrid` remains the one real "Fitly" wrapper, per section 16's own
guidance to only centralize where there is genuine shared behavior.

---

# 13. FIELD TYPES

Initial field types should include:

STRING
TEXT
INTEGER
DECIMAL
BOOLEAN
DATE
DATETIME
LIST
REFERENCE

Do not implement unnecessary types until needed.

Suggested mapping:

STRING
→ FitlyTextField

TEXT
→ FitlyTextAreaField

INTEGER
→ FitlyNumberField

DECIMAL
→ FitlyNumberField

BOOLEAN
→ FitlyBooleanField

DATE
→ FitlyDateField

DATETIME
→ FitlyDateTimeField

LIST
→ FitlySelectField

REFERENCE
→ FitlyReferenceField

Future field types may include:

* FILE
* IMAGE
* PASSWORD
* COLOR
* RICH_TEXT

Do not implement future components until requested.

---

# 14. INPUT COMPONENTS AND GRID CELL COMPONENTS

Do not assume the same component should render both forms and grids.

Separate editing/input UI from compact display UI.

Preferred structure:

field/
├── FieldRenderer.tsx
├── FieldRegistry.ts
│
├── input/
│   ├── TextField
│   ├── TextAreaField
│   ├── NumberField
│   ├── BooleanField
│   ├── DateField
│   ├── DateTimeField
│   ├── SelectField
│   └── ReferenceField
│
└── cell/
├── TextCell
├── NumberCell
├── BooleanCell
├── DateCell
├── DateTimeCell
├── SelectCell
└── ReferenceCell

For example:

BOOLEAN in a form:

[✓] Active

BOOLEAN in a grid:

✓

REFERENCE in a form:

[ Customer name          ▼ ]

REFERENCE in a grid:

Customer name

The registry may therefore conceptually map:

STRING:
input → TextField
cell → TextCell

BOOLEAN:
input → BooleanField
cell → BooleanCell

REFERENCE:
input → ReferenceField
cell → ReferenceCell

This selection logic belongs in FieldRegistry.

---

# 15. FIELD REGISTRY

Field types must be centrally registered.

Do not repeat field mapping logic in multiple screens.

Conceptual example:

const fieldRegistry = {
STRING: {
input: TextField,
cell: TextCell,
},
INTEGER: {
input: NumberField,
cell: NumberCell,
},
DECIMAL: {
input: NumberField,
cell: NumberCell,
},
DATE: {
input: DateField,
cell: DateCell,
},
BOOLEAN: {
input: BooleanField,
cell: BooleanCell,
},
REFERENCE: {
input: ReferenceField,
cell: ReferenceCell,
},
};

Do not duplicate this mapping elsewhere.

Adding a new field type should normally require changing the Field layer only.

---

# 16. FITLY UI COMPONENTS

Application code should prefer Fitly-owned components rather than directly using raw MUI components everywhere.

Examples:

FitlyButton
FitlyTextField
FitlyNumberField
FitlyDateField
FitlyDateTimeField
FitlyBooleanField
FitlySelectField
FitlyReferenceField
FitlyDataGrid
FitlyDialog
FitlySection

Raw MUI components may be used internally when implementing these Fitly components.

Application screens should reuse Fitly components where available.

Example:

Preferred:

<FitlyButton>
    Save
</FitlyButton>

Avoid repeatedly writing:

<Button
variant="contained"
size="small"
sx={{
...
}}

>

```
Save
```

</Button>

Do not create Fitly wrappers for every MUI component automatically.

Create a Fitly component when Fitly has common behavior, common styling, or common semantics that should be centralized.

---

# 17. FIELD COMPONENT RESPONSIBILITY

A Fitly field component should handle common UI behavior relevant to that field.

Possible metadata:

* name
* display name
* value
* mandatory
* readOnly
* disabled
* error
* error message
* description
* maximum length
* formatting
* permission
* options/reference information

Do not duplicate handling of these properties across screens.

Example conceptual metadata:

{
"fieldId": "...",
"name": "customerName",
"nameDisplay": "Customer",
"dataType": "REFERENCE",
"isMandatory": true,
"isReadOnly": false
}

Field components should interpret relevant field metadata consistently.

---

# 18. REFERENCE FIELD

REFERENCE is a first-class ERP field type.

Examples:

* Customer
* Product
* Organization
* Warehouse
* Sales Representative
* Document Type
* Price List

Do not treat REFERENCE as a simple generic Select by default.

The implementation may support:

* autocomplete
* remote search
* lookup dialog
* display value
* internal ID/value

Architecture:

REFERENCE
→ ReferenceField
→ Reference data source/API

Keep reference-specific logic inside the reference field layer.

Do not implement a different reference picker independently on each screen.

---

# 19. MUI USAGE

Use Material UI as the visual foundation.

Do not introduce another UI framework unless explicitly requested.

Do not mix:

* Ant Design
* Chakra
* Bootstrap
* custom component libraries

into the application without explicit approval.

Use MUI components when appropriate.

Examples:

* TextField
* Button
* Checkbox
* Dialog
* Autocomplete
* Drawer
* Tooltip
* IconButton

For large ERP tables, use MUI X Data Grid where appropriate.

---

# 20. STYLING RULES

The existing visual design is the reference.

Do not redesign existing screens unless explicitly requested.

Do not freely change:

* spacing
* colors
* typography
* borders
* component heights
* shadows
* density
* layout proportions

Prefer central theme configuration.

Common styles should live in:

theme/
├── theme.ts
└── component overrides if needed

Avoid large repeated inline `sx` objects.

Acceptable:

<Box sx={{ mt: 1 }}>

Avoid repeated large objects such as:

sx={{
height: 36,
borderRadius: 1,
fontSize: 13,
color: "...",
border: "...",
backgroundColor: "...",
...
}}

If a style appears repeatedly, move it into:

* theme
* Fitly component
* meaningful reusable component

Do not create a CSS file solely to move an `sx` object somewhere else.

Use the simplest styling approach possible.

---

# 21. MUI THEME

Use the MUI theme for application-wide visual consistency.

Centralize common:

* typography
* primary colors
* background colors
* border radius
* component density
* buttons
* form controls
* DataGrid behavior

Do not hard-code the same design values repeatedly.

Prefer theme configuration over scattered style constants.

---

# 22. DATAGRID

ERP grids should preferably use the common Fitly grid abstraction.

Preferred:

<FitlyDataGrid
rows={rows}
columns={columns}
/>

Common behavior should be centralized where appropriate:

* density
* row height
* header height
* pagination defaults
* empty state
* loading state
* selection behavior
* column styling

Do not duplicate the same DataGrid configuration on every screen.

However, do not create an excessively abstract generic grid framework.

Screen-specific columns and business behavior stay in the screen layer.

---

# 23. TYPESCRIPT

Use TypeScript properly.

Avoid:

any

Prefer:

* explicit interfaces
* typed API responses
* typed component props
* typed metadata
* typed registry definitions

Do not duplicate the same model interface in multiple places.

Do not create overly generic types when a concrete domain type is clearer.

Prefer simple readable TypeScript.

Avoid advanced type tricks unless they materially improve correctness.

---

# 24. REACT STATE

Keep state local when possible.

Do not automatically create global state management.

Do not introduce Redux, Zustand, MobX, etc. unless explicitly requested or clearly required.

Do not create Context just to avoid passing one or two props.

Do not store derived values as independent state.

Prefer:

const selectedCount = selectedRows.length;

instead of maintaining:

const [selectedCount, setSelectedCount] = ...

unless separate state is actually needed.

Avoid duplicated sources of truth.

---

# 25. EFFECTS

Do not overuse useEffect.

Do not use useEffect for values that can be derived during render.

Do not synchronize two states using effects if one can be derived from the other.

Use effects for actual external effects such as:

* API interaction
* subscriptions
* browser APIs
* lifecycle integration

Keep dependency arrays correct.

Do not suppress dependency warnings without understanding why.

---

# 26. CALLBACKS AND MEMOIZATION

Do not add:

useMemo
useCallback
memo

everywhere automatically.

Use them only when:

* there is a demonstrated reason,
* referential stability is actually required,
* or expensive computation needs memoization.

Prefer readable code over premature optimization.

---

# 27. API LAYER

UI components should not construct arbitrary backend URLs.

API calls belong in the API layer.

Example:

api/
├── authApi.ts
├── menuApi.ts
├── screenApi.ts
└── referenceApi.ts

Screen components consume typed functions.

Example:

const screen = await screenApi.loadScreen(screenId);

Avoid:

fetch("/api/....")

directly scattered throughout JSX components.

Do not create a separate service class just because Java projects commonly use services.

Use the simplest frontend API abstraction appropriate for the project.

---

# 28. BACKEND METADATA

Backend metadata is the source of truth for Dynamic UI.

Frontend should not duplicate metadata definitions unnecessarily.

Backend may define:

* Screen
* Section
* Field
* Data Type
* Mandatory
* Read Only
* Permission
* Display Name
* Translation
* Actions
* Validation
* Reference information

Frontend consumes metadata and renders it.

Do not hard-code ERP field behavior that backend metadata already describes.

---

# 29. DYNAMIC UI FLOW

Expected flow:

Backend
→ Screen Metadata
→ Workspace
→ ScreenRenderer
→ SectionRenderer
→ GridSection / DetailSection / TreeSection / other Section
→ FieldRegistry
→ Field Component
→ MUI

Example:

Backend:

{
"screenId": "sales-order",
"sections": [{
  "sectionType": "GRID",
  "fields": [
    { "name": "documentNo", "dataType": "STRING" },
    { "name": "orderDate", "dataType": "DATE" },
    { "name": "customer", "dataType": "REFERENCE" }
  ]
}]
}

Frontend:

Workspace
→ ScreenRenderer
→ SectionRenderer
→ GridSection
→ FieldRegistry

STRING
→ TextCell

DATE
→ DateCell

REFERENCE
→ ReferenceCell

Field-type decisions must remain centralized.

---

# 30. CUSTOM SCREENS

Not every ERP screen must be Dynamic UI.

Normal CRUD screens should preferably use metadata.

Examples:

* Order
* Invoice
* Product
* Business Partner
* Warehouse
* User

Specialized workflows may use custom React screens.

Examples:

* POS
* Dashboard
* Warehouse visualization
* specialized operational workflows

Custom screens should still reuse:

* Fitly theme
* Fitly field components
* Fitly buttons
* Fitly dialogs
* Fitly grid components

Do not duplicate the whole application design system inside a custom screen.

---

# 31. COMPONENT SIZE

Do not enforce arbitrary line limits.

However, large components should be reviewed for mixed responsibilities.

Split only when there is a meaningful boundary.

Good reason:

GridSection
→ GridToolbar
→ GridContent

if each contains meaningful separate behavior.

Bad reason:

GridSection
→ GridHeaderPart1
→ GridHeaderPart2
→ GridBodyWrapper

just to reduce line count.

Do not create tiny components that are used once and provide no readability benefit.

---

# 32. NAMING

Use clear responsibility-based names.

Good:

AppLayout
AppHeader
Navigation
MenuTree
Workspace
WorkspaceRenderer
ScreenRenderer
GridSection
FieldRenderer
FieldRegistry
ReferenceField
DateCell
ScreenMetadata
FieldMetadata

Avoid vague names:

Helper
Manager
Common
Utils
Thing
Handler
BaseComponent

unless those names accurately describe the responsibility.

Do not use Java-style naming patterns unnecessarily in React.

---

# 33. CLEAN JSX

Keep JSX readable.

Avoid deeply nested expressions.

Prefer calculating meaningful values before JSX when that improves clarity.

Avoid huge ternary expressions inside JSX.

Use early return where useful.

Example:

if (isLoading) {
return <LoadingState />;
}

if (hasError) {
return <ErrorState />;
}

return <GridSectionContent />;

Do not create an `else` after an early return.

---

# 34. ERROR AND LOADING STATE

Async UI should clearly support:

* loading
* success
* empty
* error

Do not allow every screen to invent a completely different loading pattern.

Reuse common Fitly presentation components if available.

Do not catch errors silently.

Do not put business error interpretation into generic MUI components.

---

# 35. ROUTING

Routing should represent application navigation.

Keep route definitions centralized.

Auth routes and application routes should be clearly separated.

Example concept:

/login
/forgot-password

/app/...

Do not put router navigation logic inside low-level visual controls unless that control's responsibility is navigation.

Menu selection should open the appropriate workspace target through the application navigation/workspace mechanism.

---

# 36. CURRENT SCOPE

Current implementation priorities:

1. preserve the current application visual layout
2. cleanly organize AppLayout
3. implement Auth structure
4. implement Header
5. implement Navigation/MenuTree
6. support hiding navigation
7. implement Workspace
8. implement SCREEN workspace type
9. implement GRID section type
10. implement FieldRegistry
11. implement basic input field components
12. implement basic grid cell renderers

Do not implement future functionality merely because it is mentioned in this document.

Future concepts describe architectural direction only.

---

# 37. DO NOT GENERATE UNREQUESTED CODE

When implementing a request:

Do NOT automatically:

* create tests
* generate sample/demo pages
* generate mock data
* generate Storybook stories
* generate documentation files
* add dependencies
* add packages
* rewrite existing architecture
* migrate unrelated code
* rename unrelated files
* format unrelated files
* modify backend code

unless explicitly requested.

Do not run build.

Do not run tests.

Do not run lint.

Do not install dependencies.

Do not execute the application.

Only do those actions when explicitly requested.

You may inspect code and statically verify changes.

---

# 38. CHANGE SCOPE

When asked to modify one feature:

Only modify files required for that feature.

Before editing:

1. inspect the current implementation
2. inspect nearby equivalent components
3. identify reusable code
4. determine the minimum required changes

Do not touch unrelated code.

Do not perform opportunistic cleanup across the project.

If nearby code is imperfect but unrelated, leave it unchanged.

---

# 39. WHEN REFACTORING AI-GENERATED CODE

If existing code is messy:

Do not rewrite everything automatically.

First identify:

* duplicated MUI configuration
* duplicated field rendering
* oversized components
* unnecessary hooks
* unnecessary state
* unnecessary contexts
* duplicated API calls
* repeated inline styling

Refactor incrementally.

Preserve behavior.

Preserve existing visual design.

Prefer extracting shared Fitly components only when repetition or common behavior is clear.

---

# 40. BEFORE WRITING CODE

Before implementing a feature, silently determine:

* what existing components already solve part of the problem
* where the feature belongs architecturally
* what the minimum file changes are
* whether a new component is actually necessary

Do not create a new architecture merely because the task can be solved several ways.

Follow the established Fitly architecture.

---

# 41. RESPONSE BEHAVIOR

When responding to an implementation request:

First give a short summary of what will be changed.

Do not provide a long tutorial unless requested.

Then make the required changes.

If you notice an architectural issue directly affecting the requested work, mention it briefly.

Do not ask unnecessary questions when the existing code provides enough context.

When there are multiple valid implementation choices, choose the simplest solution consistent with this architecture.

---

# 42. CORE ARCHITECTURE RULE

The following responsibility chain must remain intact:

AppLayout
→ Workspace
→ ScreenRenderer
→ Screen
→ FieldRenderer / FieldRegistry
→ Fitly Field Component
→ MUI

Each layer must only know what it needs to know.

In particular:

AppLayout must not know field types.

Workspace must not know field types.

ScreenRenderer must not know MUI implementation details.

GridSection must not decide how DATE, BOOLEAN, REFERENCE, etc. are rendered.

FieldRegistry owns field-type mapping.

Fitly field components own common field behavior.

MUI is the underlying presentation library.

---

# 43. PRIMARY RULE FOR AI-GENERATED CODE

The final code should look like it was designed consistently by one experienced developer.

It must NOT look like individual screens were independently generated by AI.

Prefer:

* fewer files
* fewer abstractions
* fewer dependencies
* clear responsibilities
* reusable domain components
* centralized field rendering
* centralized visual rules
* explicit readable code

over clever or overly generic solutions.

When uncertain:

choose the solution that is easier for another developer to read, debug, and modify six months later.
