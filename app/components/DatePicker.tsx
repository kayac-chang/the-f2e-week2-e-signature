import * as Collapsible from "@radix-ui/react-collapsible";
import Calendar from "~/components/calendar/Calendar";
import MonthCalendar from "./calendar/MonthCalendar";
import SVG from "./SVG";
import { format } from "date-fns";
import zh from "date-fns/locale/zh-TW";

function DatePicker() {
  return (
    <Collapsible.Root>
      <div className="flex items-center gap-2">
        <input id="custom" name="expired-time" type="radio" />

        <label htmlFor="custom" className="w-full">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="YYYY-MM-DD"
              onFocus={(event) => {
                event.target?.closest("label")?.click();
                event.target?.focus();
              }}
            />

            <Collapsible.Trigger asChild>
              <button className="absolute right-0 mr-2 s-6">
                <SVG src={require("~/assets/icons/calendar-today.svg")} />
              </button>
            </Collapsible.Trigger>
          </div>
        </label>
      </div>

      <Collapsible.Content>
        <Calendar.Root
          className="ml-6 mt-2 divide-y-2 rounded bg-white p-4 shadow-lg"
          ref={(ref) => ref?.scrollIntoView()}
        >
          <Calendar.Header className="flex w-full items-center justify-between pb-2">
            <Calendar.Button action="previous month" className="s-6">
              <SVG src={require("~/assets/icons/chevron-left.svg")} />
            </Calendar.Button>

            <Calendar.Title className="font-bold" format="yyyy年MM月" />

            <Calendar.Button action="next month" className="s-6">
              <SVG src={require("~/assets/icons/chevron-right.svg")} />
            </Calendar.Button>
          </Calendar.Header>

          <div className="w-full py-2">
            <MonthCalendar.Grid className="w-full">
              <MonthCalendar.Header>
                {(date) => <>{format(date, "EEEEE", { locale: zh })}</>}
              </MonthCalendar.Header>
              <MonthCalendar.Cell>
                {(date) => (
                  <button className="aspect-square rounded-full border border-primary bg-primary-selected s-full">
                    {format(date, "d")}
                  </button>
                )}
              </MonthCalendar.Cell>
            </MonthCalendar.Grid>
          </div>
        </Calendar.Root>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

export default DatePicker;
