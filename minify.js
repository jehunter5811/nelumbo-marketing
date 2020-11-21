const minify = require("minify");
const fs = require("fs");

const options = {
  css: {
    compatibility: "*",
  },
  js: {
    ecma: 7,
  },
  html: {
    removeAttributeQuotes: false,
    removeOptionalTags: false,
  },
};

(async () => {
  try {
    //  First we cycle through the css files
    let minifiedCssFull;
    let minifiedJsFull;
    let rootCSSPath = "src/assets/css";
    let rootJSPath = "src/assets/scripts";
    let buildPath = "build/";
    const cssPaths = await fs.readdirSync(rootCSSPath);
    for (const path of cssPaths) {
      const minifiedCSS = await minify(`${rootCSSPath}/${path}`, options);
      minifiedCssFull = minifiedCssFull
        ? minifiedCssFull + minifiedCSS
        : minifiedCSS;
    }

    if (!fs.existsSync(buildPath)) {
      fs.mkdirSync(buildPath);
    }

    fs.writeFileSync(`${buildPath}/style.min.css`, minifiedCssFull);

    const jsPaths = await fs.readdirSync(rootJSPath);

    for (const path of jsPaths) {
      const minifiedJs = await minify(`${rootJSPath}/${path}`, options);
      minifiedJsFull = minifiedJsFull
        ? minifiedJsFull + minifiedJs
        : minifiedJs;
    }

    fs.writeFileSync(`${buildPath}/main.min.js`, minifiedJsFull);

    const minifiedHtml = await minify(`src/index.html`, options);

    fs.writeFileSync(`${buildPath}/index.html`, minifiedHtml);
    console.log("Done building!");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
