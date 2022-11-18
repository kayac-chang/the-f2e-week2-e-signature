import * as Tabs from "@radix-ui/react-tabs";
import { useState } from "react";
import { Form } from "@remix-run/react";
import type { FormProps } from "@remix-run/react";

function EditTitleModal(props: FormProps) {
  const [title, setTitle] = useState("");
  return (
    <Form {...props}>
      <Tabs.Root defaultValue="rename">
        {/* tabs */}
        <Tabs.List>
          <Tabs.Trigger value="rename" disabled>
            重新命名檔案
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="rename">
          {/* input */}
          <div>
            <label htmlFor="title">檔案</label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="請輸入檔案名稱"
              className="mt-2"
              value={title}
              onChange={(e) => setTitle(e.target.value.trim())}
            />
          </div>

          {/* submit */}
          <div className="mt-10 text-center">
            <button
              type="submit"
              data-btn="solid-primary"
              className="px-8 py-2"
              disabled={title.length <= 0}
            >
              儲存
            </button>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </Form>
  );
}

export default EditTitleModal;
