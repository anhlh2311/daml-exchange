const path = require("path");
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = {
  devServer: {
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error("webpack dev server is not defined");
      }

      devServer.app.use(
        "/api",
        createProxyMiddleware({
          target: "http://localhost:7575",
          changeOrigin: true,
          ws: true,
          pathRewrite: {
            "^/api": "",
          },
        })
      );

      return middlewares;
    },
  },
  webpack: {
    alias: {
      "@daml.js": path.resolve(__dirname, "src/daml.js"),
    },
  },
};
