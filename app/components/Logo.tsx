import SVG from "~/components/SVG";

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <SVG className="h-10 w-10" src={require("~/assets/icons/logo.svg")} />
      <div className="flex flex-col">
        <strong className="text-sm tracking-[0.1em]">快點簽</strong>
        <small className="text-xs text-dark-grey">Fast-Sign</small>
      </div>
    </div>
  );
}
export default Logo;
