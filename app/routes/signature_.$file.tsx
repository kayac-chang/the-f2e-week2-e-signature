import clsx from "clsx";
import { json } from "@remix-run/server-runtime";
import { assert } from "@sindresorhus/is";
import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";

import SVG from "~/components/SVG";
import Modal from "~/components/Modal";

import Toggle from "~/routes/signature/Toggle";
import SideControl from "~/routes/signature/SideControl";
import SignDrag from "~/routes/signature/SignDrag";
import ExpiredTime from "~/routes/signature/ExpiredTime";
import Preview from "~/routes/signature/Preview";
import HeaderLayout from "~/routes/signature/Header";
import CreateSignatureModal from "~/routes/signature/CreateSignatureModal";
import InviteSignerModal from "~/routes/signature/InviteSignerModal";

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
          <div className="flex flex-col gap-2">
            <strong>我的簽名</strong>

            {/* create signature */}
            <Modal>
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
                  <SVG
                    className="w-6"
                    src={require("~/assets/icons/plus.svg")}
                  />
                  <strong>創建簽名檔</strong>
                </button>
              </Modal.Trigger>

              <Modal.Content>
                <CreateSignatureModal />
              </Modal.Content>
            </Modal>
          </div>

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
