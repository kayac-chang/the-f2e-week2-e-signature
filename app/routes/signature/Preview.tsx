import { useAsync } from "react-use";
import invariant from "tiny-invariant";

import getDatabase from "~/storages/indexeddb.client";
import { getAllPagesFromDocument, toDocument } from "~/utils/pdf.client";
import useCallbackRef from "~/hooks/useCallbackRef";

import { RenderingCancelledException } from "pdfjs-dist";
import type { PDFPageProxy, RenderTask } from "pdfjs-dist";

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
export default Preview;
