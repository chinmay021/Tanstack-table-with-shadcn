import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "./ui/Pagination";
import { useEffect, useState } from "react";
import { Checkbox } from "./ui/checkbox";

const EditableCell = ({
  getValue,
  row: { index },
  column: { id },
  table,
  setEditableRowIndex,
}) => {
  const initialValue = getValue();

  const [value, setValue] = useState(initialValue);

  const onBlur = () => {
    table.options.meta?.updateData(index, id, value);
    setEditableRowIndex(null);
  };
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <div className="text-left ">
      <input
      className=""
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
      />
    </div>
  );
};

function handleEdit(index, setEditableRowIndex) {
  console.log(index);
  setEditableRowIndex((prev) => (prev === index ? null : index));
}

function handleDelete(index, deleteData) {
  console.log(index);
  deleteData(index);
}
function handleMultipleDelete(indexArray, deleteMultipleData, setSelectedRows) {
  console.log(indexArray);
  deleteMultipleData(indexArray);
  setSelectedRows({});
}

export function DataTable({ defaultData }) {
  const [data, setData] = useState(defaultData);
  const [filtering, setFiltering] = useState("");
  const [selectedRows, setSelectedRows] = useState({});
  const [editableRowIndex, setEditableRowIndex] = useState(null);

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="text-center">
          <Checkbox
            className=""
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
    },
    {
      accessorKey: "name",
      header: () => <div className="text-left">Name</div>,
      // cell: ({ row }) => <div className="text-left">{row.original.name}</div>,
    },
    {
      accessorKey: "email",
      header: () => <div className="text-left">Email</div>,
    },
    {
      accessorKey: "role",
      header: () => <div className="text-left">Role</div>,
    },
    {
      id: "actions",
      header: () => <div className="text-left">Actions</div>,
      cell: (props) => {
        console.log(props.row.index);
        const id = props.row.original.id;
        return (
          <div className="text-left">
            <Button
              variant="outline"
              className="px-3 mr-2"
              onClick={() => {
                console.log("edited", id);
                handleEdit(props.row.index, setEditableRowIndex);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-file-edit"
              >
                <path d="M4 13.5V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2h-5.5" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M10.42 12.61a2.1 2.1 0 1 1 2.97 2.97L7.95 21 4 22l.99-3.95 5.43-5.44Z" />
              </svg>
            </Button>
            <Button
              variant="outline"
              className="px-3"
              onClick={() => {
                console.log("deleted", id);
                handleDelete(props.row.index, table.options.meta?.deleteData);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ff0505"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-trash"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </Button>
          </div>
        );
      },
    },
  ];

  const defaultColumn = {
    cell: (props) => {
      // console.log(props);
      if (props.table.getState().editableRowIndex === props.row.index) {
        return (
          <EditableCell {...props} setEditableRowIndex={setEditableRowIndex} />
        );
      } else {
        return <div className="text-left">{props.getValue()}</div>;
      }
    },
  };

  const table = useReactTable({
    data,
    columns,
    defaultColumn,
    state: {
      globalFilter: filtering,
      rowSelection: selectedRows,
      editableRowIndex: editableRowIndex,
    },
    meta: {
      updateData: (rowIndex, columnId, value) => {
        console.log(rowIndex, columnId, value);
        // Skip page index reset until after next rerender
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
      deleteData: (rowIndex) => {
        console.log(rowIndex);
        // Skip page index reset until after next rerender
        setData((old) => old.filter((_, index) => index !== rowIndex));
      },
      deleteMultipleData: (rowIndexArray) => {
        console.log(rowIndexArray);
        // Skip page index reset until after next rerender
        setData((old) =>
          old.filter((_, index) => !rowIndexArray.includes(index))
        );
      },
    },
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setFiltering,
    onRowSelectionChange: setSelectedRows,
  });

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <Input
          type="text"
          placeholder="Search..."
          value={filtering}
          onChange={(e) => setFiltering(e.target.value)}
          className="max-w-sm search-icon"
        />
        <Button
          variant="outline"
          className="px-3 mr-4 bg-red-300 hover:bg-red-600"
          onClick={() => {
            console.log("deleted");
            handleMultipleDelete(
              table.getFilteredSelectedRowModel().rows.map((row) => row.index),
              table.options.meta?.deleteMultipleData,
              setSelectedRows
            );
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-trash"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
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
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
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
