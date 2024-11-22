# @stainless-code/react-paginate

Handle client-side pagination effortlessly. Simplifies the process of paginating data in your React applications, offering a fully type-safe and feature-rich experience.

## Features

- **Customizable Pagination**: Control the page size, initial page, and thresholds with ease.
- **Performance Optimized**: Uses React's `useMemo` to optimize calculations.
- **Type-safe**: Full TypeScript support for better developer experience.
- **Flexible API**: Exposes powerful utilities to navigate and manipulate pagination state.

## Installation

### npm

```bash
npm install @stainless-code/react-paginate
```

### yarn

```bash
yarn add @stainless-code/react-paginate
```

### pnpm

```bash
pnpm add @stainless-code/react-paginate
```

### bun

```bash
bun add @stainless-code/react-paginate
```

## Usage

Here's a basic example of using `usePaginate`:

```tsx
import { usePaginate } from "@stainless-code/react-paginate";
import React from "react";

const Example = () => {
  const items = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`);
  const {
    page,
    pageSize,
    pageIndex,
    pageCount,
    canNextPage,
    canPrevPage,
    nextPage,
    prevPage,
    changePageSize,
  } = usePaginate(items, { initialPageSize: 10, initialPageIndex: 0 });

  return (
    <div>
      <h1>Pagination Example</h1>
      <ul>
        {page.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
      <div>
        <button onClick={prevPage} disabled={!canPrevPage}>
          Previous
        </button>
        <button onClick={nextPage} disabled={!canNextPage}>
          Next
        </button>
      </div>
      <p>
        Page {pageIndex + 1} of {pageCount}
      </p>
      <label>
        Items per page:{" "}
        <select
          value={pageSize}
          onChange={(e) => changePageSize(Number(e.target.value))}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
        </select>
      </label>
    </div>
  );
};

export default Example;
```

## Typesafety

This library is built with TypeScript and offers full type-safety. All APIs and returned values are strongly typed, ensuring a great developer experience and reducing runtime errors.

## API

### `usePaginate(items: T[], options?: UsePaginateOptions)`

#### Parameters

| Parameter                  | Type     | Default | Description                                            |
| -------------------------- | -------- | ------- | ------------------------------------------------------ |
| `items`                    | `T[]`    | -       | The list of items to paginate.                         |
| `options`                  | `object` | `{}`    | Configuration options for pagination.                  |
| `options.initialPageSize`  | `number` | `25`    | Initial number of items per page.                      |
| `options.initialPageIndex` | `number` | `0`     | Initial page index.                                    |
| `options.threshold`        | `number` | `0`     | Minimum number of items required to enable pagination. |

#### Returns

| Property         | Type                      | Description                                           |
| ---------------- | ------------------------- | ----------------------------------------------------- |
| `page`           | `T[]`                     | The current page of items.                            |
| `pageSize`       | `number`                  | The number of items per page.                         |
| `pageIndex`      | `number`                  | The current page index.                               |
| `pageCount`      | `number`                  | Total number of pages.                                |
| `canNextPage`    | `boolean`                 | Whether navigation to the next page is possible.      |
| `canPrevPage`    | `boolean`                 | Whether navigation to the previous page is possible.  |
| `nextPage`       | `() => void`              | Navigate to the next page.                            |
| `prevPage`       | `() => void`              | Navigate to the previous page.                        |
| `firstPage`      | `() => void`              | Navigate to the first page.                           |
| `lastPage`       | `() => void`              | Navigate to the last page.                            |
| `changePage`     | `(index: number) => void` | Change to a specific page by index.                   |
| `changePageSize` | `(size: number) => void`  | Change the number of items per page.                  |
| `resetPage`      | `() => void`              | Reset to the first page.                              |
| `shouldPaginate` | `boolean`                 | Whether pagination is enabled based on the threshold. |

---

### `paginate<T>(items: T[], pageSize: number, pageIndex: number): T[]`

This function divides the given list of items into pages, and returns the items for the specified page.

- **`items`**: An array of items (type `T[]`) that you want to paginate.
- **`pageSize`**: The number of items per page.
- **`pageIndex`**: The zero-based index of the page to return.

**Example Usage**:

```typescript
const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const pageSize = 3;
const pageIndex = 2;

const pageItems = paginate(items, pageSize, pageIndex);
// Output: [7, 8, 9]
```

---

### `getPageCount<T>(items: T[], pageSize: number): number`

This function calculates the total number of pages required to paginate the given list of items, based on the page size.

- **`items`**: An array of items (type `T[]`) to paginate.
- **`pageSize`**: The number of items per page.

**Example Usage**:

```typescript
const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const pageSize = 3;

const totalPages = getPageCount(items, pageSize);
// Output: 4
```

## Contributing

Feel free to submit issues or pull requests to improve the library. Every bit of help is appreciated. 💖

[Read the contribution guidelines](./CONTRIBUTING.md).

## License

[MIT](./LICENSE)
