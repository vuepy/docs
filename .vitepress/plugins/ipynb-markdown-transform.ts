import type { Plugin} from 'vitepress'
import MarkdownIt from 'markdown-it'
import mdContainer, { ContainerOpts } from 'markdown-it-container'
import fs from 'fs'
import path from 'path'
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
	<component :is="'script'" src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.1.10/require.min.js"></component>
	<component :is="'script'" src="https://unpkg.com/@jupyter-widgets/html-manager@*/dist/embed-amd.js"></component>\n
	<component :is="'script'" type="application/vnd.jupyter.widget-state+json">${
    JSON.stringify(
      widgetState,
    )
  }</component>\n`;
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
  let widgetData = output?.data[WIDGET_VIEW_MIMETYPE];

  if (widgetData && widgetStateIds.has(widgetData.model_id)) {
    let uuid = crypto.randomUUID();
    return `\
		<div id="${uuid}" class="jupyter-widgets jp-OutputArea-output jp-OutputArea-executeResult">
			<component :is="'script'" type="text/javascript">
				var element = document.getElementById("${uuid}");
			</component>
			<component :is="'script'" type="application/vnd.jupyter.widget-view+json">
				${JSON.stringify(widgetData)}
			</component>
		</div>
		`;
  }

  if (output?.data["text/plain"]) {
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
        let fileId = path.resolve(`${sourceFile}.ipynb`)
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

        let html = ''
        let mdContent = ''
        let widgetState = nb.metadata?.widgets?.[WIDGET_STATE_MIMETYPE];
        let widgetHtml = ''
        if (widgetState) {
          widgetHtml = widgetClientHtml(widgetState);
        }
        for (let cell of nb.cells) {
          if (cell.cell_type == 'markdown') {
            mdContent = extractCellSource(cell)
            html += md.render(mdContent)
          }
          else if (cell.cell_type == 'raw') {
            mdContent = `\`\`\`\n${extractCellSource(cell)}\n\`\`\`\n`;
            html += md.render(mdContent)
          }
          else if (cell.cell_type == 'code') {
            let widgetOutput = cell.outputs[1]
            widgetHtml += outputWidget(widgetOutput, widgetState);

            let codeOutput = cell.outputs[0]
            let code
            try {
              code = JSON.parse(codeOutput.text[0])
            } catch (e) {
              console.error(e)
              continue
            }
            let vueCode = code['vue']
            let setupCode = code['setup']
            let vueHtml = md.render(`\`\`\`vue\n${vueCode}\n\`\`\`\n`)
            let setupHtml = md.render(`\`\`\`python\n${setupCode}\n\`\`\`\n`);
            html += `\
            <IpywuiDemo>
            <slot>
            ${widgetHtml}\n
            ${vueHtml}\n
            ${setupHtml}\n
            </slot>
            </IpywuiDemo>
            `;
          }
        }
        return html
    } else {
        return ''
      }
    },
  } as ContainerOpts)
}
