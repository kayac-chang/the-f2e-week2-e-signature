import { openDB } from "idb";

async function getDatabase() {
  if (!("indexedDB" in window)) {
    throw new Error("This browser doesn't support IndexedDB.");
  }

  const name = "the-f2e-week2-e-signature-db";
  const version = 1;

  return openDB(name, version, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("files")) {
        db.createObjectStore("files", { keyPath: "id", autoIncrement: true });
      }
    },
  });
}

export default getDatabase;
