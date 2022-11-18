type Execute = (reader: FileReader) => void;
function readBlob<T extends FileReader["result"]>(exec: Execute) {
  return new Promise<T>((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("loadend", () => resolve(reader.result as T));
    reader.addEventListener("error", reject);
    exec(reader);
  });
}

export async function blobToArrayBuffer(blob: Blob) {
  return readBlob<ArrayBuffer>((reader) => reader.readAsArrayBuffer(blob));
}

export function arrayBufferToBlob(buffer: ArrayBuffer, type: string) {
  return new Blob([buffer], { type });
}

export function arrayBufferToFile(
  buffer: ArrayBuffer,
  type: string,
  name: string
) {
  return new File([arrayBufferToBlob(buffer, type)], name, { type });
}

export function canvasToArrayBuffer(canvas: HTMLCanvasElement) {
  return new Promise<ArrayBuffer>((resolve, reject) =>
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error(`canvas to blob failed`));
      return resolve(blobToArrayBuffer(blob));
    })
  );
}

export function arrayBufferToImageSrc(buffer: ArrayBuffer, type: string) {
  return URL.createObjectURL(arrayBufferToBlob(buffer, type));
}
