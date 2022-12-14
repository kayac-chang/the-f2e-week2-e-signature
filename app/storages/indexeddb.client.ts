import { openDB } from "idb";
import type { DBSchema } from "idb";

export interface File {
  id?: number;
  name: string;
  original?: ArrayBuffer;
  buffer: ArrayBuffer;
}

export interface Schema extends DBSchema {
  files: {
    key: number;
    value: File;
  };
  signatures: {
    key: number;
    value: {
      id?: number;
      buffer: ArrayBuffer;
    };
  };
}

async function getDatabase() {
  if (!("indexedDB" in window)) {
    throw new Error("This browser doesn't support IndexedDB.");
  }

  const name = "the-f2e-week2-e-signature-db";
  const version = 1;

  return openDB<Schema>(name, version, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("files")) {
        db.createObjectStore("files", {
          keyPath: "id",
          autoIncrement: true,
        });
      }

      if (!db.objectStoreNames.contains("signatures")) {
        db.createObjectStore("signatures", {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    },
  });
}

export default getDatabase;
