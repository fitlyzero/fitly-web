# Hướng dẫn đọc Fitly Web cho dev Java/ZUL

Tài liệu này ánh xạ React/TypeScript sang cách tổ chức thường gặp trong Java,
Spring và ZK/ZUL. Đây là bản đồ đọc code, không phải hướng dẫn React tổng quát.

## 1. Ánh xạ khái niệm

| React/TypeScript | Java/ZUL gần tương đương | Vai trò trong dự án |
| --- | --- | --- |
| `.tsx` component | ZUL component + ViewModel nhỏ | Khai báo UI và xử lý tương tác cục bộ |
| `props` | Thuộc tính truyền vào component | Dữ liệu chỉ đọc từ component cha |
| `useState` | Thuộc tính trạng thái của ViewModel | Trạng thái UI cục bộ |
| custom hook | ViewModel command/service adapter | Gom lifecycle hoặc logic React |
| TanStack `useQuery` | Service call + cache/loading/error | Load dữ liệu backend |
| Zustand store | Singleton application store | State dùng chung giữa nhiều khu vực |
| TypeScript `interface` | Java interface/DTO | Contract, không có implementation runtime |
| union type | Sealed interface/enum có payload | Nhiều dạng screen/section/field |
| mapper function | MapStruct/manual mapper | Đổi API DTO thành UI model |
| JSX | ZUL viết trực tiếp trong JavaScript | Cây component được render |

Không tìm controller class cho mỗi trang. Trong React, component và hook là các
function; state thay đổi thì React gọi lại function component để tạo cây UI mới.

## 2. Luồng khởi động

Đọc theo thứ tự sau:

```text
src/app/main.tsx
  -> AppProviders        cấu hình MUI và React Query
  -> App                 chọn Auth hoặc ứng dụng chính
  -> AppLayout           header + navigation + workspace
  -> WorkspaceRenderer   load screen đang mở
  -> ScreenRenderer      lặp qua danh sách section
  -> SectionRenderer     chọn GRID, DETAIL, TREE, FORM...
```

`App.tsx` gần với root composer trong Java. `AppLayout.tsx` gần với ZUL master
layout. Hai file này chỉ ghép các khu vực lớn, không giải thích field metadata.

## 3. Luồng load một Studio screen

```text
WorkspaceRenderer
  -> useScreenQuery
  -> screen-service.loadScreen
     -> local demo metadata, hoặc
     -> studio-screen-service.loadStudioScreen
        -> get-studio-screen API
        -> get-studio-section-data API
        -> studio-section-mapper
  -> ScreenRenderer
  -> SectionRenderer
  -> GridSection / DetailSection / TreeSection / ...
```

So với Java:

```text
View -> Query adapter -> ScreenService -> RestClient -> Mapper -> ViewModel
```

Các package quan trọng:

- `studio/screen/api`: chỉ gọi HTTP và trả API DTO.
- `studio/screen/service`: điều phối việc load screen/section.
- `studio/screen/mapper`: tạo Screen container từ response hoặc demo page.
- `studio/screen/model`: contract của Screen container.
- `studio/screen/components`: lặp qua `screen.sections`.
- `studio/screen/demo`: dữ liệu fallback, không phải logic production.
- `studio/section/mapper`: đổi section DTO/metadata thành Section model.
- `studio/section/model`: contract GRID, DETAIL, TREE, FORM và các section khác.
- `studio/section/components`: render implementation của từng section type.

Screen không có `screenType`. Có thể hiểu Screen như một ZUL page chỉ chứa nhiều
component con. Layout/presentation type thuộc về từng Section:

```text
Screen
  sections[0] = HERO
  sections[1] = STATS
  sections[2] = GRID
  sections[3] = FORM
```

## 4. Luồng render field động

```text
SectionRenderer
  -> FieldRenderer
  -> fieldRegistry[dataType]
  -> AmountField / DateField / StringField / ...
  -> shared input hoặc cell
```

`fieldRegistry` tương đương một `Map<DataType, FieldRenderer>` trong Java. Thêm
kiểu `AMOUNT` không cần sửa ScreenRenderer; implementation của field và registry
chịu trách nhiệm render kiểu đó.

## 5. Cách đọc một React component

Đọc component theo bốn phần:

1. `import`: dependency mà component sử dụng.
2. `interface ...Props`: input từ component cha.
3. hooks ở đầu function: state, query và lifecycle.
4. `return (...)`: cây UI, tương đương nội dung ZUL.

Ví dụ:

```tsx
const [open, setOpen] = useState(false);

return <Button onClick={() => setOpen(true)}>Open</Button>;
```

Có thể đọc như một ViewModel có thuộc tính `open` và command đặt `open = true`.
React tự render lại phần UI phụ thuộc vào state đó.

## 6. Grid được chia như thế nào

`GridSection` giữ state cục bộ như filter và record đang chọn. Khi mở record,
nó chuyển việc hiển thị sang một `DetailSection`. Phần Grid được chia như sau:

- `grid-table.tsx`: tạo Data Grid columns và render rows.
- `grid-toolbar.tsx`: action buttons và chuyển record.
- `grid-panel.tsx`: ghép toolbar với table.
- `related-records.tsx`: tabs và các dòng con.
- `grid-layouts.tsx`: bố trí list/detail/single grid.
- `grid-filter-drawer.tsx`: form filter.
- `resizable-grid-layout.tsx`: resize/collapse hai vùng.

Khi sửa filter, bắt đầu từ `GridSection`. Khi sửa button, bắt đầu từ
`grid-toolbar`. Khi sửa cách hiển thị cell, bắt đầu từ `studio/field`.

## 7. Authentication

```text
LoginPage
  -> useLoginMutation
  -> auth-service.login
     -> auth.api.requestLogin
     -> demo-auth-repository nếu backend không khả dụng
  -> auth store
  -> App render AppLayout
```

`auth/api` không chứa demo user hoặc `localStorage`. Toàn bộ fallback được đặt ở
`auth/demo`, để không nhầm nó với backend contract.

## 8. Đặt code mới ở đâu

- Endpoint/HTTP request mới: `feature/api`.
- Điều phối nhiều API hoặc một use case: `feature/service`.
- Chuyển DTO sang UI model: `feature/mapper`.
- Interface/type: `feature/model`.
- UI: `feature/components` hoặc `feature/ui` theo domain hiện có.
- State chỉ dùng trong một component: `useState`, không tạo store.
- State dùng giữa nhiều khu vực độc lập: cân nhắc Zustand store.
- Dữ liệu mẫu: `demo` hoặc `metadata`, phải ghi rõ là fallback.

Không đưa HTTP call vào component, không import component từ API/service, không
đưa `GRID/DETAIL/TREE` vào Screen model và không xử lý từng field data type trong
ScreenRenderer hoặc SectionRenderer.
