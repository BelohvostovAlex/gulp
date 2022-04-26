const { src, dest, series, watch } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const csso = require("gulp-csso");
const include = require("gulp-file-include");
const htmlmin = require("gulp-htmlmin");
const del = require("del");
const concat = require("gulp-concat");
const autoprefixer = require("gulp-autoprefixer");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp")
const changed = require("gulp-changed")
const plumber = require("gulp-plumber")
const multiDest = require("gulp-multi-dest")
const sync = require("browser-sync").create();

const html = () => {
  return src("src/**.html")
    .pipe(
      include({
        prefix: "@@",
      })
    )
    .pipe(
      htmlmin({
        collapseWhitespace: true,
      })
    )
    .pipe(dest("dist"));
};

const scss = () => {
  return src("src/scss/**.scss")
    .pipe(sass())
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(csso())
    .pipe(concat("index.css"))
    .pipe(dest("dist"));
};

const clear = () => {
  return del("dist");
};

const serve = () => {
  sync.init({
    server: "./dist",
  });

  watch("src/**/*.html", series(html)).on("change", sync.reload);
  watch("src/scss/**.scss", series(scss)).on("change", sync.reload);
};

const imgmin = () => {
  return src("src/images/**/*.+(png|jpg|jpeg|gif|svg|ico)")
    .pipe(
      imagemin([
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
      ])
    )
    .pipe(dest("src/images"));
};

const webpConv = () => {
  return src('src/images/**/*.+(png|jpg|jpeg)')
    .pipe(plumber())
    .pipe(changed('dist/images', {
      extension: '.webp'
    }))
    .pipe(webp())
    .pipe(multiDest(["src/images","dist/images"]))
}

exports.build = series(clear, imgmin, scss, html);
exports.serve = series(clear, imgmin, webpConv, scss, html, serve);
exports.clear = clear;
