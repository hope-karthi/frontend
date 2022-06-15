const webpack = require('webpack')
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin")

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  devServer: {
    hot: true,
    open: true,
  },
  plugins: [
    new ReactRefreshWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env.dev_name': JSON.stringify('homenow-user'),
      'process.env.dev_pass': JSON.stringify("631210"),
      'process.env.CAPTCHA_ID': JSON.stringify("6LeagAggAAAAAKkpn3qe73QIjwRaq39Du0FBFHlo"),
      'process.env.GAUTH_ID': JSON.stringify("615067725998-9nsu6mk8f17hh7msikg5feu87mh39unh.apps.googleusercontent.com"),
      'process.env.GMAP_ID' : JSON.stringify("AIzaSyBf70rT81kPCj_VrA1zktxh7jomvD5m9DE"),
      'process.env.BACKEND_URL': JSON.stringify('http://localhost:8000'),
      'process.env.IP_API' : JSON.stringify('baf9ed94f5dc56d1837e51ebef37d1c54fb16464d465d343718d7110'),
    }),
  ],
}