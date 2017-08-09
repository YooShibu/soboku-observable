const { rollup } = require("rollup");
const { readFileSync } = require("fs");
const tsp = require("rollup-plugin-typescript");
const uglify = require("rollup-plugin-uglify");
const typescript = require("typescript");

const path = require("path");
const name = JSON.parse(readFileSync(path.resolve("./node_modules"))).name;
const entry = path.resolve("./src/index.ts");


rollup({
    entry,
    plugins: [
        tsp({ typescript, target: "ES2015" })
    ]
}).then(val => {
    val.write({
        dest: path.resolve(`./dist/${name}.mjs`),
        format: "es",
        sourceMap: true
    });
});


rollup({
    entry,
    plugins: [
        tsp({ typescript, target: "ES3" })
    ]
}).then(val => {
    val.write({
        dest: path.resolve(`./dist/${name}.js`),
        format: "cjs",
        sourceMap: true
    });
});


rollup({
    entry,
    plugins: [
        tsp({ typescript, target: "ES3" }),
        uglify()
    ],
}).then(val => {
    val.write({
        dest: path.resolve(`./dist/${name}.min.js`),
        format: "iife",
        moduleName: "soboku",
        sourceMap: true
    });
});