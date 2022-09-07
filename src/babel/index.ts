import type { ConfigAPI, PluginObj } from "@babel/core";

export default function (api: ConfigAPI): PluginObj {
  return {
    visitor: {
      Program(path) {
        path.traverse({
          ImportDeclaration(importPath) {
            if (importPath.node.source.value === "react-native-dark") {
              console.log("IMPORTED DARK");
            }
          },
        });
      },

      ImportDeclaration(path) {},
    },
  };
}
