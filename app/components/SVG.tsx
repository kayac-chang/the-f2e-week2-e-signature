import { identity, memoizeWith } from "ramda";
import type { ComponentProps } from "react";

const load = memoizeWith(identity, (src: string) =>
  fetch(src).then((res) => res.text())
);

type Props = ComponentProps<"div"> & {
  src: string;
};
function SVG({ src, ...props }: Props) {
  return (
    <div
      {...props}
      ref={(ref) =>
        load(src).then((html) => {
          if (ref) ref.innerHTML = html;
        })
      }
    />
  );
}
export default SVG;
