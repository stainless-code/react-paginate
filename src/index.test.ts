import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getPageCount, paginate, usePaginate } from "./index";

describe("usePaginate", () => {
  const items = Array.from({ length: 50 }, (_, i) => i + 1); // [1, 2, 3, ..., 50]

  it("initializes with default options", () => {
    const { result } = renderHook(() => usePaginate(items));

    expect(result.current.pageSize).toBe(25);
    expect(result.current.pageIndex).toBe(0);
    expect(result.current.page).toEqual(items.slice(0, 25));
    expect(result.current.pageCount).toBe(2);
    expect(result.current.shouldPaginate).toBe(true);
    expect(result.current.canNextPage).toBe(true);
    expect(result.current.canPrevPage).toBe(false);
  });

  it("respects custom initial options", () => {
    const { result } = renderHook(() =>
      usePaginate(items, { initialPageSize: 10, initialPageIndex: 1 }),
    );

    expect(result.current.pageSize).toBe(10);
    expect(result.current.pageIndex).toBe(1);
    expect(result.current.page).toEqual(items.slice(10, 20));
    expect(result.current.pageCount).toBe(5);
  });

  it("changes page size and resets to the first page", () => {
    const { result } = renderHook(() => usePaginate(items));

    act(() => {
      result.current.changePageSize(10);
    });

    expect(result.current.pageSize).toBe(10);
    expect(result.current.pageIndex).toBe(0);
    expect(result.current.page).toEqual(items.slice(0, 10));
    expect(result.current.pageCount).toBe(5);
  });

  it("navigates to the next page", () => {
    const { result } = renderHook(() => usePaginate(items));

    act(() => {
      result.current.nextPage();
    });

    expect(result.current.pageIndex).toBe(1);
    expect(result.current.page).toEqual(items.slice(25, 50));
    expect(result.current.canNextPage).toBe(false);
    expect(result.current.canPrevPage).toBe(true);
  });

  it("does not go past the last page", () => {
    const { result } = renderHook(() => usePaginate(items));

    act(() => {
      result.current.nextPage();
      result.current.nextPage();
    });

    expect(result.current.pageIndex).toBe(1); // Last page index
    expect(result.current.page).toEqual(items.slice(25, 50));
  });

  it("navigates to the previous page", () => {
    const { result } = renderHook(() =>
      usePaginate(items, { initialPageIndex: 1 }),
    );

    act(() => {
      result.current.prevPage();
    });

    expect(result.current.pageIndex).toBe(0);
    expect(result.current.page).toEqual(items.slice(0, 25));
  });

  it("does not go before the first page", () => {
    const { result } = renderHook(() => usePaginate(items));

    act(() => {
      result.current.prevPage();
    });

    expect(result.current.pageIndex).toBe(0); // First page index
    expect(result.current.page).toEqual(items.slice(0, 25));
  });

  it("resets to the first page", () => {
    const { result } = renderHook(() =>
      usePaginate(items, { initialPageIndex: 1 }),
    );

    act(() => {
      result.current.resetPage();
    });

    expect(result.current.pageIndex).toBe(0);
    expect(result.current.page).toEqual(items.slice(0, 25));
  });

  it("navigates to the first page explicitly", () => {
    const { result } = renderHook(() =>
      usePaginate(items, { initialPageIndex: 1 }),
    );

    act(() => {
      result.current.firstPage();
    });

    expect(result.current.pageIndex).toBe(0);
    expect(result.current.page).toEqual(items.slice(0, 25));
  });

  it("navigates to the last page explicitly", () => {
    const { result } = renderHook(() => usePaginate(items));

    act(() => {
      result.current.lastPage();
    });

    expect(result.current.pageIndex).toBe(1);
    expect(result.current.page).toEqual(items.slice(25, 50));
  });

  it("manages threshold to disable pagination", () => {
    const { result } = renderHook(() => usePaginate(items, { threshold: 100 }));

    expect(result.current.shouldPaginate).toBe(false);
    expect(result.current.page).toEqual(items); // All items without pagination
  });

  it("does nothing if the page size remains the same", () => {
    const { result } = renderHook(() => usePaginate(items));

    act(() => {
      result.current.changePageSize(25);
    });

    expect(result.current.pageSize).toBe(25);
    expect(result.current.pageIndex).toBe(0);
    expect(result.current.page).toEqual(items.slice(0, 25));
  });

  it("does nothing if navigating to the same page index", () => {
    const { result } = renderHook(() => usePaginate(items));

    act(() => {
      result.current.changePage(0);
    });

    expect(result.current.pageIndex).toBe(0);
    expect(result.current.page).toEqual(items.slice(0, 25));
  });

  it("navigates to a specific page", () => {
    const { result } = renderHook(() => usePaginate(items));

    act(() => {
      result.current.changePage(1);
    });

    expect(result.current.pageIndex).toBe(1);
    expect(result.current.page).toEqual(items.slice(25, 50));
  });

  it("clamps page index if out of bounds", () => {
    const { result } = renderHook(() => usePaginate(items));

    act(() => {
      result.current.changePage(10); // Out of bounds
    });

    expect(result.current.pageIndex).toBe(1); // Last valid index
    expect(result.current.page).toEqual(items.slice(25, 50));
  });
});

describe("paginate", () => {
  it("returns the correct page of items", () => {
    const items = [1, 2, 3, 4, 5];
    expect(paginate(items, 2, 0)).toEqual([1, 2]); // First page
    expect(paginate(items, 2, 1)).toEqual([3, 4]); // Second page
    expect(paginate(items, 2, 2)).toEqual([5]); // Last page
  });

  it("returns an empty array if page index is out of bounds", () => {
    const items = [1, 2, 3, 4, 5];
    expect(paginate(items, 2, 3)).toEqual([]);
  });
});

describe("getPageCount", () => {
  it("calculates the correct number of pages", () => {
    const items = [1, 2, 3, 4, 5];
    expect(getPageCount(items, 2)).toBe(3);
    expect(getPageCount(items, 3)).toBe(2);
  });

  it("returns 0 pages if no items are provided", () => {
    expect(getPageCount([], 2)).toBe(0);
  });

  it("handles edge cases with a large page size", () => {
    const items = [1, 2, 3];
    expect(getPageCount(items, 10)).toBe(1);
  });
});
