const path = require('path');

module.exports = {
  // other configurations ...
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                modifyVars: {
                  'hack': `true; @import "${path.resolve(__dirname, 'src/styles/custom-theme.less')}";`,
                },
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      // other rules ...
    ],
  },
  // other configurations ...
};
