const fs = require("fs-extra");
const sharp = require('sharp');
const execSync = require('child_process').execSync;
const srcFolder = './src/';
const previewFolder = './preview/';
const buildFolder = './build/';

fs.ensureDirSync(`${buildFolder}preview/small`);
fs.ensureDirSync(`${buildFolder}editor`);

const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Sketches</title>
  </head>
  <body>
  
    <h1>Sketches</h1>
    
    <ul>
    {{LINKS}}
    </ul>
    
  </body>
</html>
`;

// ======================
// Process js files
// ======================

const files = fs.readdirSync(srcFolder);

let linksList = '';
const filesList = [];

files.forEach(file => {
    if (file.match(/\.js$/)) {
        execSync(`canvas-sketch-cli ${srcFolder + file} --build --inline --no-compress --dir ${buildFolder}`);
        linksList += `<li><a href="${file.replace(/\.js$/, '.html')}">${file.replace(/\.js$/, '')}</a></li>`;
        filesList.push(file.replace(/\.js$/, ''));
    }
});

fs.writeFileSync(`${buildFolder}files.html`, indexHtml.replace('{{LINKS}}', linksList));
fs.writeFileSync(`${buildFolder}files.json`, JSON.stringify(filesList.reverse()));

// ======================
// Process images
// ======================

const images = fs.readdirSync(previewFolder);

images.forEach(image => {
    const imageSrc = `${previewFolder}${image}`;
    sharp(imageSrc)
        .resize(200, 200)
        .quality(100)
        .toFile(`${buildFolder}preview/${image}`);

    sharp(imageSrc)
        .resize(30, 30)
        .quality(100)
        .toFile(`${buildFolder}preview/small/${image}`);
});

// ======================
// Copy website build
// ======================

fs.copy('./website/build', buildFolder);
fs.copy('./editor', `${buildFolder}editor`);



