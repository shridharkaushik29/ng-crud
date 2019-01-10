const webpack = require("webpack");
const path = require("path");

module.exports = env => {
    const {mode, filename} = env
    if (!filename)
        throw "Please enter a filename"
    return {
        mode,
        entry: path.resolve(__dirname, `src/${filename}.ts`),
        output: {
            path: path.resolve(__dirname),
            filename: mode === 'production' ? `${filename}.min.js` : `${filename}.js`
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: [
                        {
                            loader: "ts-loader",
                            options: {
                                transpileOnly: true,
                                experimentalWatchApi: true
                            }
                        }
                    ]
                }
            ]
        },
        externals: {
            angular: "angular",
            lodash: "_"
        },
    }
}