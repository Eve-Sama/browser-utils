/** If I change the commonJS to ESModule, the terminal shows 'Cannot use import statement outside a module', idk how to fix it */
const { task, src, dest, watch, series, parallel } = require('gulp');
const plugins = require('gulp-load-plugins')();
const mode = process.env.mode;

/** remove dist */
function clean() {
  return src('./dist', { allowEmpty: true }).pipe(plugins.clean());
}

/** Compile mutiple ts files and into one file */
function createContentScript() {
  return src('./dev/content-script/*.ts')
    .pipe(plugins.newer('./dist'))
    .pipe(plugins.typescript())
    .pipe(plugins.concat('content-script/content-script.js'))
    .pipe(plugins.if(mode === 'production', plugins.uglify()))
    .pipe(dest('./dist'));
}

/** Copy images from pages to dist*/
function createImage() {
  return src('./dev/images/*.*').pipe(plugins.newer('./dist')).pipe(dest('./dist/images'));
}

/** Compile ts under pages*/
function createPageJS() {
  return src('./dev/pages/**/*.ts')
    .pipe(plugins.newer('./dist'))
    .pipe(plugins.typescript())
    .pipe(plugins.if(mode === 'production', plugins.uglify()))
    .pipe(dest('./dist/pages'));
}

/** Compile less under pages*/
function createPageCSS() {
  return src('./dev/pages/**/*.less')
    .pipe(plugins.newer('./dist'))
    .pipe(plugins.less({ outputStyle: 'compressed' }))
    .pipe(
      plugins.autoprefixer({
        casecade: false,
        remove: false
      })
    )
    .pipe(plugins.if(mode === 'production', plugins.minifyCss()))
    .pipe(dest('./dist/pages'));
}

/** Copy html from pages to dist*/
function createPageHTML() {
  return src('./dev/pages/**/*.html')
    .pipe(plugins.newer('./dist'))
    .pipe(plugins.if(mode === 'production', plugins.htmlmin({ collapseWhitespace: true })))
    .pipe(dest('./dist/pages'));
}

function createLib() {
  src('./node_modules/jquery/dist/jquery.min.js').pipe(dest('./dist/lib'));
  return src('./node_modules/jquery/dist/jquery.slim.min.js').pipe(dest('./dist/lib'));
}

function createManifest() {
  return src('./manifest.json').pipe(dest('./dist'));
}

function end(cb) {
  if (mode === 'development') {
    setTimeout(() => console.log('\033[42;30m DONE \033[40;32m Compiled successfully, enjoy coding~\033[0m'));
  } else if (mode === 'production') {
    setTimeout(() => console.log('\033[42;30m DONE \033[40;32m Build successfully, enjoy deploying~\033[0m'));
  }
  cb();
}

function watcher(cb) {
  function doWatch(cb) {
    watch('./dev/content-script/**/*.ts', createContentScript);
    watch('./dev/images/*.*', createImage);
    watch('./dev/pages/**/*.ts', createPageJS);
    watch('./dev/pages/**/*.less', createPageCSS);
    watch('./dev/pages/**/*.html', createPageHTML);
    watch('./manifest.json', createManifest);
    cb();
  }
  plugins.if(mode === 'development', doWatch);
  cb();
}

task(
  'default',
  series(
    clean,
    parallel(createContentScript, createPageJS, createImage, createPageHTML, createPageCSS, createLib, createManifest),
    watcher,
    end,
  )
);
