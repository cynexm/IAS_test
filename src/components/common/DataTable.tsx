import React from "react";
import { get } from "lodash";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import Collapse from "@material-ui/core/Collapse";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import { translate as withTranslate } from "react-admin";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

export interface ColDef {
  field: string;
  label?: string;
  align?: "right" | "center" | "left";
  valueTrans?: boolean;
  textLabel?: string;
  hidden?: boolean;
  link?: (value: string | number) => string;
}

interface DataTableProps {
  resource: string;
  columns: ColDef[];
  rows: any[];
  translate: (inputString: string) => string;
  keyField?: string;
  title?: string;
  CollapseElement?: any;
  wrapperComponent?: any;
  size?: "medium" | "small";
  padding?: "default" | "checkbox" | "none" | "dense";
}

const BasicRow = ({
  columns,
  row,
  keyField,
  translate,
}: {
  columns: ColDef[];
  row: any;
  keyField: string;
  translate: any;
}) => {
  return (
    <React.Fragment>
      {columns.map(({ field, align, valueTrans, link }) => {
        const rawValue = get(row, field);
        const id = get(row, keyField);
        const displayValue = valueTrans
          ? translate(`valueTrans.${field}.${rawValue}`)
          : rawValue;
        const valueLink = link ? link(rawValue) : null;
        return (
          <TableCell key={`${id}.${field}`} align={align}>
            {valueLink ? (
              <Link to={valueLink} className="link">
                {displayValue}
              </Link>
            ) : (
              <span>{displayValue}</span>
            )}
          </TableCell>
        );
      })}
    </React.Fragment>
  );
};

const CollapsableRow = ({
  row,
  columns,
  CollapseElement,
  translate,
  keyField,
}: any) => {
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow>
        {CollapseElement && (
          <TableCell>
            <IconButton aria-label="expand row" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        )}
        <BasicRow
          row={row}
          columns={columns}
          translate={translate}
          keyField={keyField}
        />
      </TableRow>
      {CollapseElement && (
        <TableRow style={{ display: open ? "table-row" : "none" }}>
          <TableCell
            style={{
              paddingBottom: 0,
              paddingTop: 0,
              height: !open ? 0 : "auto",
            }}
            colSpan={columns.length + 1}
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              <div style={{ margin: 8 }}>
                <CollapseElement row={row} />
              </div>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
};

export const DataTable = withTranslate(
  ({
    resource,
    columns,
    rows,
    translate,
    keyField = "id",
    title,
    CollapseElement,
    wrapperComponent = "div",
    padding = "checkbox",
  }: DataTableProps) => {
    return (
      <div>
        {title && (
          <Typography variant="title" style={{ padding: 15 }}>
            {translate(`resources.${resource}.${title}`)}
          </Typography>
        )}
        <Table padding={padding}>
          <TableHead>
            <TableRow>
              {CollapseElement && <TableCell></TableCell>}
              {columns.map(({ label, field, align, textLabel }) => (
                <TableCell key={`header.${field}`} align={align} variant="head">
                  {textLabel ||
                    translate(label || `resources.${resource}.fields.${field}`)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <CollapsableRow
                key={row[keyField]}
                row={row}
                columns={columns}
                keyField={keyField}
                CollapseElement={CollapseElement}
                translate={translate}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
);
