import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { assert } from "@sindresorhus/is";
import Presentation from "~/components/Presentation";
import getDatabase from "~/storages/indexeddb.client";
import type { LoaderArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { arrayBufferToDataURL } from "~/utils/blob";
import { useAsync } from "react-use";

export function loader(props: LoaderArgs) {
  assert.string(props.params.file);
  return json({
    id: Number(props.params.file),
  });
}

interface FileWithURL {
  name: string;
  url: string;
}
function Page() {
  const data = useLoaderData();

  const file = useAsync<() => Promise<FileWithURL>>(() =>
    getDatabase()
      .then((db) => db.transaction("files", "readonly"))
      .then((tx) => tx.store.get(data.id))
      .then((file) => {
        invariant(file);
        return file;
      })
      .then((file) =>
        arrayBufferToDataURL(file.buffer, "application/pdf")
          //
          .then((url) => ({ ...file, url }))
      )
  );

  return (
    <Presentation.Layout>
      <Presentation.Visual src={require("~/assets/images/shared-goals.png")} />

      <Presentation.Content>
        <h1 className="title-1 text-primary">恭喜您! 檔案已就緒</h1>

        <p className="mt-2">現在您可以下載檔案或新增簽署檔案。</p>
      </Presentation.Content>

      <Presentation.Footer>
        <a
          download={file.value?.name}
          href={file.value?.url}
          data-btn="solid-primary"
          className="block w-full py-3 font-bold"
        >
          下載檔案
        </a>

        <Link data-btn="primary" className="block w-full py-3 font-bold" to="/">
          回首頁
        </Link>
      </Presentation.Footer>
    </Presentation.Layout>
  );
}
export default Page;
