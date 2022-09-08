var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
var _slicedToArray2 = _interopRequireDefault(
  require("@babel/runtime/helpers/slicedToArray")
);
var React = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeDark = require("react-native-dark");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function _getRequireWildcardCache(
    nodeInterop
  ) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}
function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }
  if (obj === null || (typeof obj !== "object" && typeof obj !== "function")) {
    return { default: obj };
  }
  var cache = _getRequireWildcardCache(nodeInterop);
  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }
  var newObj = {};
  var hasPropertyDescriptor =
    Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor
        ? Object.getOwnPropertyDescriptor(obj, key)
        : null;
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  newObj.default = obj;
  if (cache) {
    cache.set(obj, newObj);
  }
  return newObj;
}
function App() {
  var _React$useState = React.useState("dark"),
    _React$useState2 = (0, _slicedToArray2.default)(_React$useState, 2),
    c = _React$useState2[0],
    setC = _React$useState2[1];
  React.useEffect(
    function () {
      (0, _reactNativeDark.setColorScheme)(c);
    },
    [c]
  );
  return (0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
    children: [
      (0, _jsxRuntime.jsx)(_reactNative.TouchableOpacity, {
        style: styles.container,
        onPress: function onPress() {
          return setC(function (v) {
            return v === "dark" ? "light" : "dark";
          });
        },
      }),
      (0, _jsxRuntime.jsx)(_reactNative.Text, {
        style: s.title,
        children: "Hey",
      }),
    ],
  });
}
var foo = _reactNative.StyleSheet.create(3);
var s = _reactNative.StyleSheet.create({
  t: { fontWeight: "bold" },
  title: { color: "red", $dark: { color: "pink", fontWeight: "bold" } },
});
var boo = s.title;
var styles = _reactNative.StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  title: { fontWeight: "bold" },
});
var t = styles.title;
