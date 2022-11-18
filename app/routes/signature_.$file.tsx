import clsx from "clsx";
import { json } from "@remix-run/server-runtime";
import { assert } from "@sindresorhus/is";
import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { map } from "ramda";

import SVG from "~/components/SVG";
import Modal from "~/components/Modal";

import Toggle from "~/routes/signature/Toggle";
import SideControl from "~/routes/signature/SideControl";
import SignDrag from "~/routes/signature/SignDrag";
import ExpiredTime from "~/routes/signature/ExpiredTime";
import Preview from "~/routes/signature/Preview";
import HeaderLayout from "~/routes/signature/Header";
import InviteSignerModal from "~/routes/signature/InviteSignerModal";
import { useAsyncRetry, useToggle } from "react-use";
import getDatabase from "~/storages/indexeddb.client";
import {
  arrayBufferToImageSrc,
  blobToArrayBuffer,
  canvasToArrayBuffer,
} from "~/utils/blob";
import { FormEvent } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Typing, Upload, Write } from "~/routes/signature/CreateSignatureModal";
import * as htmlToImage from "html-to-image";
import invariant from "tiny-invariant";

function Signer() {
  return (
    <SignDrag>
      <SignDrag.Content>
        <strong>咖哩 飯</strong>
        <small className="text-sm text-primary">123456@gmail.com</small>
      </SignDrag.Content>

      <SignDrag.Menu>
        <SVG src={require("~/assets/icons/unfold-more.svg")} />
      </SignDrag.Menu>
    </SignDrag>
  );
}

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
      map((signature) => ({
        ...signature,
        src: arrayBufferToImageSrc(signature.buffer, "image/png"),
      }))
    );
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

      <ul className="grid gap-2">
        {state.value?.map((signature) => (
          <li key={signature.id}>
            <img src={signature.src} alt="signature" />
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
              //
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
              <Write onSubmitArrayBuffer={onSubmit} />
            </Tabs.Content>

            {/* upload */}
            <Tabs.Content value="upload">
              <Upload onSubmitArrayBuffer={onSubmit} />
            </Tabs.Content>
          </Tabs.Root>
        </Modal.Content>
      </Modal>
    </div>
  );
}

export function loader(props: LoaderArgs) {
  assert.string(props.params.file);

  return json({
    file: {
      id: Number(props.params.file),
    },
  });
}

function Route() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      {/* header */}
      <HeaderLayout id={data.file.id} />

      <SideControl.Layout>
        {/* main content */}
        <SideControl.Content className="max-h-[73vh] overflow-scroll p-3 lg:max-h-[80vh] lg:p-6">
          <Preview id={data.file.id} />
        </SideControl.Content>

        <SideControl.Menu>
          {/* basic information */}
          <div className="flex flex-col gap-2">
            <strong>基本資料</strong>

            <input
              name="name"
              type="text"
              aria-label="請輸入您的姓名"
              placeholder="請輸入您的姓名"
            />
            <input
              name="email"
              type="email"
              aria-label="請輸入您的電子信箱"
              placeholder="請輸入您的電子信箱"
            />
          </div>

          {/* signature */}
          <Signature />

          {/* invite signer */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <div className="flex flex-col space-y-1">
                {/* label */}
                <strong>邀請簽署人</strong>

                {/* sort */}
                <Toggle labelOff="無簽署順序" labelOn="排列簽署順序" />
              </div>

              {/* invite signer modal */}
              <Modal>
                <Modal.Title className="sr-only">invite signer</Modal.Title>

                {/* invite signer modal trigger */}
                <Modal.Trigger>
                  <button
                    data-btn
                    className="aspect-square w-12 border border-grey p-3"
                  >
                    <SVG src={require("~/assets/icons/person-add.svg")} />
                  </button>
                </Modal.Trigger>

                <Modal.Content>
                  <InviteSignerModal />
                </Modal.Content>
              </Modal>
            </div>

            {/* invite list */}
            <ul className="grid gap-2"></ul>

            {/* expired time */}
            <ExpiredTime />
          </div>
        </SideControl.Menu>

        <SideControl.Actions>
          {/* next step */}
          <a href="/" className="btn block bg-ui-grey py-3 text-dark-grey">
            下一步
          </a>
        </SideControl.Actions>
      </SideControl.Layout>
    </>
  );
}

export default Route;
