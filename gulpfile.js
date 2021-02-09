/** If I change the commonJS to ESModule, the terminal shows 'Cannot use import statement outside a module', idk how to fix it */
const { task, src, dest, watch, series, parallel } = require('gulp');
const plugins = require('gulp-load-plugins')();
const mode = process.env.mode;
const tsconfig = {
  module: 'esnext',
  target: 'es5'
};

/** remove dist */
function clean() {
  return src('./dist', { allowEmpty: true }).pipe(plugins.clean());
}

/** Compile mutiple ts files and into one file */
function createContentScript() {
  return src('./dev/content-script/*.ts')
    .pipe(plugins.newer('./dist'))
    .pipe(plugins.typescript(tsconfig))
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
    .pipe(plugins.typescript(tsconfig))
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
  return src(['./node_modules/jquery/dist/jquery.min.js', './node_modules/jquery/dist/jquery.slim.min.js']).pipe(dest('./dist/lib'));
}

function createManifest() {
  return src('./manifest.json').pipe(dest('./dist'));
}

function showMessage(type) {
  return function message(cb) {
    // Use timer ensure console shows in the end
    switch (type) {
      case 'development':
        setTimeout(() => console.log('\033[42;30m DONE \033[40;32m Compiled successfully, enjoy coding~\033[0m'));
        break;
      case 'production':
        setTimeout(() => console.log('\033[42;30m DONE \033[40;32m Build successfully, enjoy deploying~\033[0m'));
        break;
      case 'watch':
        setTimeout(() => console.log('\033[42;30m DONE \033[40;32m Compiled successfully, keep coding~\033[0m'));
        break;
    }
    cb();
  };
}

function watcher(cb) {
  if (mode === 'development') {
    watch('./dev/content-script/**/*.ts', series(createContentScript, showMessage('watch')));
    watch('./dev/images/*.*', createImage);
    watch('./dev/pages/**/*.ts', createPageJS);
    watch('./dev/pages/**/*.less', createPageCSS);
    watch('./dev/pages/**/*.html', createPageHTML);
    watch('./manifest.json', createManifest);
  }
  cb();
}

task(
  'default',
  series(
    clean,
    parallel(createContentScript, createPageJS, createImage, createPageHTML, createPageCSS, createLib, createManifest),
    watcher,
    showMessage(mode)
  )
);
