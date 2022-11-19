import Konva from "konva";
import { forwardRef, useRef } from "react";
import invariant from "tiny-invariant";
import type { DragEvent, Ref } from "react";
import type { PDFPageProxy } from "pdfjs-dist";
import type { KonvaEventListener } from "konva/lib/Node";

import useCallbackRef from "~/hooks/useCallbackRef";
import { mergeRefs } from "~/utils/react";

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
  onChange?: (stage: Konva.Stage) => void;
  onContextMenu?: KonvaEventListener<Konva.Stage, MouseEvent>;
};
function Stage(props: StageProps, ref: Ref<Konva.Stage>) {
  const stageRef = useRef<Konva.Stage | null>(null);
  const setStageRef = mergeRefs(stageRef, ref);

  const layerRef = useRef<Konva.Layer | null>(null);
  const transformerRef = useRef<Konva.Transformer>(
    new Konva.Transformer({
      name: "tr",
      rotateEnabled: false,
      enabledAnchors: ["top-left", "top-right", "bottom-left", "bottom-right"],
    })
  );

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
            layer.add(transformerRef.current);
            layerRef.current = layer;

            const stage = new Konva.Stage({
              container,
              width: image.width(),
              height: image.height(),
            });
            stage.add(layer);
            setStageRef(stage);

            const tr = transformerRef.current;
            stage.on("click tap", (e) => {
              // only select signature
              if (e.target.hasName("signature")) {
                return tr.nodes([e.target]);
              }

              // remove all selections
              return tr.nodes([]);
            });

            props.onContextMenu && stage.on("contextmenu", props.onContextMenu);
            stage.on("change", () => props.onChange?.(stage));
          });
      }

      update();
      window.addEventListener("resize", update);
      return () => {
        // clean up
        if (stageRef.current) {
          const stage = stageRef.current;
          stage.destroy();
          setStageRef(null);
        }

        window.removeEventListener("resize", update);
      };
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

    return toImage(signature.src)
      .then((image) => {
        const scale = 400 / image.width();
        image.size({
          width: 400,
          height: image.height() * scale,
        });
        image.position({
          x: event.offsetX - signature.start_position.x,
          y: event.offsetY - signature.start_position.y,
        });
        image.draggable(true);
        image.name("signature");
        return image;
      })
      .then((image) => {
        // side effect
        layer.add(image);
        transformerRef.current.nodes([image]);
        stageRef.current?.fire("change");
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

export default forwardRef(Stage);
