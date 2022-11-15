import clsx from "clsx";
import { Link } from "@remix-run/react";
import Steps from "~/components/Steps";
import SVG from "~/components/SVG";
import SignDrag from "~/components/SignDrag";
import Toggle from "~/components/Toggle";
import Header from "~/components/Header";
import SideControl from "~/components/SideControl";

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
    <SignDrag>
      <SignDrag.Content>
        <strong>咖哩 飯</strong>
        <small className="text-sm text-primary">123456@gmail.com</small>
      </SignDrag.Content>

      <SignDrag.Menu>
        <SVG src={require("~/assets/icons/unfold-more.svg")} />
      </SignDrag.Menu>
    </SignDrag>
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

function Route() {
  return (
    <>
      {/* header */}
      <Header>
        <Header.Content>
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
        </Header.Content>

        <Header.Actions>
          <a className="btn theme-primary inline-block py-2 px-8" href="/">
            註冊
          </a>
        </Header.Actions>

        <Header.Sub>
          {/* steps */}
          <div className="shadow">
            <Steps>
              <Steps.Item>
                <Steps.Step>1</Steps.Step>
                <p>成功上傳檔案</p>
              </Steps.Item>
              <Steps.Item>
                <Steps.Step data-state="active">2</Steps.Step>
                <p>加入簽名檔</p>
              </Steps.Item>
              <Steps.Item>
                <Steps.Step data-state="disabled">3</Steps.Step>
                <p>確認檔案</p>
              </Steps.Item>
              <Steps.Item>
                <Steps.Step data-state="disabled">4</Steps.Step>
                <p>下載檔案</p>
              </Steps.Item>
            </Steps>
          </div>
        </Header.Sub>
      </Header>

      <SideControl.Layout>
        <SideControl.Content>
          {/* canvas view */}
          <canvas className="border s-full" />
        </SideControl.Content>

        <SideControl.Menu>
          {/* signature */}
          <Signature />

          {/* invite */}
          <Invite />
        </SideControl.Menu>

        <SideControl.Actions>
          {/* next step */}
          <a href="/" className="btn block bg-ui-grey py-3 text-dark-grey">
            下一步
          </a>
        </SideControl.Actions>
      </SideControl.Layout>
    </>
  );
}

export default Route;
