import { useAsyncRetry, useToggle } from "react-use";
import { assert } from "@sindresorhus/is";
import { Link } from "@remix-run/react";
import invariant from "tiny-invariant";
import type { FormEvent } from "react";

import Steps from "~/routes/signature/Steps";
import SVG from "~/components/SVG";
import Header from "~/components/Header";
import Modal from "~/components/Modal";
import getDatabase from "~/storages/indexeddb.client";
import EditTitleModal from "~/routes/signature/EditTitleModal";

type Props = {
  id: number;
};
function HeaderLayout(props: Props) {
  const state = useAsyncRetry(() =>
    getDatabase()
      .then((db) => db.transaction("files", "readonly").store.get(props.id))
      .then((file) => file?.name)
  );
  const [open, setOpen] = useToggle(false);

  async function rename(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const title = new FormData(e.currentTarget).get("title");
    assert.string(title);

    const db = await getDatabase();
    const tx = db.transaction("files", "readwrite");
    const file = await tx.store.get(props.id);
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
export default HeaderLayout;
