const showdown = require("showdown");
const fs = require("fs");
const fm = require("front-matter");
const minify = require("minify");
const Parser = require("rss-parser");
const parser = new Parser();
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

const buildFullHtml = async (html, title, fileTitle) => {
  try {
    //  First we get the json
    const begin = `<!DOCTYPE html><html lang="en">`;
    const end = "</html>";
    const head = fs.readFileSync("./src/includes/head.html", "utf-8");
    const docTitle = `<title>${title}</title>`;
    const meta = `<meta
      name="description"
      content="${title}"
    />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <meta
      property="og:title"
      content="${title}"
    />
    <meta property="og:type" content="site" />
    <meta property="og:url" content="https://nelumbo.dev" />
    <meta property="og:image" content="assets/img/twitter_profile_image.png" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:site" content="Nelumbo" />
    <meta name="twitter:title" content="Nelumbo" />
    <meta
      name="twitter:description"
      content="${title}"
    />`;
    const headEnd = `</head>`;
    const bodyStart = `<body>`;
    const bodyEnd = `
    <script src="../main.min.js"></script>
    <script
      async
      defer
      src="https://scripts.simpleanalyticscdn.com/latest.js"
    ></script>
    <noscript
      ><img src="https://queue.simpleanalyticscdn.com/noscript.gif" alt=""
    /></noscript>
  </body>`;

    const fullFile =
      begin +
      head +
      docTitle +
      meta +
      headEnd +
      bodyStart +
      html +
      bodyEnd +
      end;
    fs.writeFileSync(
      `./build/blog/${fileTitle.split(" ").join("_")}.html`,
      fullFile
    );
    const minified = await minify(
      `./build/blog/${fileTitle.split(" ").join("_")}.html`,
      options
    );
    fs.writeFileSync(
      `./build/blog/${fileTitle.split(" ").join("_")}.html`,
      minified
    );
  } catch (error) {
    throw error;
  }
};

(async () => {
  try {
    //  Fetch the rss feed from Medium
    const feed = await parser.parseURL(
      "https://medium.com/feed/@polluterofminds"
    );
    const postsWithCategories = feed.items.filter(
      (f) => f.categories && f.categories.length > 0
    );
    const nelumboPosts = postsWithCategories.filter((p) =>
      p.categories.includes("nelumbo")
    );
    for (const post of nelumboPosts) {
      const html = `
        <nav class="blog-header">
          <a href="/index.html"><img class="small-logo" src="../img/favicon.png" alt="Nelumbo logo small" /></a>
        </nav>
        <div class="blog-post">
          ${post["content:encoded"]}
        </div>
      `
      buildFullHtml(html, post.title, post.title);
    }

    const blogIndexJson = nelumboPosts.map((p) => {
      return {
        title: p.title,
        date: p.pubDate,
        tags: p.categories,
      };
    });

    //  Build the index file
    let htmlArray = [];
    try {
      for (const blog of blogIndexJson) {
        let htmlToUse = `          
          <div class="index-post">
            <a href="/blog/${blog.title.split(' ').join('_')}.html"><h3>${blog.title}</h3></a>
            <p>${blog.date}</p>
            <p>${blog.tags.join(", ")}</p>
          </div>
        `;
        htmlArray.push(htmlToUse);
      }
    } catch (error) {
      console.log(error);
    }
    
    const indexHtml = `
      <div>
        <nav class="blog-header">
          <a href="/index.html"><img class="small-logo" src="../img/favicon.png" alt="Nelumbo logo small" /></a>
        </nav>
        <div class='main-post-index'>
          <h1>Nelumbo Blog</h1>
          ${htmlArray.map(function (post) {
            return post;
          })}
        </div>
      </div>
    `;
    buildFullHtml(indexHtml, "Nelumbo Blog", "index");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
