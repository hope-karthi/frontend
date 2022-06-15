const webpack = require('webpack')

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  devServer: {
    allowedHosts: [
      'dev.homenow.in',
      'homenow.in',
    ],
    historyApiFallback: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.dev_name': JSON.stringify('homenow-user'),
      'process.env.dev_pass': JSON.stringify("631210"),
      'process.env.CAPTCHA_ID': JSON.stringify("6LeagAggAAAAAKkpn3qe73QIjwRaq39Du0FBFHlo"),
      'process.env.IP_API' : JSON.stringify('baf9ed94f5dc56d1837e51ebef37d1c54fb16464d465d343718d7110'),
      'process.env.GMAP_ID' : JSON.stringify("AIzaSyBf70rT81kPCj_VrA1zktxh7jomvD5m9DE"),
      'process.env.GAUTH_ID': JSON.stringify("115681724372-aqohu55vln1j3t8gjvnq61u9bs3n41e6.apps.googleusercontent.com"),
      'process.env.BACKEND_URL': JSON.stringify('http://184.72.116.234:8000')
    }),
  ],
}