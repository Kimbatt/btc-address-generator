
const fs = require("fs");
const ClosureCompiler = require("google-closure-compiler").compiler;

(async function() {

let htmlFileContents = fs.readFileSync("../split/index.html").toString("utf-8");

// process scripts
const scriptFileNames = [];
let startIndex = 0;
while (true)
{
    // never parse html with regex!
    const currentMatch = htmlFileContents.substring(startIndex).match(/<script type=\"text\/javascript\" src=\"(.+?)\"><\/script>/);
    if (!currentMatch)
        break;

    startIndex += currentMatch.index;
    htmlFileContents = htmlFileContents.substring(0, startIndex) + htmlFileContents.substring(startIndex + currentMatch[0].length);

    scriptFileNames.push(currentMatch[1]);
}

const compiler = new ClosureCompiler({
    js: scriptFileNames.map(path => "../split/" + path),
    //js_output_file: "compiled.js",
    externs: "externs.js",
    compilation_level: "ADVANCED"
});

let compiledJS;
try
{
    compiledJS = await new Promise((resolve, reject) => compiler.run((exitCode, stdOut, stdErr) =>
    {
        if (exitCode !== 0)
        {
            console.log("error compiling");
            console.log("exit code: ", exitCode);
            console.log("stdout: ", stdOut);
            console.log("stderr: ", stdErr);
            reject();
            return;
        }

        resolve(stdOut);
    }));
}
catch (e)
{
    process.exit(1);
}

htmlFileContents = htmlFileContents.substring(0, startIndex)
    + "<script type=\"text/javascript\">" + compiledJS + "</script>"
    + htmlFileContents.substring(startIndex);

htmlFileContents = htmlFileContents.replace(/(\r\n\s*){3,}/g, "\r\n");

// process font files
startIndex = 0;
while (true)
{
    const currentMatch = htmlFileContents.substring(startIndex).match(/src: url\((.+?)\) format\(\'woff\'\);/);
    if (!currentMatch)
        break;

    const fontFilePath = currentMatch[1];
    const fontDataUrl = "src: url(\"data:application/font-woff;base64," + fs.readFileSync("../split/" + fontFilePath).toString("base64") + "\") format(\"woff\");";

    startIndex += currentMatch.index;
    htmlFileContents = htmlFileContents.substring(0, startIndex) + fontDataUrl + htmlFileContents.substring(startIndex + currentMatch[0].length);
    startIndex += fontDataUrl.length;
}

// process images
const imageSources = fs.readFileSync("../split/imagesources.js").toString("utf-8");
const imagePaths = JSON.parse(imageSources.match(/{.*}/gs));
const imageDataUrls = {};

for (let path in imagePaths)
{
    const fileData = fs.readFileSync("../split/" + path).toString("base64");
    const extension = path.match(/\.(.+)/)[1];
    let mimeType;
    switch (extension)
    {
        case "jpg":
        case "jpeg":
            mimeType = "jpeg";
            break;
        case "svg":
            mimeType = "svg+xml";
            break;
    }

    imageDataUrls[path] = "data:image/" + mimeType + ";base64," + fileData;
}

// did I mention that you shouldn't parse html with regex?
startIndex = htmlFileContents.match(/<\/body>\s*<\/html>/).index;
htmlFileContents = htmlFileContents.substring(0, startIndex)
    + "\n<script type=\"text/javascript\">\nwindow[\"imageSources\"] = " + JSON.stringify(imageDataUrls) + ";\n</script>\n"
    + htmlFileContents.substring(startIndex);

fs.writeFileSync("../index.html", htmlFileContents);
console.log("build successful");

})();
