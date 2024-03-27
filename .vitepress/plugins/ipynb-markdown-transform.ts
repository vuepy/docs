import type { Plugin} from 'vitepress'
import MarkdownIt from 'markdown-it'
import mdContainer, { ContainerOpts } from 'markdown-it-container'
import fs from 'fs'
import path from 'path'
import { highlight } from '../utils/highlight'
import crypto from 'node:crypto'

export function IpynbMarkdownTransform(): Plugin {
  return {
    name: 'ipynb-markdown-transform',
    enforce: 'pre',
    // async buildStart() {
    //   const pattern = `{${[...languages, languages[0]].join(',')}}/component`
    //
    //   compPaths = await glob(pattern, {
    //     cwd: docRoot,
    //     absolute: true,
    //     onlyDirectories: true,
    //   })
    // },
    async transform(code, id) {

    }
  }
}

let WIDGET_VIEW_MIMETYPE = /** @type {const} */ (
  "application/vnd.jupyter.widget-view+json"
);
let WIDGET_STATE_MIMETYPE = /** @type {const} */ (
  "application/vnd.jupyter.widget-state+json"
);

/** @param {WidgetStateData} widgetState */
function widgetClientHtml(widgetState) {
  return `\
	<script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.4/require.min.js"></script>
	<script src="https://unpkg.com/@jupyter-widgets/html-manager@*/dist/embed-amd.js"></script>\n
	<script type="application/vnd.jupyter.widget-state+json">${
    JSON.stringify(
      widgetState,
    )
  }</script>\n`;
}

/** @param {Cell | undefined} cell */
function extractCellSource(cell) {
  if (!cell) return "";
  return Array.isArray(cell.source) ? cell.source.join("") : cell.source;
}

/**
 * @param {CellOutput} output
 * @param {WidgetStateData | undefined} widgetState
 */
function outputWidget(output, widgetState) {
  let widgetStateIds = new Set(Object.keys(widgetState?.state ?? {}));
  let widgetData = output.data[WIDGET_VIEW_MIMETYPE];

  if (widgetData && widgetStateIds.has(widgetData.model_id)) {
    let uuid = crypto.randomUUID();
    return `\
		<div id="${uuid}" class="jupyter-widgets jp-OutputArea-output jp-OutputArea-executeResult">
			<script type="text/javascript">
				var element = document.getElementById("${uuid}");
			</script>
			<script type="application/vnd.jupyter.widget-view+json">
				${JSON.stringify(widgetData)}
			</script>
		</div>
		`;
  }

  if (output.data["text/plain"]) {
    return `<pre>${output.data["text/plain"]}</pre>`;
  }

  return "";
}

export const mdPlugin = (md: MarkdownIt) => {
  md.use(mdContainer, 'ipywui-demo', {
    validate(params: string) {
      return !!params.trim().match(/^ipywui-demo\s*(.*)$/)
    },
    render(tokens, idx) {
      const m = tokens[idx].info.trim().match(/^ipywui-demo\s*(.*)$/)
      if (tokens[idx].nesting === 1 /* means the tag is opening */) {
        const description = m && m.length > 1 ? m[1] : ''
        const sourceFileToken = tokens[idx + 2]
        let nbContent = ''
        const sourceFile = sourceFileToken.children?.[0].content ?? ''

        // TODO
        let fileId = path.resolve('..', 'examples', `${sourceFile}.vue`)
        if (sourceFileToken.type === 'inline') {
          nbContent = fs.readFileSync(
            fileId,
            'utf-8'
          )
        }
        if (!nbContent) throw new Error(`Incorrect source file: ${sourceFile}`)
        // ipynb -> md with ipywui demo
        let nb = JSON.parse(nbContent)
        if (nb.cells[0].cell_type == "raw") {
          // let rawSource = extractCellSource(nb.cells.shift());
          // frontmatter = parseFrontmatter(rawSource, id).data;
        }

        let md = ''
        let widgetState = nb.metadata?.widgets?.[WIDGET_STATE_MIMETYPE];
        if (widgetState) {
          md = widgetClientHtml(widgetState) + md;
        }
        for (let cell of nb.cells) {
          if (cell.cell_type == 'markdown') {
            md += extractCellSource(cell)
          }
          else if (cell.cell_type == 'raw') {
            md += `\`\`\`\n${extractCellSource(cell)}\n\`\`\`\n`;
          }
          else if (cell.cell_type == 'code') {
            let codeOutput = cell.outputs[0]
            let widgetOutput = cell.outputs[1]
            let widgetHtml = outputWidget(widgetOutput, widgetState);
            let code = JSON.parse(codeOutput.text[0])
            let vueCode = code['vue']
            let setupCode = code['setup']
            md += `\
            ${widgetHtml}\n
            \`\`\`vue\n${vueCode}\n\`\`\`\n
            \`\`\`python\n${setupCode}\n\`\`\`\n;
            `;
          }
        }


        return md
        // return `<IPyWuiDemo source="${encodeURIComponent(
        //   highlight(source, 'vue')
        // )}" path="${sourceFile}" raw-source="${encodeURIComponent(
        //   source
        // // )}" description="${encodeURIComponent(localMd.render(description))}">`
        // )}" description="${encodeURIComponent(description)}">`
    } else {
        return '</IPyWuiDemo>'
      }
    },
  } as ContainerOpts)
}
