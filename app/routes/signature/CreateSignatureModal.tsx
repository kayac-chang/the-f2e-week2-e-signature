import clsx from "clsx";
import * as Tabs from "@radix-ui/react-tabs";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Form } from "@remix-run/react";

import CreateSign from "~/routes/signature/CreateSign";

function CreateSignatureModal() {
  return (
    <Tabs.Root defaultValue="typing">
      {/* tabs */}
      <Tabs.List>
        <Tabs.Trigger value="typing">輸入</Tabs.Trigger>
        <Tabs.Trigger value="write">手寫</Tabs.Trigger>
        <Tabs.Trigger value="upload">上傳</Tabs.Trigger>
      </Tabs.List>

      {/* typing */}
      <Tabs.Content value="typing">
        <CreateSign>
          <CreateSign.Header>
            {/* choose font family */}
            <div data-radio-button>
              <input
                id="noto-sans-tc"
                type="radio"
                name="font-family"
                defaultChecked
              />
              <label htmlFor="noto-sans-tc">思源黑體</label>
            </div>

            <div data-radio-button>
              <input id="noto-serif-tc" type="radio" name="font-family" />
              <label htmlFor="noto-serif-tc" className="font-noto-serif-tc">
                思源宋體
              </label>
            </div>
          </CreateSign.Header>

          <CreateSign.Content>
            {/* typing */}
            <input
              type="text"
              placeholder="請在這裡輸入您的簽名"
              maxLength={50}
              className={clsx(
                "border-none focus:ring-0",
                "absolute inset-0",
                "text-center placeholder:my-auto placeholder:text-base",
                "text-5xl"
              )}
            />

            {/* pick color */}
            <div className="absolute bottom-0 right-0 m-2 flex gap-2">
              <input
                data-color-pick="black"
                type="radio"
                name="color"
                defaultChecked
              />

              <input data-color-pick="blue" type="radio" name="color" />

              <input data-color-pick="red" type="radio" name="color" />
            </div>
          </CreateSign.Content>
        </CreateSign>
      </Tabs.Content>

      {/* write */}
      <Tabs.Content value="write">
        <CreateSign>
          <CreateSign.Header>
            <button type="button" data-btn className="ml-auto p-2 text-primary">
              回上一步
            </button>
            <button type="button" data-btn className="p-2 text-primary">
              清除
            </button>
          </CreateSign.Header>

          <CreateSign.Content>
            {/* write */}
            <canvas className="s-full" />

            {/* pick color */}
            <div className="absolute bottom-0 right-0 m-2 flex gap-2">
              <input
                data-color-pick="black"
                type="radio"
                name="color"
                defaultChecked
              />

              <input data-color-pick="blue" type="radio" name="color" />

              <input data-color-pick="red" type="radio" name="color" />
            </div>
          </CreateSign.Content>
        </CreateSign>
      </Tabs.Content>

      {/* upload */}
      <Tabs.Content value="upload">
        <Form>
          <CreateSign>
            <CreateSign.Header>
              <button
                type="button"
                data-btn
                className="ml-auto p-2 text-primary"
              >
                更改
              </button>
              <button type="button" data-btn className="p-2 text-primary">
                清除
              </button>
            </CreateSign.Header>

            <CreateSign.Content className="flex-center flex-col gap-2 text-center">
              {/* upload */}
              <input id="upload" type="file" hidden />
              <label
                htmlFor="upload"
                data-btn
                className="inline-block border py-2 px-4"
              >
                上傳檔案
              </label>

              <p className="text-primary">
                檔案大小10 MB以內，檔案格式jpg, pmg, bmp
              </p>

              <AlertDialog.Root>
                <AlertDialog.Content className="fixed w-full max-w-lg rounded bg-white p-6 shadow">
                  <AlertDialog.Title className="text-lg font-bold text-negative">
                    上傳失敗
                  </AlertDialog.Title>

                  <div className="mt-6 flex flex-col gap-2">
                    <p>您的檔案過大</p>

                    <p>請確認檔案大小最大為10MB，並以jpg, png, bmp格式上傳</p>
                  </div>

                  <AlertDialog.Action asChild>
                    <button data-btn className="theme-primary mt-6 px-8 py-2">
                      確認
                    </button>
                  </AlertDialog.Action>
                </AlertDialog.Content>
              </AlertDialog.Root>
            </CreateSign.Content>
          </CreateSign>
        </Form>
      </Tabs.Content>
    </Tabs.Root>
  );
}
export default CreateSignatureModal;
