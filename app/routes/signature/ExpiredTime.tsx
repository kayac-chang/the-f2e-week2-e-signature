import { useToggle } from "react-use";
import Toggle from "~/routes/signature/Toggle";
import DatePicker from "~/routes/signature/DatePicker";

function ExpiredTime() {
  const [open, setOpen] = useToggle(false);
  return (
    <>
      <Toggle
        labelOff="無期限"
        labelOn="指定簽署期限"
        checked={open}
        onCheckedChange={setOpen}
      />

      {open && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                id="week"
                name="expired-time"
                type="radio"
                defaultChecked
              />
              <label htmlFor="week">7天內</label>
            </div>

            <div className="flex items-center gap-2">
              <input id="month" name="expired-time" type="radio" />
              <label htmlFor="month">30天內</label>
            </div>
          </div>

          <DatePicker />
        </div>
      )}
    </>
  );
}
export default ExpiredTime;
