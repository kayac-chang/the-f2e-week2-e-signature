import clsx from "clsx";
import { Fragment } from "react";
import { createHost, createSlot } from "create-slots";
import type { ComponentProps } from "react";

const Header = createSlot(Fragment);
const Content = createSlot("div");

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
export default CreateSign;
