import clsx from "clsx";
import { useAsync, useAsyncRetry, useToggle } from "react-use";
import * as Tabs from "@radix-ui/react-tabs";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { json } from "@remix-run/server-runtime";
import { assert } from "@sindresorhus/is";
import { Link, useLoaderData } from "@remix-run/react";

import Steps from "~/components/Steps";
import SVG from "~/components/SVG";
import SignDrag from "~/components/SignDrag";
import Toggle from "~/components/Toggle";
import Header from "~/components/Header";
import SideControl from "~/components/SideControl";
import Modal from "~/components/Modal";
import CreateSign from "~/components/CreateSign";
import DatePicker from "~/components/DatePicker";
import EditTitleModal from "~/components/EditTitleModal";
import getDatabase from "~/storages/indexeddb.client";

import type { LoaderArgs } from "@remix-run/server-runtime";
import type { FormEvent } from "react";
import invariant from "tiny-invariant";
import { getAllPagesFromDocument, toDocument } from "~/utils/pdf.client";
import { RenderingCancelledException } from "pdfjs-dist";
import type { PDFPageProxy, RenderTask } from "pdfjs-dist";
import useCallbackRef from "~/hooks/useCallbackRef";

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
              <input
                id="noto-sans-tc"
                type="radio"
                name="font-family"
                defaultChecked
              />
              <label htmlFor="noto-sans-tc">思源黑體</label>
            </div>

            <div data-radio-button>
              <input id="noto-serif-tc" type="radio" name="font-family" />
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

export function loader(props: LoaderArgs) {
  assert.string(props.params.file);

  return json({
    file: {
      id: Number(props.params.file),
    },
  });
}

// async function getFileFromIndexedDB(id: number) {
//   return ;
// }

function HeaderLayout() {
  const data = useLoaderData<typeof loader>();
  const state = useAsyncRetry(() =>
    getDatabase()
      .then((db) => db.transaction("files", "readonly").store.get(data.file.id))
      .then((file) => file?.name)
  );
  const [open, setOpen] = useToggle(false);

  async function rename(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const title = new FormData(e.currentTarget).get("title");
    assert.string(title);

    const db = await getDatabase();
    const tx = db.transaction("files", "readwrite");
    const file = await tx.store.get(data.file.id);
    invariant(file);

    await Promise.all([
      tx.store.put({ ...file, name: title }),
      tx.done,
      //
    ]);

    state.retry();
    setOpen(false);
  }

  return (
    <Header>
      <Header.Content>
        {/* back */}
        <Link to=".." className="inline-block">
          <SVG src={require("~/assets/icons/arrow-back.svg")} className="s-6" />
        </Link>

        {/* title */}
        <h1 className="ml-3 flex items-center gap-2 font-bold">
          <span>{state.value}</span>

          {/* edit title */}
          <Modal open={open} onOpenChange={setOpen}>
            <Modal.Title className="sr-only">edit title</Modal.Title>

            {/* edit title modal trigger */}
            <Modal.Trigger asChild>
              <button className="w-4">
                <SVG src={require("~/assets/icons/edit.svg")} />
              </button>
            </Modal.Trigger>

            <Modal.Content>
              <EditTitleModal onSubmit={rename} />
            </Modal.Content>
          </Modal>
        </h1>
      </Header.Content>

      <Header.Actions>
        <a data-btn="solid-primary" className="inline-block py-2 px-8" href="/">
          註冊
        </a>
      </Header.Actions>

      <Header.Sub>
        {/* steps */}
        <div className="shadow [&_[data-step]]:s-10">
          <Steps>
            <Steps.Item>
              <strong data-step="solid">1</strong>
              <p>成功上傳檔案</p>
            </Steps.Item>
            <Steps.Item>
              <strong data-step="active">2</strong>
              <p>加入簽名檔</p>
            </Steps.Item>
            <Steps.Item>
              <strong data-step="disabled">3</strong>
              <p>確認檔案</p>
            </Steps.Item>
            <Steps.Item>
              <strong data-step="disabled">4</strong>
              <p>下載檔案</p>
            </Steps.Item>
          </Steps>
        </div>
      </Header.Sub>
    </Header>
  );
}

function render(canvas: HTMLCanvasElement, page: PDFPageProxy) {
  let task: RenderTask;
  function update() {
    task?.cancel();
    const scale = canvas.clientWidth / page.getViewport({ scale: 1.0 }).width;
    const viewport = page.getViewport({ scale });
    const canvasContext = canvas.getContext("2d");
    invariant(canvasContext);
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    task = page.render({
      canvasContext,
      viewport,
    });
    task.promise.catch((error) => {
      if (error instanceof RenderingCancelledException) return;
      console.error(error);
    });
  }

  update();
  window.addEventListener("resize", update);
  return () => window.removeEventListener("resize", update);
}
type CanvasProps = {
  className: string;
  page: PDFPageProxy;
};
function Canvas({ page, className }: CanvasProps) {
  const ref = useCallbackRef(
    (canvas: HTMLCanvasElement) => render(canvas, page),
    [page]
  );

  return <canvas className={className} key={page.pageNumber} ref={ref} />;
}
function Preview() {
  const data = useLoaderData<typeof loader>();

  const state = useAsync<() => Promise<PDFPageProxy[]>>(() =>
    getDatabase()
      .then((db) => db.transaction("files", "readonly").store.get(data.file.id))
      .then((file) => {
        invariant(file);
        return file.buffer;
      })
      .then(toDocument)
      .then(getAllPagesFromDocument)
  );

  if (!state.value) return null;

  const list = state.value.map((page) => (
    <Canvas
      key={page.pageNumber}
      className="mt-3 border first:mt-0 lg:mt-6"
      page={page}
    />
  ));
  return <>{list}</>;
}

function ExpiredTime() {
  const [open, setOpen] = useToggle(true);
  return (
    <>
      <Toggle
        labelOff="無期限"
        labelOn="指定簽署期限"
        checked={open}
        onCheckedChange={setOpen}
      />

      {open && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                id="week"
                name="expired-time"
                type="radio"
                defaultChecked
              />
              <label htmlFor="week">7天內</label>
            </div>

            <div className="flex items-center gap-2">
              <input id="month" name="expired-time" type="radio" />
              <label htmlFor="month">30天內</label>
            </div>
          </div>

          <DatePicker />
        </div>
      )}
    </>
  );
}

function Route() {
  return (
    <>
      {/* header */}
      <HeaderLayout />

      <SideControl.Layout>
        {/* main content */}
        <SideControl.Content className="max-h-[73vh] overflow-scroll p-3 lg:max-h-[80vh] lg:p-6">
          <Preview />
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
