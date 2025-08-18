const fs = require("fs");
const path = require("path");

const folderPath = "/Users/heatherordover/vaults/Zettelkasten Sync/Script-Testing";

function processFile(filePath) {
  const originalContent = fs.readFileSync(filePath, "utf-8");

  // Match YAML if it exists
  const yamlMatch = originalContent.match(/^---\n([\s\S]*?)\n---\n?/);
  let yaml = "";
  let body = originalContent;

  if (yamlMatch) {
    yaml = yamlMatch[1];
    body = originalContent.slice(yamlMatch[0].length);
  }

  // 🧲 Look for external YAML-style tags line (not inside ---)
  const outsideTagsMatch = body.match(/^tags:\s*\[(.*?)\]\n?/m);
  let tagsFromOutside = [];
  if (outsideTagsMatch) {
    tagsFromOutside = outsideTagsMatch[1]
      .split(",")
      .map((t) => t.trim().replace(/^["']|["']$/g, ""));
    // Remove this line from body
    body = body.replace(outsideTagsMatch[0], "");
  }

  // 🧷 Also capture any tags already inside YAML
  let yamlTags = [];
  const yamlTagsMatch = yaml.match(/^tags:\s*\[(.*?)\]/m);
  if (yamlTagsMatch) {
    yamlTags = yamlTagsMatch[1]
      .split(",")
      .map((t) => t.trim().replace(/^["']|["']$/g, ""));
    yaml = yaml.replace(/^tags:\s*\[.*?\]\n?/m, ""); // Remove old line
  }

  // 📎 Also find inline #tags in the body
  const tagRegex = /(^|\s)#([a-zA-Z0-9/_-]+)/g;
  const inlineTags = new Set();
  let match;
  while ((match = tagRegex.exec(body))) {
    inlineTags.add(match[2]);
  }

  const cleanedBody = body.replace(tagRegex, "$1");

  // 🧬 Merge all tag sources
  const allTags = Array.from(
    new Set([...yamlTags, ...tagsFromOutside, ...inlineTags])
  );

  const newYaml = `---\n${yaml.trim()}\n${
    allTags.length > 0 ? `tags: [${allTags.join(", ")}]` : ""
  }\n---`;

  const finalContent = `${newYaml.trim()}\n\n${cleanedBody.trimEnd()}`;
  fs.writeFileSync(filePath, finalContent, "utf-8");

  console.log(
    `✅ ${path.basename(filePath)} — tags merged: [${allTags.join(", ")}]`
  );
}

fs.readdirSync(folderPath).forEach((file) => {
  if (file.endsWith(".md")) {
    const fullPath = path.join(folderPath, file);
    processFile(fullPath);
  }
});