# Frontend Architecture

> This file overlaps with `docs/frontend-architecture.md` and `ai-rules/project-rule.md`. It is not linked from `README.md`; treat `docs/frontend-architecture.md` as the primary reference for current structure and this file as supplementary layer/naming rules for AI-assisted changes. Its field component naming (`StringField`, `AmountField`, ...) matches what is actually implemented in `field-registry.ts` — unlike the `Fitly<Type>Field` examples in `ai-rules/project-rule.md`, which were never adopted for fields.

This application is a metadata-driven ERP frontend.

## Studio domains

Studio is divided by backend domain:

- navigation
- screen
- section
- field

Do not group all Studio code into generic api/, types/, or components/
directories at the root level.

Preferred structure:

src/
studio/
navigation/
screen/
section/
field/
shared/

Each domain may contain:

- api/
- service/
- mapper/
- model/
- components/
- hooks/
- utils/
- demo/

when required.

Layer responsibilities:

- `api/` only performs backend communication and returns typed API responses.
- `service/` coordinates a complete use case and may call multiple APIs.
- `mapper/` contains pure conversion from API/demo contracts to UI models.
- `components/` must not be imported by API or service modules.
- `demo/` contains development fallback data and no production business rules.

## Screen and Section ownership

Screen is only an ordered container of sections:

```text
ScreenMetadata
  -> sections: SectionMetadata[]
```

Screen must not have a GRID, DETAIL, TREE, FORM, or CUSTOM presentation type.
Those types belong to Section. `ScreenRenderer` only iterates sections, while
`SectionRenderer` is the dispatcher for section implementations.

Required flow:

```text
WorkspaceRenderer
-> ScreenRenderer
-> SectionRenderer
-> GridSection / DetailSection / TreeSection / ...
-> FieldRenderer
-> FieldRegistry
```

---

## API models

Do not place unrelated API models in one large file.

Each important API model must have its own file.

Examples:

screen/model/screen-response.ts
section/model/section-response.ts
field/model/field-response.ts
field/model/field-data-response.ts

Global API contracts belong in:

src/common/api/

Examples:

BaseResponse
MessageResponse

Do not rename backend JSON properties during refactoring.

---

## Dynamic Field Architecture

Studio fields are metadata-driven.

Each StudioDataType must have its own component.

Examples:

TEXT -> TextField
STRING -> StringField
INTEGER -> IntegerField
DECIMAL -> DecimalField
QUANTITY -> QuantityField
AMOUNT -> AmountField
PERCENTAGE -> PercentageField
BOOLEAN -> BooleanField
DATE -> DateField
DATETIME -> DateTimeField
TIME -> TimeField
SEARCH -> SearchField
DROPDOWN -> DropdownField
MULTI_SELECT -> MultiSelectField
FILE -> FileField
IMAGE -> ImageField
URL -> UrlField

Field-specific behavior must stay inside its field implementation.

Screen and Section components must never contain logic such as:

if field.data_type === 'AMOUNT'
if field.data_type === 'SEARCH'

Required architecture:

SectionRenderer
-> FieldRenderer
-> FieldRegistry
-> StringField
-> TextField
-> AmountField
-> SearchField
-> ...

FieldRenderer must only resolve the correct field component.

Do not create a giant switch containing field implementations.

---

## Field contract

All field components should use one common props contract where possible.

Example responsibilities:

AmountField:
- amount input
- numeric parsing
- formatting
- precision

SearchField:
- lookup/search behavior
- display value
- selecting records

DateField:
- date picker
- parsing
- formatting

DropdownField:
- options
- selected value

Shared behavior belongs under:

studio/field/shared/

Do not duplicate it between field components.

---

## Refactoring rules

When refactoring existing code:

1. Preserve existing behavior.
2. Preserve existing API endpoints.
3. Preserve backend JSON field names.
4. Do not redesign unrelated features.
5. Do not add dependencies unless necessary.
6. Move code instead of duplicating it.
7. Update all imports after moving files.
8. Delete obsolete code after migration.
9. Keep components small and single-purpose.
10. Avoid premature abstractions.

A new StudioDataType should normally require only:

1. Creating its field component.
2. Registering it in FieldRegistry.

It should not require modifying ScreenRenderer or SectionRenderer.
