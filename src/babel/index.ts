import * as babel from "@babel/core";
import type { ConfigAPI, PluginObj, NodePath } from "@babel/core";
// @ts-ignore
import { addNamed } from "@babel/helper-module-imports";
import { ObjectProperty } from "@babel/types";

/**
 * We want to transform:
 *  const styles = StyleSheet.create({foo: {$dark: {}}})
 * into
 *  const styles = StyleSheet.create({ foo: {}, __foo__$dark: {} })
 * by extracting out the dark styles.
 *
 * Then we want to compose base/dark styles by creating a variable like:
 *  const __styles__foo__$dark = StyleSheet.compose(styles.foo, styles.__foo__$dark);
 *
 * Then we want to find functions that reference this styles.foo (etc) property and:
 *  - inject a const __isDark = useIsDark(); into the top
 *  - replace styles.foo with (!__isDark ? styles.foo : __styles__foo__$dark)
 *
 * This should translate, roughly, into the following steps:
 * 1. Check if StyleSheet is imported from RN and StyleSheet.create is called with one $dark member.
 * 2.
 */

export default function ({ types: t }: typeof babel): PluginObj {
  return {
    visitor: {
      Program: {
        enter(programPath) {
          /**
           * Step 1: Check if `StyleSheet` is imported from React Native and `StyleSheet.create` is called with a $dark
           */
          let StyleSheetName: string | null = null;
          programPath.traverse({
            ImportDeclaration(importPath) {
              if (importPath.node.source.value === "react-native") {
                for (let spec of importPath.node.specifiers) {
                  if (
                    t.isImportSpecifier(spec) &&
                    t.isIdentifier(spec.imported) &&
                    spec.imported.name === "StyleSheet" &&
                    t.isIdentifier(spec.local)
                  ) {
                    StyleSheetName = spec.local.name;
                  }
                }
              }
            },
          });
          if (!StyleSheetName) return;

          /**
           * Step 2: Check if StyleSheet.create is called
           */
          programPath.traverse({
            CallExpression(callPath) {
              if (
                t.isMemberExpression(callPath.node.callee) &&
                t.isIdentifier(callPath.node.callee.object) &&
                callPath.node.callee.object.name === StyleSheetName &&
                t.isIdentifier(callPath.node.callee.property) &&
                callPath.node.callee.property.name === "create"
              ) {
                // At this point, callPath.node.callee is a MemberExpression. Grab argument, which is arg to StyleSheet.create
                const arg = callPath.node.arguments[0];
                if (!arg || !t.isObjectExpression(arg)) return;

                // Loop through properties of the StyleSheet.create argument object
                // Check for ones that have a nested $dark property
                const nodesToInsert = [] as ObjectProperty[];
                for (const i in arg.properties) {
                  const property = arg.properties[i];
                  if (!t.isProperty(property)) continue;
                  if (!t.isIdentifier(property.key)) continue;
                  if (!t.isObjectExpression(property.value)) continue;

                  // Loop through fields of the style object (like fields of styles.container), look for $dark

                  for (const j in property.value.properties) {
                    const decProp = property.value.properties[j];
                    if (!t.isProperty(decProp)) continue;
                    if (
                      t.isIdentifier(decProp.key) &&
                      decProp.key.name === "$dark"
                    ) {
                      // Extract path to $dark sub property
                      const $darkPath = callPath.get(
                        `arguments.0.properties.${i}.value.properties.${j}`,
                      ) as NodePath;

                      const clonedNode = t.cloneDeepWithoutLoc(
                        // @ts-ignore
                        $darkPath.node,
                      ) as ObjectProperty;
                      if (t.isIdentifier(clonedNode.key))
                        clonedNode.key.name = `__${property.key.name}__$dark`;

                      nodesToInsert.push(clonedNode);
                      $darkPath.remove();
                    }
                  }
                }
                nodesToInsert.forEach((node) => {
                  // @ts-ignore
                  callPath.node.arguments[0].properties.push(node);
                });
              }
            },
          });
        },
      },
    },
  };
}

// export default function ({ types: t }: typeof babel): PluginObj {
//   return {
//     visitor: {
//       Program: {
//         enter(programPath) {
//           /**
//            * Check if createStyleSheet is imported from react-native-dark,
//            *  and grab its name
//            */
//           let createStyleSheetName: string | null = null;
//           programPath.traverse({
//             ImportDeclaration(importPath) {
//               if (importPath.node.source.value === "react-native-dark") {
//                 for (let spec of importPath.node.specifiers) {
//                   if (
//                     t.isImportSpecifier(spec) &&
//                     t.isIdentifier(spec.imported) &&
//                     spec.imported.name === "createStyleSheet" &&
//                     t.isIdentifier(spec.local)
//                   ) {
//                     createStyleSheetName = spec.local.name;
//                     break;
//                   }
//                 }
//               }
//             },
//           });
//           if (!createStyleSheetName) return;
//
//           /**
//            * Find variable name for createStyleSheet call
//            * TODO: need to support multiple calls to createStyleSheet?
//            */
//           let styleObjectName: string | null = null;
//           programPath.traverse({
//             VariableDeclarator(decPath) {
//               if (
//                 t.isIdentifier(decPath.node.id) &&
//                 t.isCallExpression(decPath.node.init) &&
//                 t.isIdentifier(decPath.node.init.callee) &&
//                 decPath.node.init.callee.name === createStyleSheetName
//               ) {
//                 styleObjectName = decPath.node.id.name;
//               }
//             },
//           });
//           if (!styleObjectName) return;
//
//           /**
//            * Now, let's add in our useDynamicDarkModeStyles import
//            */
//           const useDynamicDarkModeStylesName = addNamed(
//             programPath,
//             "useDynamicDarkModeStyles",
//             "react-native-dark",
//           ).name as string;
//
//           /**
//            * Then let's find all functions that have JSX that access our styleObject
//            */
//           programPath.traverse({
//             FunctionDeclaration(funcPath) {
//               // Make sure we've got JSX
//               let hasJsx = false;
//               funcPath.traverse({
//                 JSXIdentifier() {
//                   hasJsx = true;
//                 },
//               });
//               if (!hasJsx) return;
//
//               let callsStyleObject = false;
//               funcPath.traverse({
//                 MemberExpression(memPath) {
//                   if (
//                     t.isMemberExpression(memPath) &&
//                     t.isIdentifier(memPath.node.object) &&
//                     memPath.node.object.name === styleObjectName
//                   ) {
//                     callsStyleObject = true;
//                   }
//                 },
//               });
//               if (!callsStyleObject) return;
//
//               /**
//                * Inject useDynamicDarkModeStyles into function body
//                */
//               if (t.isBlockStatement(funcPath.node.body)) {
//                 funcPath.node.body.body.unshift(
//                   t.expressionStatement(
//                     t.callExpression(
//                       t.identifier(useDynamicDarkModeStylesName!),
//                       [],
//                     ),
//                   ),
//                 );
//               }
//             },
//           });
//         },
//       },
//     },
//   };
// }
