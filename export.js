const fs = require('fs');
const path = require('path');
const { Client } = require('@notionhq/client');
const { NotionToMarkdown } = require('notion-to-md');

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const n2m = new NotionToMarkdown({ notionClient: notion });

async function saveMarkdown(pageId, outDir = 'notes') {
  const mdblocks = await n2m.pageToMarkdown(pageId);
  const mdString = n2m.toMarkdownString(mdblocks);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const filename = path.join(outDir, `${pageId}.md`);
  fs.writeFileSync(filename, mdString);
  return filename;
}

(async () => {
  try {
    const pageId = process.env.NOTION_PAGE_ID;
    if (!pageId) throw new Error('NOTION_PAGE_ID is not set');
    const file = await saveMarkdown(pageId, 'notes');
    console.log('Saved to', file);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
