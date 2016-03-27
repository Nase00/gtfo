const webpack = require('webpack');
const path = require('path');
const merge = require('lodash/merge');

const base = require('./karma.conf.base');

module.exports = (config) => {
  const configuration = merge(base, {
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      type: "text"
    },
    webpack: require('./webpack.config.cov'),
    logLevel: config.LOG_INFO
  });

  if (process.env.TRAVIS){
    configuration.browsers = ['Chrome_travis_ci'];
  }

  config.set(configuration);
};