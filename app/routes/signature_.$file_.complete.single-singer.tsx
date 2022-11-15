import Error from "~/components/Error";

function Page() {
  return (
    <Error.Layout>
      <Error.Visual src={require("~/assets/images/sending-signer.png")} />

      <Error.Content>
        <h1 className="title-1 text-primary">檔案已送出簽署</h1>

        <div>
          <p className="mt-2">當所有人完成簽署時，將會寄送通知至您的信箱。</p>
          <a className="underline" href="mailto:123456@gmail.com">
            im-elvis@gmail.com
          </a>
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
