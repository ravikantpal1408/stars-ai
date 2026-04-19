import React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { TableVirtuoso } from 'react-virtuoso';

type Column<T> = {
  field: keyof T;
  label: string;
  width?: string | number;
  align?: 'left' | 'right' | 'center' | 'inherit' | 'justify';
};

export interface DataTableProps<T extends Record<string, any>> {
  rows: T[];
  columns: Column<T>[];
  height?: number;
  rowHeight?: number;
}

const VirtuosoTableComponents = {
  Scroller: React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => (
    <TableContainer component="div" ref={ref} {...props} />
  )),
  Table: (props: any) => <Table stickyHeader {...props} />,
  TableHead: (props: any) => <TableHead {...props} />,
  TableRow: (props: any) => <TableRow {...props} />,
  TableBody: React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>((props, ref) => (
    <TableBody ref={ref} {...props} />
  )),
};

function DataTable<T extends Record<string, any>>({
  rows,
  columns,
  height = 400,
  rowHeight = 56,
}: DataTableProps<T>) {
  const fixedHeaderContent = () => (
    <TableRow>
      {columns.map((column) => (
        <TableCell key={String(column.field)} style={{ width: column.width }} align={column.align ?? 'left'}>
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  );

  const rowContent = (index: number, row: T) => (
    <TableRow key={String(index)}>
      {columns.map((column) => (
        <TableCell key={`${String(column.field)}-${index}`} align={column.align ?? 'left'}>
          {String(row[column.field] ?? '')}
        </TableCell>
      ))}
    </TableRow>
  );

  return (
    <Paper style={{ height, width: '100%' }}>
      <TableVirtuoso
        data={rows}
        components={VirtuosoTableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={rowContent}
        fixedItemHeight={rowHeight}
      />
    </Paper>
  );
}

export default DataTable;
