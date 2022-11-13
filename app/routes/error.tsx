function Page() {
  return (
    <main className="p-6">
      <img
        className="my-16"
        src={require("~/assets/images/wrong.png")}
        role="presentation"
        alt="presentation"
      />

      <h1 className="title-1 text-primary">您的檔案無法上傳</h1>

      <p className="mt-2">
        請重新上傳檔案。確認檔案大小在10Mb以內，檔案格式為PDF、IMG。
        若還是無法上傳檔案，請聯繫
        <a className="underline" href="mailto:123456@gmail.com">
          123456@gmail.com
        </a>
      </p>

      <div className="mt-12">
        <a href="/" className="btn block py-3 font-bold">
          回首頁
        </a>
      </div>
    </main>
  );
}

export default Page;
