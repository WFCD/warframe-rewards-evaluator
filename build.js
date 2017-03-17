const del = require('del');
const ncp = require('ncp');
const path = require('path');
const fs = require('fs');

const srcpath = path.join(__dirname,'src');
const destpath = path.join(__dirname,'dist');

// Purges the dist directory and copies static assets
// The dist folder is a prerequisite for the typescript compile to work
del([destpath]).then(() => {
    fs.mkdirSync(destpath);
    fs.readdirSync(srcpath)
    // Do not copy the js folder, it needs to be built
    .filter(file =>  file !== 'js' && fs.statSync(path.join(srcpath, file)).isDirectory())
    .forEach(dir => {
        // Copy all other folders recursively
        ncp(path.join(srcpath, dir), path.join(destpath, dir));
    }); 
});