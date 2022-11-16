import type { ComponentProps, ElementType } from "react";

export type ElementProps<E extends ElementType = ElementType, P = {}> = Omit<
  ComponentProps<E>,
  keyof P
> &
  P;

export type EP<E extends ElementType = ElementType, P = {}> = ElementProps<
  E,
  P
>;

type As<E extends ElementType = ElementType> = {
  as?: E;
};

export type PolymorphicComponentProps<
  E extends ElementType,
  P extends {}
> = As<E> & ElementProps<E, P>;

export type PCP<
  E extends ElementType,
  P extends {}
> = PolymorphicComponentProps<E, P>;
