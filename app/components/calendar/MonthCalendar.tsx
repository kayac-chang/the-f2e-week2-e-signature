import {
  eachDayOfInterval,
  endOfMonth,
  getDay,
  startOfMonth,
  format,
  startOfWeek,
  add,
  isSameDay,
} from "date-fns";
import { concat, range, repeat, splitEvery } from "ramda";
import {
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useRef,
} from "react";
import { Context as CalendarContext } from "./Calendar";
import type { ReactNode, ComponentProps, ForwardedRef, RefObject } from "react";
import type { EP } from "~/utils/types";
import { createHost, createSlot } from "create-slots";

function assignRef<T>(ref: ForwardedRef<T>, value: T | null): ForwardedRef<T> {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
  return ref;
}

const getDatesInMonth = (focus: Date) =>
  eachDayOfInterval({
    start: startOfMonth(focus),
    end: endOfMonth(focus),
  });

interface State {
  focus: Date;
  table: (Date | undefined)[][];
  ref: RefObject<HTMLTableElement> | null;
}
const Context = createContext<State | null>(null);
function useMonthCalendarContext(error: string) {
  const context = useContext(Context);
  if (!context) {
    throw new Error(error);
  }
  return context;
}

type ColumnHeaderProps = {
  abbr?: (day: Date) => string;
  children?: (day: Date) => ReactNode;
};
function ColumnHeader(props: ColumnHeaderProps) {
  useMonthCalendarContext(
    `<ColumnHeader /> cannot be rendered outside <MonthCalendar />`
  );

  const days = range(0, 7)
    .map((days) => add(startOfWeek(new Date()), { days }))
    .map((day) => (
      <th
        role="columnheader"
        abbr={props.abbr?.(day) ?? format(day, "EEEE")}
        children={props.children?.(day) ?? format(day, "EEEEEE")}
        key={day.toString()}
      />
    ));

  return <>{days}</>;
}

type GridCellProps = EP<
  "td",
  {
    children?: (date: Date) => ReactNode;
  }
>;

const GridCell = forwardRef<HTMLElement, GridCellProps>((_props, _ref) => {
  const context = useMonthCalendarContext(
    `<GridCell /> cannot be rendered outside <MonthCalendar />`
  );
  const { children, ...props } = _props;

  const isFocusWithinTable = context.ref?.current?.contains(
    document.activeElement
  );

  return (
    <>
      {context.table.map((row, index) => (
        <tr key={index}>
          {row.map((day, index) => {
            if (!day) {
              return <td key={index} {...props} tabIndex={-1} />;
            }

            const element = children?.(day);
            const tabIndex = isSameDay(day, context.focus) ? 0 : -1;
            const ref = isSameDay(day, context.focus)
              ? (element: HTMLElement | null) => {
                  assignRef(_ref, element);
                  isFocusWithinTable && element?.focus();
                }
              : undefined;

            if (isValidElement(element)) {
              return (
                <td key={index} {...props}>
                  {cloneElement(element, {
                    ...element.props,
                    tabIndex,
                    ref,
                  })}
                </td>
              );
            }

            return (
              <td key={index} {...props} tabIndex={tabIndex} ref={ref}>
                {format(day, "dd")}
              </td>
            );
          })}
        </tr>
      ))}
    </>
  );
});
GridCell.displayName = "GridCell";

const Header = createSlot(ColumnHeader);
const Cell = createSlot(GridCell);

export type GridProps = ComponentProps<"table"> & {
  focus?: Date;
};
const Grid = forwardRef<HTMLTableElement, GridProps>((props, ref) => {
  const context = useContext(CalendarContext);

  const focus = props?.focus ?? context?.focus ?? new Date();

  const days = concat(
    repeat(undefined, getDay(startOfMonth(focus))),
    getDatesInMonth(focus)
  );

  const table = splitEvery(7, days);
  const innerRef = useRef<HTMLTableElement | null>(null);

  return createHost(props.children, (slots) => {
    const headerProps = slots.getProps(Header);
    const cellProps = slots.getProps(Cell);
    return (
      <Context.Provider value={{ focus: focus, table, ref: innerRef }}>
        <table
          {...props}
          role="grid"
          ref={(element) => {
            assignRef(innerRef, element);
            assignRef(ref, element);
          }}
          aria-labelledby={context?.grid_label}
        >
          <thead>
            <tr>{headerProps && <ColumnHeader {...headerProps} />}</tr>
          </thead>
          <tbody>{cellProps && <GridCell {...cellProps} />}</tbody>
        </table>
      </Context.Provider>
    );
  });
});
Grid.displayName = "Grid";

export default { Grid, Header, Cell };
