import clsx from "clsx";
import { createHost, createSlot } from "create-slots";
import { Fragment } from "react";
import SVG from "~/components/SVG";
import type { ComponentProps } from "react";

const Content = createSlot("div");
const Menu = createSlot(Fragment);
const Actions = createSlot(Fragment);

type SideControlProps = ComponentProps<"menu">;
function SideControl(props: SideControlProps) {
  return (
    <div
      className={clsx(
        "bg-white",
        "flex justify-end",
        "w-[90%] max-w-lg",
        "absolute right-0 h-full",
        "flex-1 lg:static lg:w-auto"
      )}
    >
      {/* side control toggle */}
      <button type="button" className="h-full w-4 bg-white shadow-md lg:hidden">
        <SVG src={require("~/assets/icons/arrow-left.svg")} />
      </button>

      {/* side control menu */}
      <menu className="flex flex-1 flex-col gap-10 p-6">{props.children}</menu>
    </div>
  );
}

type Props = ComponentProps<"main">;
function Layout(props: Props) {
  return createHost(props.children, (slot) => (
    <main className="flex flex-1 flex-col 2xl:container">
      <div className="relative flex flex-1 items-center lg:static">
        {/* content */}
        <div
          className={clsx(
            "s-full",
            "lg:ml-auto lg:w-3/4",
            "bg-light-grey",
            "flex items-center justify-center",
            "p-6"
            //
          )}
          {...slot.getProps(Content)}
        />

        {/* side control */}
        <SideControl>
          <Fragment {...slot.getProps(Menu)} />

          <div className="mt-auto hidden lg:block">
            <Fragment {...slot.getProps(Actions)} />
          </div>
        </SideControl>
      </div>

      <div className="border-t px-6 pb-6 pt-3 lg:hidden">
        <Fragment {...slot.getProps(Actions)} />
      </div>
    </main>
  ));
}

export default { Layout, Content, Menu, Actions };
