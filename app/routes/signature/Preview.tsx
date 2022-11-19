import { useAsync } from "react-use";
import invariant from "tiny-invariant";

import getDatabase from "~/storages/indexeddb.client";
import { getAllPagesFromDocument, toDocument } from "~/utils/pdf.client";
import type { PDFPageProxy } from "pdfjs-dist";
import Konva from "konva";
import useCallbackRef from "~/hooks/useCallbackRef";
import { DragEvent, useRef } from "react";

async function toImage(url: string) {
  return new Promise<Konva.Image>((resolve) => {
    Konva.Image.fromURL(url, (image: Konva.Image) => resolve(image));
  });
}

function pdfToImageSource(scale: number) {
  const canvas = document.createElement("canvas");
  const canvasContext = canvas.getContext("2d");
  invariant(canvasContext);

  return async (page: PDFPageProxy) => {
    const viewport = page.getViewport({ scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const task = page.render({
      canvasContext,
      viewport,
    });
    return task.promise.then(() => canvas.toDataURL());
  };
}

type StageProps = {
  page: PDFPageProxy;
};
function Stage(props: StageProps) {
  const stageRef = useRef<Konva.Stage | null>(null);
  const layerRef = useRef<Konva.Layer | null>(null);

  const render = useCallbackRef(
    (container: HTMLDivElement | null) => {
      function update() {
        if (!container) return;

        const page = props.page;
        const scale =
          container.clientWidth / page.getViewport({ scale: 1.0 }).width;

        Promise.resolve(page)
          .then(pdfToImageSource(scale))
          .then(toImage)
          .then((image) => {
            const layer = new Konva.Layer();
            layer.add(image);
            layerRef.current = layer;

            const stage = new Konva.Stage({
              container,
              width: image.width(),
              height: image.height(),
            });
            stage.add(layer);
            stageRef.current = stage;
          });
      }

      update();
      window.addEventListener("resize", update);
      return () => window.removeEventListener("resize", update);
    },
    [props.page]
  );

  function onDrop(_event: DragEvent) {
    const event = _event.nativeEvent;
    const raw_signature = event.dataTransfer?.getData("signature");
    const layer = layerRef.current;
    if (!raw_signature || !layer) return;

    const signature = JSON.parse(raw_signature) as {
      start_position: { x: number; y: number };
      src: string;
    };

    toImage(signature.src).then((image) => {
      const scale = 400 / image.width();
      image.size({
        width: 400,
        height: image.height() * scale,
      });
      image.position({
        x: event.offsetX - signature.start_position.x,
        y: event.offsetY - signature.start_position.y,
      });
      layer.add(image);
    });
  }

  return (
    <div
      className="w-full"
      ref={render}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    />
  );
}

type PreviewProps = {
  id: number;
};
function Preview(props: PreviewProps) {
  const state = useAsync<() => Promise<PDFPageProxy[]>>(() =>
    getDatabase()
      .then((db) => db.transaction("files", "readonly").store.get(props.id))
      .then((file) => {
        invariant(file);
        return file.buffer;
      })
      .then(toDocument)
      .then(getAllPagesFromDocument)
  );

  const list = state.value?.map((page) => (
    <Stage key={page.pageNumber} page={page} />
  ));
  return <>{list}</>;
}
export default Preview;
