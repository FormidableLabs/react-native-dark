import "react-native";

module "react-native" {
  export * from "react-native";

  export namespace StyleSheet {
    type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

    type AddDark<T> = T & { $dark?: T };

    type DarkStyles<T> = {
      [P in keyof T]:
        | AddDark<ViewStyle>
        | AddDark<TextStyle>
        | AddDark<ImageStyle>;
    };

    export function create<T extends DarkStyles<T> | DarkStyles<any>>(
      styles: T | DarkStyles<T>,
    ): {
      [Key in keyof T]: T[Key] extends infer Base & { $dark: infer Dark }
        ? Expand<Omit<Base, keyof Base & "$dark"> & Dark>
        : T[Key];
    };
  }
}
