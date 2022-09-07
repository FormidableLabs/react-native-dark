const { getDefaultConfig } = require("expo/metro-config");
const blacklist = require("metro-config/src/defaults/exclusionList");
const escape = require("escape-string-regexp");
const path = require("path");

// Find the workspace root, this can be replaced with `find-yarn-workspace-root`
const workspaceRoot = path.resolve(__dirname, "../..");
const projectRoot = __dirname;

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];
// 2. Let Metro know where to resolve packages, and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

/**
 * Ensuring we only use one version of some shared deps, like React.
 * Using multiple versions of React causes errors.
 * We want to ignore root/package-level instances, and only use the local ones here.
 */
const modules = ["react"];
config.resolver.blacklistRE = blacklist(
  modules.map(
    (m) =>
      new RegExp(
        `^${escape(path.join(workspaceRoot, "node_modules", m))}\\/.*$`,
      ),
  ),
);
config.resolver.extraNodeModules = modules.reduce((acc, name) => {
  acc[name] = path.join(__dirname, "node_modules", name);
  return acc;
}, {});

module.exports = config;
