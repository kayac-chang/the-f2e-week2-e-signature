import { useHydrated } from "remix-utils";
import { createHost, createSlot } from "create-slots";
import * as Dialog from "@radix-ui/react-dialog";
import SVG from "~/components/SVG";
import { Fragment } from "react";
import type { ComponentProps } from "react";

const Trigger = createSlot(Dialog.Trigger);
const Content = createSlot(Dialog.Content);
const Title = createSlot(Dialog.Title);
const Overlay = createSlot(Dialog.Overlay);

type Props = ComponentProps<typeof Dialog.Root> & { portal?: boolean };
function Modal(props: Props) {
  const isHydrated = useHydrated();
  if (!isHydrated) return null;
  return createHost(props.children, (slot) => {
    const trigger = slot.getProps(Trigger);
    const overlay = slot.getProps(Overlay);
    const title = slot.getProps(Title);
    const content = slot.getProps(Content);
    const Portal = props.portal ? Dialog.Portal : Fragment;

    return (
      <Dialog.Root {...props}>
        {trigger && <Dialog.Trigger {...trigger} asChild />}

        <Portal>
          {/* overlay */}
          <Dialog.Overlay
            className="fixed inset-0 z-10 bg-primary-selected/40 backdrop-blur"
            {...overlay}
          />

          <Dialog.Content
            className="position-center fixed z-10 w-[90%] max-w-lg rounded bg-white shadow-lg"
            {...content}
          >
            {/* modal top */}
            <div className="flex items-center p-3">
              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label="Close"
                  className="ml-auto s-6"
                >
                  <SVG src={require("~/assets/icons/close.svg")} />
                </button>
              </Dialog.Close>
            </div>

            {title && <Dialog.Title {...title} />}

            {content?.children}
          </Dialog.Content>
        </Portal>
      </Dialog.Root>
    );
  });
}

Modal.Trigger = Trigger;
Modal.Content = Content;
Modal.Title = Title;
Modal.Overlay = Overlay;
export default Modal;
