import Error from "~/components/Error";

function Page() {
  return (
    <Error.Layout>
      <Error.Visual src={require("~/assets/images/shared-goals.png")} />

      <Error.Content>
        <h1 className="title-1 text-primary">恭喜您! 檔案已就緒</h1>

        <div>
          <p className="mt-2">所有人都已完成簽署，您的檔案已可以下載！</p>
        </div>
      </Error.Content>

      <Error.Footer>
        <a href="/" className="btn theme-primary block py-3 font-bold">
          下載檔案
        </a>

        <a href="/" className="btn block py-3 font-bold text-primary">
          註冊
        </a>
      </Error.Footer>
    </Error.Layout>
  );
}
export default Page;
