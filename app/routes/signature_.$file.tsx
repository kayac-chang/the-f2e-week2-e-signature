import clsx from "clsx";
import { map } from "ramda";
import { json } from "@remix-run/server-runtime";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { assert } from "@sindresorhus/is";
import { useLoaderData, useNavigate } from "@remix-run/react";
import invariant from "tiny-invariant";
import { useAsync, useEffectOnce } from "react-use";
import { useRef, useState } from "react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import type { PDFPageProxy } from "pdfjs-dist";
import type Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";
import type { Schema } from "~/storages/indexeddb.client";

import SideControl from "~/routes/signature/SideControl";
import Preview from "~/routes/signature/Preview";
import HeaderLayout from "~/routes/signature/Header";
import Signature from "~/routes/signature/Signature";
import Steps from "~/routes/signature/Steps";
import getDatabase from "~/storages/indexeddb.client";
import { getAllPagesFromDocument, toDocument } from "~/utils/pdf.client";
import jsPDF from "jspdf";
import PDFMerger from "pdf-merger-js/browser";

async function save(file: Schema["documents"]["value"]) {
  return getDatabase()
    .then((db) => db.transaction("documents", "readwrite"))
    .then((tx) =>
      Promise.all([
        tx.store.add(file),
        tx.done,
        //
      ])
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

  const file = useAsync<() => Promise<Schema["files"]["value"]>>(() =>
    getDatabase()
      .then((db) => db.transaction("files", "readonly"))
      .then((tx) => tx.store.get(data.file.id))
      .then((file) => {
        invariant(file);
        return file;
      })
  );

  const state = useAsync<() => Promise<PDFPageProxy[]>>(() =>
    getDatabase()
      .then((db) => db.transaction("files", "readonly"))
      .then((tx) => tx.store.get(data.file.id))
      .then((file) => {
        invariant(file);
        return file.buffer;
      })
      .then(toDocument)
      .then(getAllPagesFromDocument)
  );

  const stagesRef = useRef<Konva.Stage[]>([]);
  const menuRef = useRef<HTMLMenuElement>(null);
  const signatureRef = useRef<Konva.Image | null>(null);
  useEffectOnce(() => {
    function close() {
      if (!menuRef.current) return;
      menuRef.current.hidden = true;
      signatureRef.current = null;
    }
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  });

  function onContextMenu(event: KonvaEventObject<MouseEvent>) {
    if (!event.target.hasName("signature")) return;

    event.evt.preventDefault();
    const pointer = event.evt;

    if (!menuRef.current) return;
    const menu = menuRef.current;
    menu.hidden = false;
    menu.style.top = pointer.offsetY + menu.clientHeight / 2 + "px";
    menu.style.left = pointer.offsetX + menu.clientWidth / 2 + "px";

    signatureRef.current = event.target as Konva.Image;
  }

  function removeSignatureFromPreview() {
    const signature = signatureRef.current;
    const stage = signature?.getStage();
    const tr = stage?.findOne(".tr") as Konva.Transformer;
    invariant(signature && stage && tr);
    tr.nodes([]);
    signature.destroy();
    signatureRef.current = null;
    stage.fire("change");
  }

  const [hasEdit, setHasEdit] = useState(false);
  const onStageChange = (stage: Konva.Stage) =>
    setHasEdit(Boolean(stage.findOne(".signature")));

  const [step, setStep] = useState(1);
  const list = ["成功上傳檔案", "加入簽名檔", "確認檔案", "下載檔案"];
  const stepstate = (index: number) => {
    if (index < step) return "solid";
    if (index === step) return "active";
    return "disabled";
  };
  const prevStep = () => setStep(step - 1);
  const nextStep = () => setStep(step + 1);

  const navigate = useNavigate();

  async function submit() {
    invariant(stagesRef.current);

    return Promise.resolve(stagesRef.current)
      .then(
        map((stage) => {
          // cancel all transformer
          const tr = stage.findOne(".tr") as Konva.Transformer;
          tr.nodes([]);

          const src = stage.toDataURL();
          const doc = new jsPDF({ compress: true });
          doc.addImage(src, 0, 0, 210, 297);
          return doc.output("blob");
        })
      )
      .then((tasks) => Promise.all(tasks))
      .then(async (files) => {
        const merger = new PDFMerger();

        for (const file of files) {
          await merger.add(file);
        }
        const buffer = await merger.saveAsBuffer();

        invariant(file.value?.name);
        save({ name: file.value.name, buffer });
      });
  }

  return (
    <>
      {/* header */}
      <HeaderLayout id={data.file.id}>
        {/* steps */}
        <div className="shadow [&_[data-step]]:s-10">
          <Steps>
            {list.map((step, index) => (
              <Steps.Item key={step}>
                <strong data-step={stepstate(index)}>{index + 1}</strong>
                <p>{step}</p>
              </Steps.Item>
            ))}
          </Steps>
        </div>
      </HeaderLayout>

      <SideControl.Layout>
        {/* main content */}
        <SideControl.Content
          className={clsx(
            "flex flex-col gap-6",
            "max-h-[73vh] p-3",
            "overflow-scroll",
            "lg:max-h-[80vh] lg:p-6",
            "relative"
            //
          )}
        >
          {state.value?.map((page) => (
            <Preview
              key={page.pageNumber}
              page={page}
              onContextMenu={onContextMenu}
              onChange={onStageChange}
              ref={(ref) => ref && stagesRef.current.push(ref)}
            />
          ))}

          <menu
            className="absolute overflow-hidden rounded shadow"
            ref={menuRef}
            hidden
          >
            <button
              type="button"
              className="bg-white p-2 hover:bg-primary-selected hover:text-primary"
              onClick={removeSignatureFromPreview}
            >
              Delete
            </button>
          </menu>
        </SideControl.Content>

        <SideControl.Menu>
          {/* signature */}
          <Signature />
        </SideControl.Menu>

        <SideControl.Actions>
          {/* next step */}
          <AlertDialog.Root>
            <AlertDialog.Trigger asChild>
              <button
                type="button"
                data-btn="solid-primary"
                className="w-full py-3"
                disabled={!hasEdit}
                onClick={nextStep}
              >
                下一步
              </button>
            </AlertDialog.Trigger>

            <AlertDialog.Overlay className="absolute inset-0 bg-primary-selected/40 backdrop-blur" />

            <AlertDialog.Content className="flex-center absolute inset-0 flex flex-col">
              <div className="w-[80%] space-y-8 rounded bg-white p-10 text-center shadow">
                <div className="space-y-2">
                  <strong className="text-2xl text-primary">
                    請確認您的檔案
                  </strong>
                  <p>確認後將無法修改。</p>
                </div>

                <div>
                  <button
                    type="button"
                    data-btn="solid-primary"
                    className="w-full py-3"
                    onClick={submit}
                  >
                    確認
                  </button>
                  <AlertDialog.Cancel asChild>
                    <button
                      type="button"
                      data-btn="text-primary"
                      className="w-full py-3"
                      onClick={prevStep}
                    >
                      返回
                    </button>
                  </AlertDialog.Cancel>
                </div>
              </div>
            </AlertDialog.Content>
          </AlertDialog.Root>
        </SideControl.Actions>
      </SideControl.Layout>
    </>
  );
}

export default Route;
