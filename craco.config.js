/* eslint-disable */

// React app global environment variable
if (process.env.NODE_ENV === 'production') {
  if (process.env.REACT_APP_BUILD_MODE === 'sandbox') {
    require('dotenv').config({ path: './config/.env.development' });
  } else {
    require('dotenv').config({ path: './config/.env.production' });
  }
} else {
  require('dotenv').config({ path: './config/.env.local' });
}

// Offical documentation available at: https://github.com/FormAPI/craco-antd
module.exports = {
  style: {
    postcss: {
      env: {
        autoprefixer: {
          cascade: true,
        },
      },
    },
  },
  plugins: [
    {
      plugin: require('craco-antd'),
      options: {
        customizeTheme: {
          '@primary-color': '#1DA57A',
          '@link-color': '#1DA57A',
        },
      },
    },
  ],
};
