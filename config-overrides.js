/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
module.exports = function override(config) {
  // get rid of hash for js files
  // eslint-disable-next-line no-param-reassign
  config.output = {
    ...config.output, // copy all settings
    filename: 'static/js/[name].js',
    chunkFilename: 'static/js/[name].chunk.js',
  };

  // Get rid of hash for css files
  const miniCssExtractPlugin = config.plugins.find((element) => element.constructor.name === 'MiniCssExtractPlugin');
  miniCssExtractPlugin.options.filename = 'static/css/[name].css';
  miniCssExtractPlugin.options.chunkFilename = 'static/css/[name].css';

  return config;
};
