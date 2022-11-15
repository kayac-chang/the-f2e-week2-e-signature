import clsx from "clsx";
import { Fragment } from "react";
import { createHost, createSlot } from "create-slots";
import type { ComponentProps } from "react";

const Header = createSlot(Fragment);
const Content = createSlot("div");

function PickColor() {
  return (
    <div className="absolute bottom-0 right-0 m-2 flex gap-2">
      <input
        data-color-pick
        className="bg-dark text-dark checked:ring-dark/20 focus:ring-dark/20"
        type="radio"
        name="color"
      />

      <input
        data-color-pick
        className="bg-general text-general checked:ring-general/20 focus:ring-general/20"
        type="radio"
        name="color"
      />

      <input
        data-color-pick
        className="bg-negative text-negative checked:ring-negative/20 focus:ring-negative/20"
        type="radio"
        name="color"
      />
    </div>
  );
}

type CreateSignProps = ComponentProps<"div">;
function CreateSign(props: CreateSignProps) {
  return createHost(props.children, (slot) => (
    <div className="flex flex-col">
      {/* header */}
      <div className="flex items-center gap-2">
        <Fragment {...slot.getProps(Header)} />
      </div>

      {/* content */}
      <div
        {...slot.getProps(Content)}
        className={clsx(
          "relative mt-2 h-40 rounded border",
          slot.getProps(Content)?.className
        )}
      />

      {/* terms of use */}
      <p className="mt-4 text-center text-dark-grey">
        我了解這是一個具法律效力的本人簽名
      </p>

      {/* save */}
      <button className="btn mx-auto mt-2 bg-ui-grey py-2 px-8 text-dark-grey">
        儲存
      </button>
    </div>
  ));
}

CreateSign.Header = Header;
CreateSign.Content = Content;
CreateSign.PickColor = PickColor;
export default CreateSign;
