import Error from "~/components/Error";

function Page() {
  return (
    <Error.Layout>
      <Error.Visual src={require("~/assets/images/wrong.png")} />

      <Error.Content>
        <h1 className="title-1 text-primary">您的檔案無法上傳</h1>

        <p className="mt-2">
          請重新上傳檔案。確認檔案大小在10Mb以內，檔案格式為PDF、IMG。
          若還是無法上傳檔案，請聯繫
          <a className="underline" href="mailto:123456@gmail.com">
            123456@gmail.com
          </a>
        </p>
      </Error.Content>

      <Error.Footer>
        <a href="/" className="btn theme-primary block py-3 font-bold">
          回首頁
        </a>
      </Error.Footer>
    </Error.Layout>
  );
}

export default Page;
