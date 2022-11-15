import { createSlot, createHost } from "create-slots";
import type { ComponentProps } from "react";

const Visual = createSlot("img");
const Content = createSlot("div");
const Footer = createSlot("div");

type Props = ComponentProps<"main">;
function Layout(props: Props) {
  return createHost(props.children, (slot) => (
    <main className="grid h-screen place-content-center bg-primary-selected/20 p-6">
      <div className="m-auto grid max-w-screen-md lg:grid-cols-2">
        <div className="my-16">
          <img
            {...slot.getProps(Visual)}
            role="presentation"
            alt="presentation"
          />
        </div>

        <div className="flex flex-col justify-center">
          <div {...slot.getProps(Content)} />

          <div className="mt-12 space-y-2" {...slot.getProps(Footer)} />
        </div>
      </div>
    </main>
  ));
}
export default { Layout, Visual, Content, Footer };
