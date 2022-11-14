import type { Pred } from "ramda";
import type { ReactNode } from "react";
import { deepForEach } from "react-children-utilities";

export function deepFilter(fn: Pred<[ReactNode]>, children: ReactNode) {
  const result: ReactNode[] = [];
  deepForEach(children, (child: ReactNode) => fn(child) && result.push(child));
  return result;
}
