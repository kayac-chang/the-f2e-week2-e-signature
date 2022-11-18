import * as Switch from "@radix-ui/react-switch";

type ToggleProps = Switch.SwitchProps & {
  labelOn: string;
  labelOff: string;
};
function Toggle({ labelOn, labelOff, ...props }: ToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <small className="text-dark">{labelOn}</small>

      <Switch.Root {...props}>
        <Switch.Thumb />
      </Switch.Root>

      <small className="text-dark">{labelOff}</small>
    </div>
  );
}

export default Toggle;
