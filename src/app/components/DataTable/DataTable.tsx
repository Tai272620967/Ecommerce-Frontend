/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import "./DataTable.scss";

import {
  useTable,
  usePagination,
  useSortBy,
  Column,
  TableInstance,
  Row,
} from "react-table";

type DataTableProps<T extends object> = {
  columns: Column<T>[];
  data: T[];
  className?: string
};

const DataTable = <T extends object>({
  columns,
  data,
  className,
}: DataTableProps<T>): JSX.Element => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Data for the current page
    // state: { pageIndex, pageSize },
  } = useTable<T>(
    {
      columns,
      data,
      //   initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination
  ) as TableInstance<T> & {
    page: Row<T>[]; // Add missing type for `page`
    canPreviousPage: any;
    canNextPage: any;
    pageOptions: any;
    gotoPage: any;
    nextPage: any;
    previousPage: any;
    setPageSize: any;
  };

  return (
    <div>
      <table
        {...getTableProps()}
        className={className}
      >
        <thead>
          {headerGroups.map((headerGroup) => {
            const { key, ...rest } = headerGroup.getHeaderGroupProps(); // Tách key ra
            return (
              <tr key={key} {...rest}>
                {headerGroup.headers.map((column) => {
                  const { key: columnKey, ...columnProps } =
                    column.getHeaderProps(); // Tách key ra
                  return (
                    <th
                      key={columnKey}
                      {...columnProps}
                      style={{
                        // border: "1px solid black",
                        padding: "8px",
                        // background: "#f4f4f4",
                        borderBottom: "1px solid #e7e9ed",
                        // width: column.width,
                        cursor: "pointer",
                      }}
                    >
                      {column.render("Header")}
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            const { key: rowKey, ...rowProps } = row.getRowProps();
            return (
              <tr key={rowKey} {...rowProps}>
                {row.cells.map((cell) => {
                  const { key: cellKey, ...cellProps } = cell.getCellProps();
                  return (
                    <td
                      key={cellKey}
                      {...cellProps}
                      style={{ borderBottom: "1px solid #e7e9ed", padding: "8px" }}
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div
        style={{
          marginTop: "10px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        {/* <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          Previous
        </button>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          Next
        </button>
        <button
          onClick={() => gotoPage(pageOptions.length - 1)}
          disabled={!canNextPage}
        >
          {">>"}
        </button> */}
        {/* <span>Page {pageIndex + 1} of {pageOptions.length}</span>
        <select
          onChange={(e) => setPageSize(Number(e.target.value))}
          //   value={pageSize}
        >
          {[10, 20, 30, 50].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select> */}
      </div>
    </div>
  );
};

export default DataTable;
