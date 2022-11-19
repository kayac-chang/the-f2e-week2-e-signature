import { useAsyncRetry, useToggle } from "react-use";
import { assert } from "@sindresorhus/is";
import { Link } from "@remix-run/react";
import invariant from "tiny-invariant";
import type { FormEvent, ReactNode } from "react";

import SVG from "~/components/SVG";
import Header from "~/components/Header";
import Modal from "~/components/Modal";
import getDatabase from "~/storages/indexeddb.client";
import EditTitleModal from "~/routes/signature/EditTitleModal";
import type { Schema } from "~/storages/indexeddb.client";

async function getFile(id: number) {
  return getDatabase().then((db) =>
    db.transaction("files", "readonly").store.get(id)
  );
}
async function updateFile(file: Schema["files"]["value"]) {
  return getDatabase()
    .then((db) => db.transaction("files", "readwrite"))
    .then((tx) =>
      Promise.all([
        tx.store.put(file),
        tx.done,
        //
      ])
    );
}

type Props = {
  id: number;
  children?: ReactNode;
};
function HeaderLayout(props: Props) {
  const state = useAsyncRetry(() => getFile(props.id));
  const [open, setOpen] = useToggle(false);

  async function rename(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const title = new FormData(e.currentTarget).get("title");
    assert.string(title);

    invariant(state.value);
    const file = state.value;
    return updateFile({ ...file, name: title })
      .then(state.retry)
      .then(setOpen);
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
          <span>{state.value?.name}</span>

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

      <Header.Sub>{props.children}</Header.Sub>
    </Header>
  );
}
export default HeaderLayout;
