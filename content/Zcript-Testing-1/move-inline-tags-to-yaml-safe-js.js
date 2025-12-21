const fs = require("fs");
const path = require("path");

const folderPath = process.argv[2] || __dirname;
const files = fs.readdirSync(folderPath).filter(file => file.endsWith(".md"));

files.forEach(file => {
  const filePath = path.join(folderPath, file);
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");

  // Skip if YAML already exists at the top
  if (lines[0].trim() === "---") return;

  const tagLineIndex = lines.findIndex(line => line.startsWith("#"));
  if (tagLineIndex === -1) return;

  const tags = lines[tagLineIndex]
    .split("#")
    .map(t => t.trim())
    .filter(t => t.length > 0);

  if (tags.length === 0) return;

  lines.splice(tagLineIndex, 1); // Remove original tag line
  const yamlBlock = [`---`, `tags: [${tags.join(", ")}]`, `---`];

  const newContent = [...yamlBlock, "", ...lines].join("\n");
  fs.writeFileSync(filePath, newContent, "utf8");

  console.log(`✅ ${file} — tags merged: [${tags.join(", ")}]`);
});
