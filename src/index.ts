"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * Options for the `usePaginate` hook.
 */
export interface UsePaginateOptions {
  /**
   * The initial number of items per page
   *
   * @default 25
   */
  initialPageSize?: number;
  /**
   * The initial page index.
   *
   * @default 0
   */
  initialPageIndex?: number;
  /**
   * The minimum number of items required to enable pagination.
   *
   * @default 0
   */
  threshold?: number;
}

/**
 * A hook to manage pagination for a list of items.
 *
 * @template T - The type of items in the list.
 * @param {T[]} items - The list of items to paginate.
 * @param {UsePaginateOptions} [options] - Options for the `usePaginate` hook.
 * @returns {object} - Pagination state and handlers.
 */
export function usePaginate<T>(items: T[], options: UsePaginateOptions = {}) {
  const { initialPageSize = 25, initialPageIndex = 0, threshold = 0 } = options;

  const [pageSize, setPageSize] = useState(initialPageSize);
  const [pageIndex, setPageIndex] = useState(initialPageIndex);

  const pageCount = getPageCount(items, pageSize);
  const shouldPaginate = items.length > threshold;

  const pages = useMemo(() => {
    const pages: T[][] = [];

    if (shouldPaginate) {
      for (let index = 0; index < pageCount; index++) {
        pages.push(paginate(items, pageSize, index));
      }
    }

    return pages;
  }, [items, pageCount, pageSize, shouldPaginate]);

  const page = shouldPaginate ? (pages[pageIndex] ?? []) : items;
  const firstPageIndex = 0;
  const lastPageIndex = safeIndex(pageCount - 1);
  const nextPageIndex = safeIndex(pageIndex + 1);
  const prevPageIndex = safeIndex(pageIndex - 1);
  const canFirstPage = pageIndex !== 0;
  const canLastPage = pageIndex !== lastPageIndex;
  const canNextPage = pageIndex < lastPageIndex;
  const canPrevPage = pageIndex > 0;

  useEffect(() => {
    if (pageIndex > lastPageIndex) {
      setPageIndex(lastPageIndex);
    }
  }, [pageIndex, lastPageIndex]);

  function safeIndex(index: number): number {
    return Math.min(Math.max(index, 0), pageCount - 1);
  }

  function handleChangePageSize(size: number) {
    if (size !== pageSize) {
      setPageSize(size);
      resetPage();
    }
  }

  function handleChangePage(index: number) {
    if (index !== pageIndex) {
      setPageIndex(safeIndex(index));
    }
  }

  function firstPage() {
    setPageIndex(firstPageIndex);
  }

  function lastPage() {
    setPageIndex(lastPageIndex);
  }

  function nextPage() {
    setPageIndex(nextPageIndex);
  }

  function prevPage() {
    setPageIndex(prevPageIndex);
  }

  function resetPage() {
    setPageIndex(firstPageIndex);
  }

  return {
    canFirstPage,
    canLastPage,
    canNextPage,
    canPrevPage,
    changePage: handleChangePage,
    changePageSize: handleChangePageSize,
    firstPage,
    firstPageIndex,
    lastPage,
    lastPageIndex,
    nextPage,
    nextPageIndex,
    page,
    pageCount,
    pageIndex,
    pages,
    pageSize,
    prevPage,
    prevPageIndex,
    resetPage,
    shouldPaginate,
  };
}

/**
 * Divides a list of items into pages.
 *
 * @template T - The type of items in the list.
 * @param {T[]} items - The list of items to paginate.
 * @param {number} pageSize - The number of items per page.
 * @param {number} pageIndex - The index of the page to return.
 * @returns {T[]} - The items for the specified page.
 */
export function paginate<T>(
  items: T[],
  pageSize: number,
  pageIndex: number,
): T[] {
  return items.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
}

/**
 * Calculates the total number of pages for a list of items.
 *
 * @template T - The type of items in the list.
 * @param {T[]} items - The list of items to paginate.
 * @param {number} pageSize - The number of items per page.
 * @returns {number} - The total number of pages.
 */
export function getPageCount<T>(items: T[], pageSize: number): number {
  return Math.ceil(items.length / pageSize);
}
