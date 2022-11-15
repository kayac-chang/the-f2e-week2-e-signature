import { createHost, createSlot } from "create-slots";
import { Fragment } from "react";
import type { ComponentProps } from "react";

const Content = createSlot(Fragment);
const Actions = createSlot("nav");
const Sub = createSlot(Fragment);

type HeaderProps = ComponentProps<"header">;
function Header(props: HeaderProps) {
  return createHost(props.children, (slot) => (
    <header className="relative z-10">
      <div className="shadow">
        <div className="container flex items-center px-6 py-4 lg:py-6">
          {/* content */}
          <Fragment {...slot.getProps(Content)} />

          {/* actions */}
          <nav className="ml-auto flex space-x-2" {...slot.getProps(Actions)} />
        </div>
      </div>

      {/* sub */}
      <Fragment {...slot.getProps(Sub)} />
    </header>
  ));
}

Header.Content = Content;
Header.Actions = Actions;
Header.Sub = Sub;
export default Header;
