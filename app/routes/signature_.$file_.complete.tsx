import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useAsync } from "react-use";
import { assert } from "@sindresorhus/is";
import Presentation from "~/components/Presentation";
import getDatabase from "~/storages/indexeddb.client";
import type { LoaderArgs } from "@remix-run/node";
import { jsPDF } from "jspdf";
import invariant from "tiny-invariant";
import { arrayBufferToBlob, arrayBufferToImageSrc } from "~/utils/blob";

export function loader(props: LoaderArgs) {
  assert.string(props.params.file);
  return json({
    id: Number(props.params.file),
  });
}

function Page() {
  const data = useLoaderData();

  const save = () =>
    getDatabase()
      .then((db) => db.transaction("files", "readonly"))
      .then((tx) => tx.store.get(data.id))
      .then((document) => {
        invariant(document);
        return document;
      })
      .then((document) => arrayBufferToImageSrc(document.buffer, "image/png"))
      .then((src) => {
        console.log(src);
        const image = new Image();
        image.src = src;
        return new Promise<HTMLImageElement>((resolve) => {
          image.addEventListener("load", () => resolve(image));
        });
      })
      .then((image) => {
        console.log(image);
        const pdf = new jsPDF({ unit: "px" });
        pdf.addImage(image, 0, 0, image.width, image.height);
        console.log(pdf);
      });

  return (
    <Presentation.Layout>
      <Presentation.Visual src={require("~/assets/images/shared-goals.png")} />

      <Presentation.Content>
        <h1 className="title-1 text-primary">恭喜您! 檔案已就緒</h1>

        <p className="mt-2">現在您可以下載檔案或新增簽署檔案。</p>
      </Presentation.Content>

      <Presentation.Footer>
        <button
          data-btn="solid-primary"
          className="w-full py-3 font-bold"
          onClick={save}
        >
          下載檔案
        </button>

        <Link data-btn="primary" className="block w-full py-3 font-bold" to="/">
          回首頁
        </Link>
      </Presentation.Footer>
    </Presentation.Layout>
  );
}
export default Page;
