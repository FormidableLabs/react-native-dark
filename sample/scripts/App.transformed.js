Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
var _reactNativeDark = require("react-native-dark");
var React = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
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
  return (0, _jsxRuntime.jsxs)(_reactNative.View, {
    children: [
      (0, _jsxRuntime.jsx)(Header, {}),
      (0, _jsxRuntime.jsx)(Body, {}),
    ],
  });
}
var Header = function Header() {
  var _REACT_NATIVE_DARK_isDark = (0, _reactNativeDark.useDarkMode)();
  return (0, _jsxRuntime.jsx)(_reactNative.View, {
    style: _REACT_NATIVE_DARK_isDark ? __styles__banner__$dark : styles.banner,
  });
};
var Body = function Body() {
  var _REACT_NATIVE_DARK_isDark2 = (0, _reactNativeDark.useDarkMode)();
  return (0, _jsxRuntime.jsx)(_reactNative.Text, {
    style: _REACT_NATIVE_DARK_isDark2 ? __styles__title__$dark : styles.title,
  });
};
var Footer = function Footer() {
  var _REACT_NATIVE_DARK_isDark3 = (0, _reactNativeDark.useDarkMode)();
  return (0, _jsxRuntime.jsx)(_reactNative.View, {
    style: _REACT_NATIVE_DARK_isDark3
      ? __otherStyles__foo__$dark
      : otherStyles.foo,
  });
};
var styles = _reactNative.StyleSheet.create({
  container: { backgroundColor: "red" },
  title: { fontSize: 24 },
  banner: { padding: 8 },
  __container__$dark: { fontWeight: "bold" },
  __title__$dark: { fontSize: 18 },
  __banner__$dark: { padding: 12 },
});
var otherStyles = _reactNative.StyleSheet.create({
  foo: { backgroundColor: "red" },
  __foo__$dark: { backgroundColor: "blue" },
});
var __styles__container__$dark = _reactNative.StyleSheet.compose(
  styles.container,
  styles.__container__$dark
);
var __styles__title__$dark = _reactNative.StyleSheet.compose(
  styles.title,
  styles.__title__$dark
);
var __styles__banner__$dark = _reactNative.StyleSheet.compose(
  styles.banner,
  styles.__banner__$dark
);
var __otherStyles__foo__$dark = _reactNative.StyleSheet.compose(
  otherStyles.foo,
  otherStyles.__foo__$dark
);
