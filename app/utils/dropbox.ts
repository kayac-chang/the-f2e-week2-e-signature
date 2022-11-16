import type { ComponentProps, DragEvent, SyntheticEvent } from "react";

function prevent(event: SyntheticEvent) {
  event.preventDefault();
  event.stopPropagation();
}

type Props = {
  onFile: (files: FileList) => void;
};
function dropbox(props: Props): ComponentProps<"div"> {
  function onDragEnter(event: DragEvent) {
    prevent(event);
  }

  function onDragOver(event: DragEvent) {
    prevent(event);
  }

  function onDrop(event: DragEvent) {
    prevent(event);

    const dt = event.dataTransfer;
    const files = dt.files;

    props.onFile(files);
  }

  return { onDragEnter, onDragOver, onDrop };
}

export default dropbox;
