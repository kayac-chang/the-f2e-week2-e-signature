import clsx from "clsx";
import { createHost, createSlot } from "create-slots";
import { Fragment } from "react";
import type { ComponentProps } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";

import SVG from "~/components/SVG";

const Content = createSlot("div");
const Menu = createSlot(Fragment);
const Actions = createSlot(Fragment);

type Props = ComponentProps<"main">;
function Layout(props: Props) {
  return createHost(props.children, (slot) => (
    <main className="flex flex-1 flex-col 2xl:container">
      <div className="relative flex flex-1 items-center lg:static">
        {/* content */}
        <div
          {...slot.getProps(Content)}
          className={clsx(
            "s-full",
            "lg:ml-auto lg:w-3/4",
            "bg-light-grey",
            slot.getProps(Content)?.className
            //
          )}
        />

        {/* side control / sm */}
        <Collapsible.Root asChild>
          <div
            className={clsx(
              "lg:hidden",
              "flex justify-end",
              "h-full max-w-md",
              "absolute right-0"
            )}
          >
            {/* side control toggle */}
            <Collapsible.Trigger asChild>
              <button type="button" className="h-full w-6 bg-white shadow-md">
                <SVG src={require("~/assets/icons/arrow-left.svg")} />
              </button>
            </Collapsible.Trigger>

            {/* side control menu */}
            <Collapsible.Content asChild>
              <menu className="flex w-[90vw] flex-1 flex-col bg-white">
                <div className="flex h-[72vh] flex-col gap-10 overflow-scroll p-6">
                  <Fragment {...slot.getProps(Menu)} />
                </div>
              </menu>
            </Collapsible.Content>
          </div>
        </Collapsible.Root>

        {/* side control / lg */}
        <div
          className={clsx(
            "hidden lg:flex",
            "justify-end",
            "h-full max-w-md",
            "lg:relative lg:w-auto lg:flex-1"
          )}
        >
          {/* side control menu */}
          <menu className="flex w-[90vw] flex-1 flex-col bg-white">
            <div className="flex h-[72vh] flex-col gap-10 overflow-scroll p-6">
              <Fragment {...slot.getProps(Menu)} />
            </div>

            <div className="mt-auto p-6">
              <Fragment {...slot.getProps(Actions)} />
            </div>
          </menu>
        </div>
      </div>

      <div className="border-t px-6 pb-6 pt-3 lg:hidden">
        <Fragment {...slot.getProps(Actions)} />
      </div>
    </main>
  ));
}

export default { Layout, Content, Menu, Actions };
