import clsx from "clsx";
import { useNavigate } from "@remix-run/react";
import Header from "~/components/Header";
import Logo from "~/components/Logo";
import { blobToArrayBuffer } from "~/utils/blob";
import getDatabase from "~/storages/indexeddb.client";
import dropbox from "~/utils/dropbox";

type StepProps = {
  step: number;
  title: string;
  description: string;
  image: string;
};
function StepCard(props: StepProps) {
  return (
    <div className="grid place-content-center gap-2">
      <strong data-step="outline" className="mx-auto s-10">
        {props.step}
      </strong>
      <strong>{props.title}</strong>
      <p className="text-dark-grey">{props.description}</p>
      <div className="aspect-[3/2]">
        <img src={props.image} role="presentation" alt="presentation" />
      </div>
    </div>
  );
}

function Route() {
  const navigate = useNavigate();

  async function onFile(files: FileList) {
    const file = files[0];

    const MB = 1024 * 1024;
    const LIMIT = 10 * MB;
    if (file.size >= LIMIT) {
      console.error(`upload file size large than ${LIMIT}`);
      return navigate("/error");
    }

    try {
      const [buffer, db] = await Promise.all([
        blobToArrayBuffer(file),
        getDatabase(),
      ]);
      const tx = db.transaction("files", "readwrite");
      const [id] = await Promise.all([
        tx.store.add({ name: file.name, buffer }),
        tx.done,
        //
      ]);
      console.info(`add file ${file.name} into database.`);

      return navigate(`/signature/${id}`);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      {/* header */}
      <Header>
        <Header.Content>
          {/* logo */}
          <Logo />

          {/* title */}
          <h1
            data-title="1"
            className="position-center-x absolute hidden text-center lg:block"
          >
            快速省時的電子簽署工具
          </h1>
        </Header.Content>
      </Header>

      {/* main content */}
      <main className="container flex-1 p-6 text-center">
        <div>
          {/* title */}
          <h1 data-title="1" className="lg:hidden">
            快速省時的電子簽署工具
          </h1>

          {/* file upload */}
          <input
            type="file"
            id="file-upload"
            accept="image/*,.pdf"
            hidden
            onChange={(e) => e.target.files && onFile(e.target.files)}
          />
          <div
            className={clsx(
              "mt-4",
              "grid place-content-center",
              "border border-2 border-dashed border-current",
              "bg-primary-selected text-primary",
              "h-[28rem] gap-3"
            )}
            {...dropbox({ onFile })}
          >
            <div className="mx-auto my-2 aspect-square w-20 lg:w-28">
              <img
                src={require("~/assets/images/add-file.png")}
                role="presentation"
                alt="presentation"
              />
            </div>

            <p className="hidden text-dark-grey lg:block">
              將檔案拖曳至這裡，或
            </p>
            <label
              htmlFor="file-upload"
              data-btn="solid-primary"
              className="mx-auto w-max py-3 px-10 lg:px-32"
            >
              選擇檔案
            </label>
            <strong>檔案大小10Mb以內，檔案格式為PDF、IMG</strong>
          </div>
        </div>

        {/* steps */}
        <div className="mt-12">
          {/* steps title */}
          <h2 data-title="1">輕鬆幾步驟，完成您的簽署</h2>

          {/* steps list */}
          <ul className="mt-4 grid gap-8 lg:mt-8 lg:grid-cols-3">
            <li>
              <StepCard
                step={1}
                title="上傳檔案"
                description="選擇PDF檔或是IMG檔"
                image={require("~/assets/images/file-upload@2x.png")}
              />
            </li>
            <li>
              <StepCard
                step={2}
                title="加入簽名檔"
                description="手寫、輸入或是上傳簽名檔"
                image={require("~/assets/images/signing@2x.png")}
              />
            </li>
            <li>
              <StepCard
                step={3}
                title="上傳檔案"
                description="完成簽署可立即傳送檔案給對方"
                image={require("~/assets/images/sending@2x.png")}
              />
            </li>
          </ul>
        </div>
      </main>

      {/* footer */}
      <footer className="bg-dark-grey text-white">
        <div className="container flex items-center px-6 py-5 text-sm">
          {/* copyright */}
          <p>@ 2022 The F2E 4th</p>
        </div>
      </footer>
    </>
  );
}

export default Route;
