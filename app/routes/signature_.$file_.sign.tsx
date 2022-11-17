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
          <div className="shadow [&_[data-step]]:s-10">
            <Steps>
              <Steps.Item>
                <strong data-step="active">1</strong>
                <p>加入簽名檔</p>
              </Steps.Item>
              <Steps.Item>
                <strong data-step="disabled">2</strong>
                <p>確認檔案</p>
              </Steps.Item>
              <Steps.Item>
                <strong data-step="disabled">3</strong>
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

        <SideControl.Menu>
          <div className="flex flex-col gap-2">
            <strong>簽署發起人</strong>

            <input
              aria-label="issuer-name"
              name="issuer-name"
              type="text"
              value="王心凌"
              disabled
              readOnly
            />

            <input
              aria-label="issuer-email"
              name="issuer-email"
              type="email"
              value="babywang@gmail.com"
              disabled
              readOnly
            />
          </div>
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
