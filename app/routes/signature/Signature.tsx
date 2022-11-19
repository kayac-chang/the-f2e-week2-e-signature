import clsx from "clsx";
import { map } from "ramda";
import * as Tabs from "@radix-ui/react-tabs";
import { useAsyncRetry, useToggle } from "react-use";
import type { DragEvent } from "react";

import SVG from "~/components/SVG";
import Modal from "~/components/Modal";

import SignDrag from "~/routes/signature/SignDrag";
import { Upload, Write } from "~/routes/signature/CreateSignatureModal";
import getDatabase from "~/storages/indexeddb.client";
import { arrayBufferToDataURL } from "~/utils/blob";

async function saveSignature(buffer: ArrayBuffer) {
  return getDatabase()
    .then((db) => db.transaction("signatures", "readwrite"))
    .then((tx) =>
      Promise.all([
        tx.store.add({ buffer }),
        tx.done,
        //
      ])
    );
}

async function getAllSignatures() {
  return getDatabase()
    .then((db) => db.getAll("signatures"))
    .then(
      map((signature) => arrayBufferToDataURL(signature.buffer, "image/png"))
    )
    .then(Promise.all.bind(Promise)) as Promise<string[]>;
}

function onDragStart(src: string) {
  return (event: DragEvent) => {
    const { offsetX: x, offsetY: y } = event.nativeEvent;
    event.dataTransfer.setData(
      "signature",
      JSON.stringify({
        start_position: { x, y },
        src,
      })
    );
  };
}

function Signature() {
  const [open, toggle] = useToggle(false);
  const state = useAsyncRetry(() => getAllSignatures());

  async function onSubmit(buffer: ArrayBuffer) {
    return saveSignature(buffer).then(state.retry).then(toggle);
  }

  return (
    <div className="flex flex-col gap-2">
      <strong>我的簽名</strong>

      {/* signatures */}
      <ul className="grid gap-2">
        {state.value?.map((signature) => (
          <li key={signature}>
            <SignDrag
              className="h-[100px] w-[400px]"
              onDragStart={onDragStart(signature)}
            >
              <SignDrag.Content>
                <img src={signature} alt="signature" />
              </SignDrag.Content>
            </SignDrag>
          </li>
        ))}
      </ul>

      {/* create signature */}
      <Modal open={open} onOpenChange={toggle}>
        <Modal.Title className="sr-only">create signature</Modal.Title>

        {/* create signature modal trigger */}
        <Modal.Trigger>
          <button
            data-btn
            className={clsx(
              "flex items-center justify-center gap-2",
              "border border-grey py-3"
            )}
          >
            <SVG className="w-6" src={require("~/assets/icons/plus.svg")} />
            <strong>創建簽名檔</strong>
          </button>
        </Modal.Trigger>

        <Modal.Content>
          <Tabs.Root defaultValue="write">
            {/* tabs */}
            <Tabs.List>
              <Tabs.Trigger value="write">手寫</Tabs.Trigger>
              <Tabs.Trigger value="upload">上傳</Tabs.Trigger>
            </Tabs.List>

            {/* write */}
            <Tabs.Content value="write">
              <Write onSubmit={onSubmit} />
            </Tabs.Content>

            {/* upload */}
            <Tabs.Content value="upload">
              <Upload onSubmit={onSubmit} />
            </Tabs.Content>
          </Tabs.Root>
        </Modal.Content>
      </Modal>
    </div>
  );
}

export default Signature;
