import clsx from "clsx";
import type { ComponentProps } from "react";

type ToggleProps = ComponentProps<"div"> & {
  labelOn: string;
  labelOff: string;
};
function Toggle(props: ToggleProps) {
  return (
    <div className={clsx("flex items-center gap-2", props.className)}>
      <small className="text-dark">{props.labelOn}</small>

      <input type="checkbox" />

      <small className="text-dark">{props.labelOff}</small>
    </div>
  );
}

export default Toggle;
