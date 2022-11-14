function Page() {
  return (
    <main className="grid h-screen place-content-center bg-primary-selected/20 p-6">
      <div className="m-auto grid max-w-screen-md lg:grid-cols-2">
        <div className="my-16">
          <img
            src={require("~/assets/images/wrong.png")}
            role="presentation"
            alt="presentation"
          />
        </div>

        <div className="flex flex-col justify-center">
          <h1 className="title-1 text-primary">您的檔案無法上傳</h1>

          <p className="mt-2">
            請重新上傳檔案。確認檔案大小在10Mb以內，檔案格式為PDF、IMG。
            若還是無法上傳檔案，請聯繫
            <a className="underline" href="mailto:123456@gmail.com">
              123456@gmail.com
            </a>
          </p>

          <div className="mt-12">
            <a href="/" className="btn theme-primary block py-3 font-bold">
              回首頁
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Page;
