import type { Pred } from "ramda";
import type { MutableRefObject, ReactNode, RefCallback } from "react";
import { deepForEach } from "react-children-utilities";

export function deepFilter(fn: Pred<[ReactNode]>, children: ReactNode) {
  const result: ReactNode[] = [];
  deepForEach(children, (child: ReactNode) => fn(child) && result.push(child));
  return result;
}

type Ref<T> =
  | RefCallback<T>
  | MutableRefObject<T | null>
  | undefined
  | null
  | false;
export function mergeRefs<T>(...refs: Ref<T>[]) {
  return (ref: T | null) => {
    refs.forEach((inputRef) => {
      if (typeof inputRef === "function") {
        return inputRef(ref);
      }
      if (inputRef) {
        return (inputRef.current = ref);
      }
    });
  };
}
