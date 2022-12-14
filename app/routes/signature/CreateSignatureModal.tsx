import clsx from "clsx";
import Konva from "konva";
import { append } from "ramda";
import invariant from "tiny-invariant";
import { useRef, useState } from "react";
import { assert } from "@sindresorhus/is";
import { useEffectOnce } from "react-use";
import { Form } from "@remix-run/react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { blobToArrayBuffer } from "~/utils/blob";
import type { KonvaEventObject } from "konva/lib/Node";
import type { ChangeEvent, FormEvent } from "react";

const color = {
  "text-dark": "#323338",
  "text-general": "#0073EA",
  "text-negative": "#D83A52",
} as const;

type Color = keyof typeof color;
function PickColor() {
  return (
    <div className="absolute bottom-0 right-0 m-2 flex gap-2">
      <input
        data-color-pick
        type="radio"
        name="color"
        value="text-dark"
        defaultChecked
      />
      <input data-color-pick type="radio" name="color" value="text-general" />
      <input data-color-pick type="radio" name="color" value="text-negative" />
    </div>
  );
}

type onSubmitArrayBuffer = (buffer: ArrayBuffer) => void;
type WriteProps = {
  onSubmit: onSubmitArrayBuffer;
};
export function Write(props: WriteProps) {
  const [history, setHistory] = useState<Konva.Line[]>([]);
  const colorRef = useRef<Color>("text-dark");
  const stageRef = useRef<Konva.Stage | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffectOnce(() => {
    if (!ref.current) return;

    const container = ref.current;
    const stage = new Konva.Stage({
      container,
      width: container.clientWidth,
      height: container.clientHeight,
    });
    stageRef.current = stage;

    const layer = new Konva.Layer();
    stage.add(layer);

    let line: Konva.Line | undefined = undefined;

    function pointerdown() {
      const pos = stage.getPointerPosition();
      if (!pos) return;

      line = new Konva.Line({
        stroke: color[colorRef.current],
        strokeWidth: 5,
        globalCompositeOperation: "source-over",
        lineCap: "round",
        lineJoin: "round",
        points: [pos.x, pos.y, pos.x, pos.y],
      });
      layer.add(line);
    }

    function pointerup() {
      line && setHistory(append(line));
      line = undefined;
    }
    function pointermove(e: KonvaEventObject<MouseEvent | TouchEvent>) {
      e.evt.preventDefault();

      const pos = stage.getPointerPosition();
      if (!pos || !line) return;
      const newPoints = line.points().concat([pos.x, pos.y]);
      line.points(newPoints);
    }

    stage.on("mousedown touchstart", pointerdown);
    stage.on("mouseup touchend mouseleave touchcancel", pointerup);
    stage.on("mousemove touchmove", pointermove);
    return () => {
      stage.off("mousedown touchstart", pointerdown);
      stage.off("mouseup touchend mouseleave touchcancel", pointerup);
      stage.off("mousemove touchmove", pointermove);
    };
  });

  function undo() {
    history.at(-1)?.destroy();
    setHistory(history.slice(0, -1));
  }

  function clear() {
    history.forEach((obj) => obj.destroy());
    setHistory([]);
  }

  function onChange(event: ChangeEvent<HTMLFormElement>) {
    const formdata = new FormData(event.currentTarget);
    colorRef.current = formdata.get("color") as Color;
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    invariant(stageRef.current);

    stageRef.current
      .toBlob()
      .then((blob) => {
        assert.blob(blob);
        return blobToArrayBuffer(blob);
      })
      .then(props.onSubmit);
  }

  return (
    <Form onSubmit={onSubmit} onChangeCapture={onChange}>
      <div className="flex flex-col">
        {/* header */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            data-btn
            className="ml-auto p-2 text-primary"
            onClick={undo}
          >
            ????????????
          </button>
          <button
            type="button"
            data-btn
            className="p-2 text-primary"
            onClick={clear}
          >
            ??????
          </button>
        </div>

        {/* content */}
        <div className="flex-center relative mt-2 flex rounded border">
          {/* write */}
          <div className="aspect-[3/1] w-full" ref={ref} />

          {/* pick color */}
          <PickColor />
        </div>

        {/* terms of use */}
        <p className="mt-4 text-center text-dark-grey">
          ???????????????????????????????????????????????????
        </p>

        {/* save */}
        <button
          type="submit"
          data-btn="solid-primary"
          className="mx-auto mt-2 py-2 px-8"
          disabled={!history.length}
        >
          ??????
        </button>
      </div>
    </Form>
  );
}

type UploadProps = {
  onSubmit: onSubmitArrayBuffer;
};
export function Upload(props: UploadProps) {
  const [file, setFile] = useState<File>();
  const [error, setError] = useState<Error>();

  function onFile(files: FileList) {
    const file = files[0];

    const MB = 1024 * 1024;
    const LIMIT = 10 * MB;
    if (file.size >= LIMIT) {
      return setError(new Error(`upload file size large than ${LIMIT}`));
    }
    return setFile(file);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    return file && blobToArrayBuffer(file).then(props.onSubmit);
  }

  async function render(container: HTMLDivElement | null) {
    if (!container) return;
    if (!file) return;

    const stage = new Konva.Stage({
      container,
      width: container.clientWidth,
      height: container.clientHeight,
    });

    const layer = new Konva.Layer();
    stage.add(layer);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    const url = await new Promise<string>((resolve) => {
      reader.addEventListener("load", () => {
        resolve(reader.result as string);
      });
    });

    const image = new Image();
    image.src = url;
    layer.add(new Konva.Image({ image }));
  }

  return (
    <Form onSubmit={onSubmit}>
      <div className="relative flex flex-col">
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            data-btn
            className="p-2 text-primary"
            onClick={(e) => {
              const input = e.currentTarget.closest("form")
                ?.file as HTMLInputElement;
              input.click();
            }}
          >
            ??????
          </button>
          <button
            type="button"
            data-btn
            className="p-2 text-primary"
            onClick={() => setFile(undefined)}
          >
            ??????
          </button>
        </div>

        <div className="mt-2 aspect-[3/1] border text-center">
          {/* upload */}
          <div
            className={clsx(
              "flex-center flex-col gap-2 s-full",
              file ? "hidden" : "flex"
            )}
          >
            <input
              id="upload"
              name="file"
              type="file"
              accept="image/pdf"
              onChange={(e) =>
                e.currentTarget.files && onFile(e.currentTarget.files)
              }
              hidden
            />
            <label
              htmlFor="upload"
              data-btn
              className="inline-block border py-2 px-4"
            >
              ????????????
            </label>

            <p className="text-primary">????????????10 MB????????????????????? png</p>
          </div>

          <div
            className={clsx("s-full", file ? "block" : "hidden")}
            ref={render}
          />

          {error && (
            <AlertDialog.Root open>
              <AlertDialog.Content className="position-center absolute w-full max-w-lg rounded bg-white p-6 shadow">
                <AlertDialog.Title className="text-lg font-bold text-negative">
                  ????????????
                </AlertDialog.Title>

                <div className="mt-6 flex flex-col gap-2">
                  <p>??????????????????</p>

                  <p>??????????????????????????????10MB?????????jpg, png, bmp????????????</p>
                </div>

                <AlertDialog.Action asChild>
                  <button
                    data-btn="solid-primary"
                    className="mt-6 px-8 py-2"
                    onClick={() => setError(undefined)}
                  >
                    ??????
                  </button>
                </AlertDialog.Action>
              </AlertDialog.Content>
            </AlertDialog.Root>
          )}
        </div>

        {/* terms of use */}
        <p className="mt-4 text-center text-dark-grey">
          ???????????????????????????????????????????????????
        </p>

        {/* save */}
        <button
          type="submit"
          data-btn="solid-primary"
          className="mx-auto mt-2 py-2 px-8"
          disabled={!file}
        >
          ??????
        </button>
      </div>
    </Form>
  );
}
