import clsx from "clsx";
import Logo from "~/components/Logo";

type StepProps = {
  step: number;
  title: string;
  description: string;
  image: string;
};
function Step(props: StepProps) {
  return (
    <div className="grid place-content-center gap-2">
      <strong
        className={clsx(
          "h-10 w-10",
          "mx-auto grid place-content-center",
          "rounded-full border-2 border-primary",
          "text-primary"
        )}
      >
        {props.step}
      </strong>
      <strong>{props.title}</strong>
      <p className="text-dark-grey">{props.description}</p>
      <div className="aspect-[480/320]">
        <img src={props.image} role="presentation" alt="presentation" />
      </div>
    </div>
  );
}

function Route() {
  return (
    <>
      {/* header / sm */}
      <header className="shadow">
        <div className="container relative flex items-center px-6 py-4">
          {/* logo */}
          <Logo />

          {/* title */}
          <h1 className="title-1 absolute left-1/2 hidden -translate-x-1/2 text-center text-dark-grey lg:block">
            快速省時的電子簽署工具
          </h1>

          {/* actions */}
          <nav className="ml-auto space-x-2">
            <a className="btn inline-block py-2 px-8 text-primary" href="/">
              登入
            </a>
            <a className="btn theme-primary inline-block py-2 px-8" href="/">
              註冊
            </a>
          </nav>
        </div>
      </header>

      {/* main content */}
      <main className="container p-6 text-center">
        <div>
          {/* title */}
          <h1 className="title-1 text-dark-grey lg:hidden">
            快速省時的電子簽署工具
          </h1>

          {/* file upload */}
          <input type="file" id="file-upload" accept="image/*,.pdf" hidden />
          <div
            className={clsx(
              "mt-4",
              "grid place-content-center",
              "border border-2 border-dashed border-current",
              "bg-primary-selected text-primary",
              "h-[28rem] gap-3"
            )}
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
              className="btn theme-primary mx-auto w-max py-3 px-10 lg:px-32"
            >
              選擇檔案
            </label>
            <strong>檔案大小10Mb以內，檔案格式為PDF、IMG</strong>
          </div>
        </div>

        {/* steps */}
        <div className="mt-12">
          {/* steps title */}
          <h2 className="title-1">輕鬆幾步驟，完成您的簽署</h2>

          {/* steps list */}
          <ul className="mt-4 grid gap-8 lg:mt-8 lg:grid-cols-3">
            <li>
              <Step
                step={1}
                title="上傳檔案"
                description="選擇PDF檔或是IMG檔"
                image={require("~/assets/images/file-upload@2x.png")}
              />
            </li>
            <li>
              <Step
                step={2}
                title="加入簽名檔"
                description="手寫、輸入或是上傳簽名檔"
                image={require("~/assets/images/signing@2x.png")}
              />
            </li>
            <li>
              <Step
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

          {/* language */}
          <nav className="ml-auto">
            <a className="inline-block px-2" href="/">
              繁中
            </a>
            <a className="inline-block px-2" href="/">
              English
            </a>
          </nav>
        </div>
      </footer>
    </>
  );
}

export default Route;
