import clsx from "clsx";
import { Link } from "@remix-run/react";
import { Steps, Step, StepItem } from "~/components/Steps";
import SVG from "~/components/SVG";

function Signature() {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-bold">我的簽名</label>

      {/* create signature */}
      <input type="file" hidden />
      <button
        className={clsx(
          "flex items-center justify-center gap-2",
          "btn border border-grey py-3"
          //
        )}
      >
        <SVG className="w-6" src={require("~/assets/icons/plus.svg")} />
        <strong>創建簽名檔</strong>
      </button>
    </div>
  );
}

function Signer() {
  return (
    <div className="flex items-center border border-primary-selected px-3 py-2">
      <SVG className="w-5" src={require("~/assets/icons/drag-indicator.svg")} />

      {/* signer order */}
      <strong className="px-2">1</strong>

      {/* signer detail */}
      <div className="flex flex-col">
        <strong>咖哩 飯</strong>
        <small className="text-sm text-primary">123456@gmail.com</small>
      </div>

      <SVG
        className="ml-auto w-8 text-grey"
        src={require("~/assets/icons/unfold-more.svg")}
      />
    </div>
  );
}

type ToggleProps = {
  labelOn: string;
  labelOff: string;
};
function Toggle(props: ToggleProps) {
  return (
    <div className="mt-2 flex items-center gap-2">
      <small className="text-dark">{props.labelOn}</small>

      <input type="checkbox" />

      <small className="text-dark">{props.labelOff}</small>
    </div>
  );
}

function Invite() {
  return (
    <fieldset>
      <div className="flex justify-between">
        <div className="flex flex-col">
          {/* invite label */}
          <legend className="font-bold">邀請簽署人</legend>

          {/* invite sort */}
          <Toggle labelOff="無簽署順序" labelOn="排列簽署順序" />
        </div>

        {/* invite person */}
        <button className="btn aspect-square w-12 border border-grey p-3">
          <SVG src={require("~/assets/icons/person-add.svg")} />
        </button>
      </div>

      {/* invite list */}
      <ul className="mt-2 grid gap-2">
        <li>
          <Signer />
        </li>
        <li>
          <Signer />
        </li>
      </ul>

      {/* expired time */}
      <Toggle labelOff="無期限" labelOn="指定簽署期限" />
    </fieldset>
  );
}

const side_control = clsx("bg-white", "flex justify-end");
const next_step = clsx("btn block bg-ui-grey py-3 text-dark-grey");

function Route() {
  return (
    <>
      {/* header */}
      <header className="relative z-10">
        <div className="shadow">
          <div className="container flex items-center px-6 py-4 lg:py-6">
            {/* back */}
            <Link to=".." className="inline-block">
              <SVG
                src={require("~/assets/icons/arrow-back.svg")}
                className="text-dark-grey s-6"
              />
            </Link>

            {/* title */}
            <h1 className="ml-3 flex items-center gap-2 font-bold">
              <span>型號U-ew8951出貨單</span>

              {/* edit */}
              <button className="w-4">
                <SVG src={require("~/assets/icons/edit.svg")} />
              </button>
            </h1>

            {/* actions */}
            <nav className="ml-auto space-x-2">
              <a className="btn theme-primary inline-block py-2 px-8" href="/">
                註冊
              </a>
            </nav>
          </div>
        </div>

        {/* steps */}
        <div className="shadow">
          <Steps>
            <StepItem>
              <Step>1</Step>
              <p>成功上傳檔案</p>
            </StepItem>
            <StepItem>
              <Step data-state="active">2</Step>
              <p>加入簽名檔</p>
            </StepItem>
            <StepItem>
              <Step data-state="disabled">3</Step>
              <p>確認檔案</p>
            </StepItem>
            <StepItem>
              <Step data-state="disabled">4</Step>
              <p>下載檔案</p>
            </StepItem>
          </Steps>
        </div>
      </header>

      <main className="flex flex-1 flex-col 2xl:container">
        <div className="relative flex flex-1 items-center lg:static">
          <div
            className={clsx(
              "s-full",
              "lg:ml-auto lg:w-3/4",
              "bg-light-grey",
              "flex items-center justify-center",
              "p-6"
              //
            )}
          >
            {/* canvas view */}
            <canvas className="border s-full" />
          </div>

          {/* side control */}
          <div
            className={clsx(
              side_control,
              "w-[90%] max-w-lg",
              "absolute right-0 h-full",
              "flex-1 lg:static lg:w-auto"
              //
            )}
          >
            {/* side control toggle */}
            <button
              type="button"
              className="h-full w-4 bg-white shadow-md lg:hidden"
            >
              <SVG src={require("~/assets/icons/arrow-left.svg")} />
            </button>

            {/* side control menu */}
            <menu className="flex flex-1 flex-col gap-10 p-6">
              {/* signature */}
              <Signature />

              {/* invite */}
              <Invite />

              {/* call to action / lg */}
              <div className="mt-auto hidden lg:block">
                {/* next step */}
                <a href="/" className={next_step}>
                  下一步
                </a>
              </div>
            </menu>
          </div>
        </div>

        {/* call to action / sm */}
        <div className="border-t px-6 pb-6 pt-3 lg:hidden">
          {/* next step */}
          <a href="/" className={next_step}>
            下一步
          </a>
        </div>
      </main>
    </>
  );
}

export default Route;
