import { createHost, createSlot } from "create-slots";
import SVG from "~/components/SVG";
import type { ComponentProps } from "react";

const Content = createSlot("div");
const Menu = createSlot("menu");

type SignDragProps = ComponentProps<"div">;
function SignDrag(props: SignDragProps) {
  return createHost(props.children, (slot) => (
    <div
      {...props}
      draggable
      className="flex items-center border border-primary-selected px-3"
    >
      {/* drag icon */}
      <SVG className="w-6" src={require("~/assets/icons/drag-indicator.svg")} />

      {/* content */}
      <div className="ml-2 flex flex-1 flex-col" {...slot.getProps(Content)} />

      {/* menu */}
      <menu className="ml-auto w-8 text-grey" {...slot.getProps(Menu)} />
    </div>
  ));
}

SignDrag.Content = Content;
SignDrag.Menu = Menu;
export default SignDrag;
