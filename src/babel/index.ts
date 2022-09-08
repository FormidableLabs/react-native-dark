import * as babel from "@babel/core";
import type { ConfigAPI, PluginObj } from "@babel/core";
// @ts-ignore
import { addNamed } from "@babel/helper-module-imports";

export default function ({ types: t }: typeof babel): PluginObj {
  return {
    visitor: {
      Program: {
        enter(programPath) {
          /**
           * Check if createStyleSheet is imported from react-native-dark,
           *  and grab its name
           */
          let createStyleSheetName: string | null = null;
          programPath.traverse({
            ImportDeclaration(importPath) {
              if (importPath.node.source.value === "react-native-dark") {
                for (let spec of importPath.node.specifiers) {
                  if (
                    t.isImportSpecifier(spec) &&
                    t.isIdentifier(spec.imported) &&
                    spec.imported.name === "createStyleSheet" &&
                    t.isIdentifier(spec.local)
                  ) {
                    createStyleSheetName = spec.local.name;
                    break;
                  }
                }
              }
            },
          });
          if (!createStyleSheetName) return;

          /**
           * Find variable name for createStyleSheet call
           * TODO: need to support multiple calls to createStyleSheet?
           */
          let styleObjectName: string | null = null;
          programPath.traverse({
            VariableDeclarator(decPath) {
              if (
                t.isIdentifier(decPath.node.id) &&
                t.isCallExpression(decPath.node.init) &&
                t.isIdentifier(decPath.node.init.callee) &&
                decPath.node.init.callee.name === createStyleSheetName
              ) {
                styleObjectName = decPath.node.id.name;
              }
            },
          });
          if (!styleObjectName) return;

          /**
           * Now, let's add in our useDynamicDarkModeStyles import
           */
          const useDynamicDarkModeStylesName = addNamed(
            programPath,
            "useDynamicDarkModeStyles",
            "react-native-dark",
          ).name as string;

          /**
           * Then let's find all functions that have JSX that access our styleObject
           */
          programPath.traverse({
            FunctionDeclaration(funcPath) {
              // Make sure we've got JSX
              let hasJsx = false;
              funcPath.traverse({
                JSXIdentifier() {
                  hasJsx = true;
                },
              });
              if (!hasJsx) return;

              let callsStyleObject = false;
              funcPath.traverse({
                MemberExpression(memPath) {
                  if (
                    t.isMemberExpression(memPath) &&
                    t.isIdentifier(memPath.node.object) &&
                    memPath.node.object.name === styleObjectName
                  ) {
                    callsStyleObject = true;
                  }
                },
              });
              if (!callsStyleObject) return;

              /**
               * Inject useDynamicDarkModeStyles into function body
               */
              if (t.isBlockStatement(funcPath.node.body)) {
                funcPath.node.body.body.unshift(
                  t.expressionStatement(
                    t.callExpression(
                      t.identifier(useDynamicDarkModeStylesName!),
                      [],
                    ),
                  ),
                );
              }
            },
          });
        },
      },
    },
  };
}
