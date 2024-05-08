import "react-native";
import { type ImageStyle, type TextStyle, type ViewStyle } from "react-native";

module "react-native" {
  export * from "react-native";

  export namespace StyleSheet {
    type AddDark<T> = T & { $dark?: T };
    type NamedStylesWithDark<T> = {
      [P in keyof T]:
        | AddDark<ViewStyle>
        | AddDark<TextStyle>
        | AddDark<ImageStyle>;
    };

    /**
     * Create a stylesheet with dark-mode support via $dark property on style objects.
     */
    export function create<
      T extends NamedStylesWithDark<T> | NamedStylesWithDark<any>,
    >(styles: T & NamedStylesWithDark<any>): T;
  }
}
