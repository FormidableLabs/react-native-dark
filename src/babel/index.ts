import * as babel from "@babel/core";
import type { ConfigAPI, PluginObj, NodePath } from "@babel/core";
// @ts-ignore
import { addNamed } from "@babel/helper-module-imports";
import {
  ArrowFunctionExpression,
  BlockStatement,
  FunctionDeclaration,
  FunctionExpression,
  Identifier,
  MemberExpression,
  ObjectProperty,
} from "@babel/types";

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
           * Step 2: Check for a const [styles] = StyleSheet.create({ [property]: { $dark: {} } }); call, and rearrange accordingly
           */
          // { styles: ['container', 'title'], ... } type of map to track which style lookups require dynamic adjusting
          const dynamicStyleMap = {} as Record<string, string[]>;
          programPath.traverse({
            VariableDeclarator(varDecPath) {
              const callPath = varDecPath.get("init");
              if (!t.isCallExpression(callPath.node)) return;
              if (!t.isIdentifier(varDecPath.node.id)) return;

              let stylesName = varDecPath.node.id.name;
              dynamicStyleMap[stylesName] = [];

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
                const nodesToInsert = [] as {
                  node: ObjectProperty;
                  ogName: string;
                }[];
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
                      // Keep track of e.g. `styles.container` as a call that will need dynamic dark mode support
                      dynamicStyleMap[stylesName].push(property.key.name);

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

                      nodesToInsert.push({
                        node: clonedNode,
                        ogName: property.key.name,
                      });
                      $darkPath.remove();
                    }
                  }
                }

                nodesToInsert.forEach(({ node, ogName }) => {
                  // Insert __property__$dark style declaration into StyleSheet.create
                  // @ts-ignore
                  callPath.node.arguments[0].properties.push(node);

                  // Then add StyleSheet.compose call
                  const newNode = t.variableDeclaration("const", [
                    t.variableDeclarator(
                      t.identifier(
                        `__${stylesName}${(node.key as Identifier).name}`,
                      ),
                      t.callExpression(
                        t.memberExpression(
                          t.identifier(StyleSheetName!),
                          t.identifier("compose"),
                        ),
                        [
                          // styles.container
                          t.memberExpression(
                            t.identifier(stylesName),
                            t.identifier(ogName),
                          ),
                          // styles.__container__$dark
                          t.memberExpression(
                            t.identifier(stylesName),
                            t.identifier((node.key as Identifier).name),
                          ),
                        ],
                      ),
                    ),
                  ]);

                  programPath.pushContainer("body", [newNode]);
                });
              }
            },
          });

          // Short-circuit if no dynamic styles are found
          if (Object.keys(dynamicStyleMap).length === 0) return;

          /**
           * Step 3: Import useDarkMode(name?) from react-native-dark.
           */
          const useDarkModeName = addNamed(
            programPath,
            "useDarkMode",
            "react-native-dark",
          ).name as string;

          /**
           * Step #: Find all functions that have JSX that access our style props, and inject hook call
           */
          programPath.traverse({
            // @ts-ignore
            "FunctionDeclaration|FunctionExpression|ArrowFunctionExpression"(
              funcPath:
                | babel.NodePath<FunctionDeclaration>
                | babel.NodePath<FunctionExpression>
                | babel.NodePath<ArrowFunctionExpression>,
            ) {
              // Before injecting anything, we should find member expressions that need to be modified
              const styleCallToMod = [] as {
                memPath: NodePath<MemberExpression>;
                darkStyleVarName: string;
              }[];
              funcPath.traverse({
                MemberExpression(memPath) {
                  if (
                    t.isIdentifier(memPath.node.object) &&
                    memPath.node.object.name in dynamicStyleMap &&
                    t.isIdentifier(memPath.node.property) &&
                    dynamicStyleMap[memPath.node.object.name].includes(
                      memPath.node.property.name,
                    )
                  ) {
                    console.log(
                      `${memPath.node.object.name}.${memPath.node.property.name} was accessed`,
                    );
                    styleCallToMod.push({
                      memPath,
                      darkStyleVarName: `__${memPath.node.object.name}__${memPath.node.property.name}__$dark`,
                    });
                  }
                },
              });

              if (styleCallToMod.length === 0) return;

              // Inject useDarkMode into function body
              const isDarkNode = funcPath.scope.generateUidIdentifier(
                "__REACT_NATIVE_DARK_isDark",
              );
              const hookDeclaration = t.variableDeclaration("const", [
                t.variableDeclarator(
                  // @ts-ignore babel types are a bit rough
                  isDarkNode,
                  t.callExpression(t.identifier(useDarkModeName), []),
                ),
              ]);

              // Expressions like `const Footer = () => <View style={otherStyles.foo} />;` need to be modded
              //  to add a block statement
              const body = funcPath.get("body");
              if (t.isBlockStatement(body)) {
                (body as babel.NodePath<BlockStatement>).unshiftContainer(
                  "body",
                  hookDeclaration,
                );
              } else {
                (body as NodePath).replaceWith(
                  t.blockStatement([
                    hookDeclaration,
                    // @ts-ignore
                    t.returnStatement(body.node),
                  ]),
                );
              }

              styleCallToMod.forEach(({ memPath, darkStyleVarName }) => {
                memPath.replaceWith(
                  t.conditionalExpression(
                    // @ts-ignore
                    isDarkNode,
                    t.identifier(darkStyleVarName),
                    // @ts-ignore
                    memPath.node,
                  ),
                );
              });
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
