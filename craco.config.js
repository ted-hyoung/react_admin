module.exports = {
  typescript: {
    enableTypeChecking: true,
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
