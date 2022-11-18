import * as Tabs from "@radix-ui/react-tabs";

function InviteSignerModal() {
  return (
    <Tabs.Root defaultValue="invite">
      {/* tabs */}
      <Tabs.List>
        <Tabs.Trigger value="invite">邀請簽署人</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="invite">
        <div>
          <label htmlFor="email">簽署人信箱</label>
          <input
            id="email"
            type="email"
            placeholder="請輸入電子郵件"
            className="mt-2"
            required
          />
        </div>

        <div className="mt-8 grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="last-name">姓氏</label>
            <input
              id="last-name"
              type="text"
              placeholder="簽署人的姓氏"
              className="mt-2"
              required
            />
          </div>

          <div>
            <label htmlFor="last-name">名字</label>
            <input
              id="last-name"
              type="text"
              placeholder="簽署人的名字"
              className="mt-2"
            />
          </div>
        </div>

        <div className="mt-10 text-center">
          <button data-btn disabled className="px-8 py-2">
            儲存
          </button>
        </div>
      </Tabs.Content>
    </Tabs.Root>
  );
}
export default InviteSignerModal;
