import { Fragment } from "react";
import SVG from "~/components/SVG";
import { createHost, createSlot } from "create-slots";
import * as Dialog from "@radix-ui/react-dialog";
import type { ComponentProps } from "react";
import { useHydrated } from "remix-utils";

const Trigger = createSlot(Dialog.Trigger);
const Content = createSlot(Fragment);
const Title = createSlot(Dialog.Title);

type Props = ComponentProps<typeof Dialog.Root>;
function Modal(props: Props) {
  const isHydrated = useHydrated();

  if (!isHydrated) return null;

  return createHost(props.children, (slot) => (
    <Dialog.Root {...props}>
      <Dialog.Trigger {...slot.getProps(Trigger)} asChild />

      <Dialog.Portal>
        {/* overlay */}
        <Dialog.Overlay className="fixed inset-0 z-10 bg-primary-selected/40 backdrop-blur" />

        <Dialog.Content className="position-center fixed z-10 w-[90%] max-w-prose rounded bg-white shadow-lg">
          {/* modal top */}
          <div className="flex items-center p-3">
            <Dialog.Close asChild>
              <button type="button" aria-label="Close" className="ml-auto s-6">
                <SVG src={require("~/assets/icons/close.svg")} />
              </button>
            </Dialog.Close>
          </div>

          <Dialog.Title {...slot.getProps(Title)} />

          <Fragment {...slot.getProps(Content)} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  ));
}

Modal.Trigger = Trigger;
Modal.Content = Content;
Modal.Title = Title;
export default Modal;
