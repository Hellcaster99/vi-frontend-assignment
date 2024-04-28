"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Column,
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { DataTablePagination } from "./data-table-pagination";
import { useEffect, useState, CSSProperties} from "react";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        enableMultiRowSelection: false,
        debugTable: true,
        debugHeaders: true,
        debugColumns: true,
        columnResizeMode: 'onChange',
        columnResizeDirection: 'ltr'
    });

    // TASK : Make first 2 columns (i.e. checkbox and task id) sticky
    useEffect(() => {
        table.getColumn("checked")?.pin("left")
        table.getColumn("id")?.pin("left")
    }, [])

    const getCommonPinningStyles = (column: Column<any>): CSSProperties => {
        const isPinned = column.getIsPinned()
        const Id = column.id;
        const left = Id == "checked" ? -1: 28
        const isLastLeftPinnedColumn =
          isPinned === 'left' && column.getIsLastColumn('left')
        // console.log(column.getStart('left'));
        
        return {
          boxShadow: isLastLeftPinnedColumn
            ? '-3px 0 3px -3px gray inset'
              : undefined,
          left: isPinned === 'left' ? left : undefined,
          position: isPinned ? 'sticky' : 'relative',
          zIndex: isPinned ? 1 : 0,
          backgroundColor: isPinned ? "#fff":"",
        }
    }
    
    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    const {column} = header;
                                    return (
                                        <TableHead className="border" key={header.id} colSpan={header.colSpan} style={{ ...getCommonPinningStyles(column),width:header.getSize()}}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef.header,
                                                      header.getContext(),
                                                  )}
                                            {/* TASK : Make header columns resizable */}
                                            <div
                                                {...{
                                                    onDoubleClick: () => column.resetSize(),
                                                    onMouseDown: header.getResizeHandler(),
                                                    onTouchStart: header.getResizeHandler(),
                                                    className: `resizer ${column.getIsResizing() ? 'isResizing' : ''}`,
                                                }}
                                            />
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => {
                                        const {column} = cell;
                                        return <TableCell className="border" key={cell.id} style={{ ...getCommonPinningStyles(column) }}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    })}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}
