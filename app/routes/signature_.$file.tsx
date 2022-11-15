import clsx from "clsx";
import { Link } from "@remix-run/react";
import Steps from "~/components/Steps";
import SVG from "~/components/SVG";
import SignDrag from "~/components/SignDrag";
import Toggle from "~/components/Toggle";
import Header from "~/components/Header";
import SideControl from "~/components/SideControl";

import * as Tabs from "@radix-ui/react-tabs";
import Modal from "~/components/Modal";
import CreateSign from "~/components/CreateSign";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

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

function CreateSignatureModal() {
  return (
    <Tabs.Root defaultValue="typing">
      {/* tabs */}
      <Tabs.List>
        <Tabs.Trigger value="typing">輸入</Tabs.Trigger>
        <Tabs.Trigger value="write">手寫</Tabs.Trigger>
        <Tabs.Trigger value="upload">上傳</Tabs.Trigger>
      </Tabs.List>

      {/* typing */}
      <Tabs.Content value="typing">
        <CreateSign>
          <CreateSign.Header>
            {/* choose font family */}
            <div data-radio-button>
              <input id="noto-sans-tc" type="radio" defaultChecked />
              <label htmlFor="noto-sans-tc">思源黑體</label>
            </div>

            <div data-radio-button>
              <input id="noto-serif-tc" type="radio" />
              <label htmlFor="noto-serif-tc" className="font-noto-serif-tc">
                思源宋體
              </label>
            </div>
          </CreateSign.Header>

          <CreateSign.Content>
            {/* typing */}
            <input
              type="text"
              placeholder="請在這裡輸入您的簽名"
              maxLength={50}
              className={clsx(
                "border-none focus:ring-0",
                "absolute inset-0",
                "text-center placeholder:my-auto placeholder:text-base",
                "text-5xl"
              )}
            />

            {/* pick color */}
            <CreateSign.PickColor />
          </CreateSign.Content>
        </CreateSign>
      </Tabs.Content>

      {/* write */}
      <Tabs.Content value="write">
        <CreateSign>
          <CreateSign.Header>
            <button type="button" data-btn className="ml-auto p-2 text-primary">
              回上一步
            </button>
            <button type="button" data-btn className="p-2 text-primary">
              清除
            </button>
          </CreateSign.Header>

          <CreateSign.Content>
            {/* write */}
            <canvas className="s-full" />

            {/* pick color */}
            <CreateSign.PickColor />
          </CreateSign.Content>
        </CreateSign>
      </Tabs.Content>

      {/* upload */}
      <Tabs.Content value="upload">
        <CreateSign>
          <CreateSign.Header>
            <button type="button" data-btn className="ml-auto p-2 text-primary">
              更改
            </button>
            <button type="button" data-btn className="p-2 text-primary">
              清除
            </button>
          </CreateSign.Header>

          <CreateSign.Content className="flex-center flex-col gap-2 text-center">
            {/* upload */}
            <input id="upload" type="file" hidden />
            <label
              htmlFor="upload"
              data-btn
              className="inline-block border py-2 px-4"
            >
              上傳檔案
            </label>

            <p className="text-primary">
              檔案大小10 MB以內，檔案格式jpg, pmg, bmp
            </p>

            <AlertDialog.Root>
              <AlertDialog.Content className="fixed w-full max-w-lg rounded bg-white p-6 shadow">
                <AlertDialog.Title className="text-lg font-bold text-negative">
                  上傳失敗
                </AlertDialog.Title>

                <div className="mt-6 flex flex-col gap-2">
                  <p>您的檔案過大</p>

                  <p>請確認檔案大小最大為10MB，並以jpg, png, bmp格式上傳</p>
                </div>

                <AlertDialog.Action asChild>
                  <button data-btn className="theme-primary mt-6 px-8 py-2">
                    確認
                  </button>
                </AlertDialog.Action>
              </AlertDialog.Content>
            </AlertDialog.Root>
          </CreateSign.Content>
        </CreateSign>
      </Tabs.Content>
    </Tabs.Root>
  );
}

function InviteSignerModal() {
  return (
    <Tabs.Root defaultValue="invite">
      {/* tabs */}
      <Tabs.List>
        <Tabs.Trigger value="invite">邀請簽署人</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="invite">
        <div>
          <label htmlFor="email">簽署人信箱</label>
          <input
            id="email"
            type="email"
            placeholder="請輸入電子郵件"
            className="mt-2"
            required
          />
        </div>

        <div className="mt-8 grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="last-name">姓氏</label>
            <input
              id="last-name"
              type="text"
              placeholder="簽署人的姓氏"
              className="mt-2"
              required
            />
          </div>

          <div>
            <label htmlFor="last-name">名字</label>
            <input
              id="last-name"
              type="text"
              placeholder="簽署人的名字"
              className="mt-2"
            />
          </div>
        </div>

        <div className="mt-10 text-center">
          <button data-btn disabled className="px-8 py-2">
            儲存
          </button>
        </div>
      </Tabs.Content>
    </Tabs.Root>
  );
}

function EditTitleModal() {
  return (
    <Tabs.Root defaultValue="rename">
      <Tabs.List>
        <Tabs.Trigger value="rename">重新命名檔案</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="rename">
        <div>
          <label htmlFor="title">檔案</label>
          <input
            id="title"
            type="text"
            placeholder="請輸入檔案名稱"
            className="mt-2"
          />
        </div>

        <div className="mt-10 text-center">
          <button data-btn disabled className="px-8 py-2">
            儲存
          </button>
        </div>
      </Tabs.Content>
    </Tabs.Root>
  );
}

function Route() {
  return (
    <>
      {/* header */}
      <Header>
        <Header.Content>
          {/* back */}
          <Link to=".." className="inline-block">
            <SVG
              src={require("~/assets/icons/arrow-back.svg")}
              className="text-dark-grey s-6"
            />
          </Link>

          {/* title */}
          <h1 className="ml-3 flex items-center gap-2 font-bold">
            <span>型號U-ew8951出貨單</span>

            {/* edit title */}
            <Modal>
              <Modal.Title className="sr-only">edit title</Modal.Title>

              {/* edit title modal trigger */}
              <Modal.Trigger>
                <button className="w-4">
                  <SVG src={require("~/assets/icons/edit.svg")} />
                </button>
              </Modal.Trigger>

              <Modal.Content>
                <EditTitleModal />
              </Modal.Content>
            </Modal>
          </h1>
        </Header.Content>

        <Header.Actions>
          <a className="btn theme-primary inline-block py-2 px-8" href="/">
            註冊
          </a>
        </Header.Actions>

        <Header.Sub>
          {/* steps */}
          <div className="shadow">
            <Steps>
              <Steps.Item>
                <Steps.Step>1</Steps.Step>
                <p>成功上傳檔案</p>
              </Steps.Item>
              <Steps.Item>
                <Steps.Step data-state="active">2</Steps.Step>
                <p>加入簽名檔</p>
              </Steps.Item>
              <Steps.Item>
                <Steps.Step data-state="disabled">3</Steps.Step>
                <p>確認檔案</p>
              </Steps.Item>
              <Steps.Item>
                <Steps.Step data-state="disabled">4</Steps.Step>
                <p>下載檔案</p>
              </Steps.Item>
            </Steps>
          </div>
        </Header.Sub>
      </Header>

      <SideControl.Layout>
        <SideControl.Content>
          {/* canvas view */}
          <canvas className="border s-full" />
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
                  className={clsx(
                    "flex items-center justify-center gap-2",
                    "btn border border-grey py-3"
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
                  <button className="btn aspect-square w-12 border border-grey p-3">
                    <SVG src={require("~/assets/icons/person-add.svg")} />
                  </button>
                </Modal.Trigger>

                <Modal.Content>
                  <InviteSignerModal />
                </Modal.Content>
              </Modal>
            </div>

            {/* invite list */}
            <ul className="grid gap-2">
              <li>
                <Signer />
              </li>
              <li>
                <Signer />
              </li>
            </ul>

            {/* expired time */}
            <Toggle labelOff="無期限" labelOn="指定簽署期限" />
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