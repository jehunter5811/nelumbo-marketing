const showdown  = require('showdown');
const fs = require('fs');
const fm = require('front-matter');
const minify = require("minify");
converter = new showdown.Converter();

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

const buildFullHtml = async (html) => {
  try {
    const begin = `<!DOCTYPE html><html lang="en">`;
    const end = '</html>'
    const head = fs.readFileSync('./src/includes/head.html');
    const bodyStart = '<body>';
    const bodyEnd = 
    `<script>
      document.getElementById("form").addEventListener("submit", (e) => {
        e.preventDefault();
      });
    </script>
    <script src="./main.min.js"></script>
    <script
      async
      defer
      src="https://scripts.simpleanalyticscdn.com/latest.js"
    ></script>
    <noscript
      ><img src="https://queue.simpleanalyticscdn.com/noscript.gif" alt=""
    /></noscript>
  </body>`;

  const fullFile = begin + head + bodyStart + html + bodyEnd;
  fs.writeFileSync('./build/blog/test.html', fullFile);
  const minified = await minify('./build/blog/test.html', options);
  fs.writeFileSync('./build/blog/test.html', minified);
  } catch (error) {
    throw error;
  }
}

(async () => {
  try {
    const rootBlogPath = './src/blog/'
    const blogPaths = await fs.readdirSync(rootBlogPath);
    for(const blog of blogPaths) {
      const post = fs.readFileSync(`${rootBlogPath}/${blog}`, 'utf-8');
      const content = fm(post);
      console.log(content)
      const html = converter.makeHtml(content.body);
      console.log(html);
      buildFullHtml(html);
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})()