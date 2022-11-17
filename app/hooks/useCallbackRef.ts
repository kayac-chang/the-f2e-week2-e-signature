import { useRef, useCallback } from "react";
import type { DependencyList } from "react";

interface CleanUp {
  (): void;
}
interface RefCallback<T> {
  (instance: T): CleanUp | void;
}

function useCallbackRef<T>(rawCallback: RefCallback<T>, deps: DependencyList) {
  const cleanupRef = useRef<CleanUp | undefined>(undefined);

  const callback = useCallback((node: T | null) => {
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = undefined;
    }

    if (node) {
      const cleanup = rawCallback(node);
      if (cleanup) cleanupRef.current = cleanup;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return callback;
}
export default useCallbackRef;
