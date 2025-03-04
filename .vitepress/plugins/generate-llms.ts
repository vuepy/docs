import fs from "fs";
import path from "path";

// https://llmstxt.org/
export function generateLLMSTXTPlugin() {
  return {
    name: 'generate-llms-txt',
    buildEnd(siteConfig: any) {
      const sidebarConfig = require('../config.ts').sidebar;

      const host = 'https://www.vuepy.org';
      let content = '# Vuepy\n\n';
      const h2 = {
        '/guide/': '深度指南',
        '/api/': 'vuepy api',
        '/ipywui/': 'ipywui 组件库',
      }
      for (const [basePath, groups] of Object.entries(sidebarConfig)) {
        if (!(basePath in h2)) {
          continue;
        }
        const h2_title = h2[basePath];
        content += `## ${h2_title}\n`
        groups.forEach(group => {
          content += `\n### ${group.text}\n\n`;
          group.items?.forEach(item => {
            if (item.llms_ignore) {
              return;
            }
            content += `- [${item.text}](${host}${item.link}.html): ${item.text}\n`;
          });
        });
      }

      const outputPath = path.resolve(__dirname, '../dist/llms.txt');
      fs.writeFileSync(outputPath, content);
      console.log(`gen llms.txt success`);
    }
  };
};
