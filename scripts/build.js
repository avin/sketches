const fs = require('fs');
const execSync = require('child_process').execSync;
const srcFolder = './src/';
const buildFolder = './build/';

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

fs.readdir(srcFolder, (err, files) => {
    let linksList = '';

    files.forEach(file => {
        if (file.match(/\.js$/)) {
            execSync(`canvas-sketch-cli ${srcFolder + file} --build --inline --dir ${buildFolder}`);
            linksList += `<li><a href="${file.replace(/\.js$/, '.html')}">${file.replace(/\.js$/, '')}</a></li>`;
        }
    });

    fs.writeFileSync(`${buildFolder}/index.html`, indexHtml.replace('{{LINKS}}', linksList));
});
