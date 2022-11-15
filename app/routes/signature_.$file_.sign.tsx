import Header from "~/components/Header";
import SideControl from "~/components/SideControl";
import Steps from "~/components/Steps";

function Route() {
  return (
    <>
      {/* header */}
      <Header>
        <Header.Content>
          {/* title */}
          <h1 className="ml-3 flex items-center gap-2 font-bold">
            <span>型號U-ew8951出貨單</span>
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
                <Steps.Step data-state="active">1</Steps.Step>
                <p>加入簽名檔</p>
              </Steps.Item>
              <Steps.Item>
                <Steps.Step data-state="disabled">2</Steps.Step>
                <p>確認檔案</p>
              </Steps.Item>
              <Steps.Item>
                <Steps.Step data-state="disabled">3</Steps.Step>
                <p>傳送簽署檔案</p>
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
