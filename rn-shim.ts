import "react-native";
import type { ImageStyle, TextStyle, ViewStyle } from "react-native";

declare module "react-native" {
  export namespace StyleSheet {
    type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

    type AddDark<T> = T & { $dark?: T };

    type DarkStyles<T> = {
      [P in keyof T]:
        | AddDark<ViewStyle>
        | AddDark<TextStyle>
        | AddDark<ImageStyle>;
    };

    /**
     * Creates a StyleSheet style reference from the given object.
     */
    export function create<T extends DarkStyles<T> | DarkStyles<any>>(
      styles: T | DarkStyles<T>,
    ): {
      [Key in keyof T]: T[Key] extends infer Base & { $dark: infer Dark }
        ? Expand<Omit<Base, keyof Base & "$dark"> & Dark>
        : T[Key];
    };

    export function foo(x: number): void;
  }
}
