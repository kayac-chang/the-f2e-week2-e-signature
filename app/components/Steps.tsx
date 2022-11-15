import clsx from "clsx";
import {
  createHost,
  createSlot,
  getSlotProps,
  isSlot,
} from "create-slots/list";
import { useId } from "react";
import type { ComponentProps } from "react";

const Item = createSlot("li");

type StepProps = ComponentProps<"strong"> & {
  "data-state"?: "default" | "active" | "disabled";
};
function Step(props: StepProps) {
  const state = props["data-state"] ?? "default";
  return (
    <strong
      {...props}
      className={clsx(
        "step s-10",
        state === "default" && "theme-primary",
        state === "active" &&
          "theme-primary ring ring-primary/20 ring-offset-2",
        state === "disabled" && "border-2 border-grey text-dark-grey"
        //
      )}
    />
  );
}

type StepsProps = ComponentProps<"ol">;
function Steps(props: StepsProps) {
  const id = useId();
  return (
    <div className={props.className}>
      {createHost(props.children, (slots) => (
        <ol
          className={clsx(
            "mx-auto max-w-screen-lg",
            "flex items-center whitespace-nowrap",
            "gap-4 lg:gap-0",
            "px-6 py-3 lg:py-5",

            // line
            "lg:[&>:not(:last-child)]:after:content-['']",
            "lg:[&>:not(:last-child)]:after:h-[2px]",
            "lg:[&>:not(:last-child)]:after:flex-1",
            "lg:[&>:not(:last-child)]:after:bg-ui-grey",
            "lg:[&>:not(:last-child)]:after:mx-3",

            // li width
            "[&_li]:flex [&_li]:items-center lg:[&_li]:flex-1",
            "[&_:has([data-state='active'])]:flex-1",

            // p
            "[&_p]:hidden",
            "lg:[&_p]:block",
            "[&_[data-state='active']+p]:block",
            "[&_p]:ml-4"
            //
          )}
        >
          {slots.map((slot, index) => {
            if (isSlot(slot, Item)) {
              return <li key={id + index} {...getSlotProps(slot)} />;
            }
            return slot;
          })}
        </ol>
      ))}
    </div>
  );
}

Steps.Step = Step;
Steps.Item = Item;
export default Steps;
