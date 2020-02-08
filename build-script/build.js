
console.log("starting build");

const fs = require("fs");
const path = require("path");

(async function() {

let htmlFileContents = fs.readFileSync("../src/index.html").toString("utf-8");

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

    console.log("found script: " + currentMatch[1]);
    scriptFileNames.push(currentMatch[1]);
}

const jsFileContents = [];
scriptFileNames.forEach(filename =>
{
    console.log("reading script file: " + filename);
    jsFileContents.push(fs.readFileSync("../src/" + filename).toString("utf-8"));
});

htmlFileContents = htmlFileContents.substring(0, startIndex)
    + jsFileContents.map(fileContent => "<script type=\"text/javascript\">\n" + fileContent + "\n</script>").join("\n")
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
    console.log("reading font file: " + fontFilePath);
    const fontDataUrl = "src: url(\"data:application/font-woff;base64," + fs.readFileSync("../src/" + fontFilePath).toString("base64") + "\") format(\"woff\");";

    startIndex += currentMatch.index;
    htmlFileContents = htmlFileContents.substring(0, startIndex) + fontDataUrl + htmlFileContents.substring(startIndex + currentMatch[0].length);
    startIndex += fontDataUrl.length;
}

// process images
const imageSources = fs.readFileSync("../src/js/imagesources.js").toString("utf-8");
const imagePaths = JSON.parse(imageSources.match(/{.*}/gs));
const imageDataUrls = {};

for (let imgName in imagePaths)
{
    const imgPath = imagePaths[imgName];
    console.log("reading image: " + imgPath);
    const fileData = fs.readFileSync(path.join("../src/", imgPath)).toString("base64");
    const extension = imgName.match(/\.(.+)/)[1];
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

    imageDataUrls[imgName] = "data:image/" + mimeType + ";base64," + fileData;
}

// did I mention that you shouldn't parse html with regex?
startIndex = htmlFileContents.match(/<\/body>\s*<\/html>/).index;
htmlFileContents = htmlFileContents.substring(0, startIndex)
    + "\n<script type=\"text/javascript\">\nwindow[\"imageSources\"] = " + JSON.stringify(imageDataUrls) + ";\n</script>\n"
    + htmlFileContents.substring(startIndex);

fs.writeFileSync("../index.html", htmlFileContents);
console.log("build successful");

})();
