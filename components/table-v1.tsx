/**
 * v0 by Vercel.
 * @see https://v0.dev/t/asamSajUofX
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client";

import { useState, ChangeEvent } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type DataRow = {
  id: number;
  name: string;
  email: string;
  age: number;
  city: string;
};

type Column = {
  name: string;
  key: keyof DataRow;
};

export default function TableV1() {
  const [showSheet, setshowSheet] = useState(false);
  const [item, setitem] = useState<DataRow>();
  return (
    <div>
      <TableV1Internal
        onShowDetails={(dataitem) => {
          setitem(dataitem);
          setshowSheet(true);
        }}
      />
      ;
      <Sheet open={showSheet} onOpenChange={setshowSheet}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Are you absolutely sure?</SheetTitle>
            <SheetDescription>{JSON.stringify(item)}</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function TableV1Internal(props: { onShowDetails(data: DataRow): void }) {
  const [data, setData] = useState<DataRow[]>([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      age: 32,
      city: "New York",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      age: 28,
      city: "Los Angeles",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      age: 45,
      city: "Chicago",
    },
    {
      id: 4,
      name: "Alice Williams",
      email: "alice@example.com",
      age: 37,
      city: "San Francisco",
    },
    {
      id: 5,
      name: "Tom Brown",
      email: "tom@example.com",
      age: 22,
      city: "Boston",
    },
  ]);
  const [visibleColumns, setVisibleColumns] = useState<(keyof DataRow)[]>([
    "id",
    "name",
    "email",
    "age",
    "city",
  ]);
  const [columnOrder, setColumnOrder] = useState<(keyof DataRow)[]>([
    "id",
    "name",
    "email",
    "age",
    "city",
  ]);
  const [sortColumn, setSortColumn] = useState<keyof DataRow | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [filters, setFilters] = useState<
    Partial<Record<keyof DataRow, string>>
  >({});
  const [selectedRows, setSelectedRows] = useState<DataRow[]>([]);

  const columns: Column[] = [
    { name: "ID", key: "id" },
    { name: "Name", key: "name" },
    { name: "Email", key: "email" },
    { name: "Age", key: "age" },
    { name: "City", key: "city" },
  ];

  const handleColumnVisibility = (key: keyof DataRow) => {
    setVisibleColumns((prevVisibleColumns) => {
      if (prevVisibleColumns.includes(key)) {
        return prevVisibleColumns.filter((col) => col !== key);
      } else {
        return [...prevVisibleColumns, key];
      }
    });
  };

  const handleColumnOrder = (key: keyof DataRow, newIndex: number) => {
    setColumnOrder((prevColumnOrder) => {
      const updatedOrder = [...prevColumnOrder];
      const oldIndex = updatedOrder.indexOf(key);
      updatedOrder.splice(oldIndex, 1);
      updatedOrder.splice(newIndex, 0, key);
      return updatedOrder;
    });
  };

  const handleSort = (key: keyof DataRow) => {
    if (sortColumn === key) {
      setSortOrder((prevSortOrder) =>
        prevSortOrder === "asc" ? "desc" : "asc"
      );
    } else {
      setSortColumn(key);
      setSortOrder("asc");
    }
  };

  const handleFilter = (key: keyof DataRow, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  const handleRowSelection = (row: DataRow) => {
    props.onShowDetails(row);
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.some((selectedRow) => selectedRow.id === row.id)) {
        return prevSelectedRows.filter(
          (selectedRow) => selectedRow.id !== row.id
        );
      } else {
        return [...prevSelectedRows, row];
      }
    });
  };

  const filteredData = data.filter((row) => {
    return Object.keys(filters).every((key) => {
      const filter = filters[key as keyof DataRow];
      if (filter === null || filter === "") {
        return true;
      }
      return row[key as keyof DataRow]
        .toString()
        .toLowerCase()
        .includes(filter!.toLowerCase());
    });
  });

  const sortedData = sortColumn
    ? filteredData.sort((a, b) => {
        const valueA = a[sortColumn];
        const valueB = b[sortColumn];
        if (valueA < valueB) {
          return sortOrder === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortOrder === "asc" ? 1 : -1;
        }
        return 0;
      })
    : filteredData;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          {columns.map((column) => (
            <div key={column.key} className="mr-4">
              <Checkbox
                id={`column-${column.key}`}
                checked={visibleColumns.includes(column.key)}
                onCheckedChange={() => handleColumnVisibility(column.key)}
              />
              <label htmlFor={`column-${column.key}`} className="ml-2">
                {column.name}
              </label>
            </div>
          ))}
        </div>
        <div>
          {columns
            .filter((column) => visibleColumns.includes(column.key))
            .map((column, index) => (
              <DropdownMenu key={column.key}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="mr-2">
                    {column.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Order</DropdownMenuLabel>
                  {columnOrder.map((key, orderIndex) => (
                    <DropdownMenuItem
                      key={key}
                      onSelect={() => handleColumnOrder(key, index)}
                      disabled={key === column.key}
                    >
                      {orderIndex === index ? "\u2713" : ""}{" "}
                      {columns.find((col) => col.key === key)?.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
        </div>
      </div>
      <div className="mb-4 flex items-center">
        {columns
          .filter((column) => visibleColumns.includes(column.key))
          .map((column) => (
            <div key={column.key} className="mr-4">
              <Input
                type="text"
                placeholder={`Filter ${column.name}`}
                value={filters[column.key] || ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleFilter(column.key, e.target.value)
                }
              />
            </div>
          ))}
      </div>
      <Button
        variant="default"
        onClick={() => console.log("Selected Rows: ", selectedRows)}
      >
        Show Selected Rows
      </Button>
      <Table>
        <TableHeader>
          <TableRow>
            {columnOrder
              .filter((key) => visibleColumns.includes(key))
              .map((key) => (
                <TableHead key={key} onClick={() => handleSort(key)}>
                  {columns.find((col) => col.key === key)?.name}
                  {sortColumn === key && (
                    <span className="ml-2">
                      {sortOrder === "asc" ? "\u25B2" : "\u25BC"}
                    </span>
                  )}
                </TableHead>
              ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((row) => (
            <TableRow key={row.id} onClick={() => handleRowSelection(row)}>
              {columnOrder
                .filter((key) => visibleColumns.includes(key))
                .map((key) => (
                  <TableCell key={`${row.id}-${key}`}>
                    {/* <Checkbox
                      checked={selectedRows.some(
                        (selectedRow) => selectedRow.id === row.id
                      )}
                      onCheckedChange={() => handleRowSelection(row)}
                    /> */}
                    {row[key]}
                  </TableCell>
                ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">Show Details</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Selected Rows</DialogTitle>
          <DialogDescription>
            {selectedRows.map((row) => (
              <div key={row.id}>
                <p>ID: {row.id}</p>
                <p>Name: {row.name}</p>
                <p>Email: {row.email}</p>
                <p>Age: {row.age}</p>
                <p>City: {row.city}</p>
                <hr />
              </div>
            ))}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}
