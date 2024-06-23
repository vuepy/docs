import type { Plugin} from 'vitepress'
// import { useData } from 'vitepress'
import MarkdownIt from 'markdown-it'
import mdContainer, { ContainerOpts } from 'markdown-it-container'
import fs from 'fs'
import path from 'path'
import crypto from 'node:crypto'

// const data = useData()
// const base = data.site.value.base.replace(/\/$/, '')
// const base = '/docs'
const { BASE: base = '/' } = process.env

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


function escapeHTML(html) {
  return html.replace(/[\u00A0-\u9999<>\&]/g, function(i) {
    return '&#' + i.charCodeAt(0) + ';';
  })
}

// requirejs.s.contexts._.config
/** @param {WidgetStateData} widgetState */
function widgetStateHtml(widgetState) {
  return `
   <component :is="'script'" type="text/javascript">
   if (!window.require) {
     var require = {
       enforceDefine: true,
       paths: {
         'anywidget': "https://cdn.jsdelivr.net/npm/anywidget@0.9.3/dist/index.min",
         'anywidget.js': "https://cdn.jsdelivr.net/npm/anywidget@0.9.3/dist/index.min.js",
       },
     };
   }
   console.info('require')
  </component>
	<component :is="'script'" src="${base}/require.min.js"></component>\n
	<component :is="'script'" type="application/vnd.jupyter.widget-state+json">
	  ${escapeHTML(JSON.stringify(widgetState))}
	</component>\n
	<component :is="'script'" src="${base}/html-manager.min.js"></component>\n
	`;
  // src="https://unpkg.com/@jupyter-widgets/html-manager@1.0.10/dist/embed-amd.js">
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
function widgetOutputHtml(output, widgetState) {
  let widgetStateIds = new Set(Object.keys(widgetState?.state ?? {}));
  let widgetData = output?.data[WIDGET_VIEW_MIMETYPE];

  if (widgetData && widgetStateIds.has(widgetData.model_id)) {
    let uuid = crypto.randomUUID();
    return `\
		<div id="${uuid}" class="jupyter-widgets jp-OutputArea-output jp-OutputArea-executeResult">\n
			<component :is="'script'" type="text/javascript">\n
				var element = document.getElementById('${uuid}');\n
			</component>\n
			<component :is="'script'" type="application/vnd.jupyter.widget-view+json">\n
				${JSON.stringify(widgetData)}\n
			</component>
		</div>
		`;
  }

  if (output?.data["text/plain"]) {
    return `<pre>${output.data["text/plain"]}</pre>`;
  }

  return "";
}

function cellToMarkdown(cell, md, env) {
    let mdContent = extractCellSource(cell)
    return md.render(mdContent, env)
}

function cellToRawCode(cell, md, env) {
    let mdContent = `\`\`\`\n${extractCellSource(cell)}\n\`\`\`\n`;
    return md.render(mdContent, env)
}

function cellToIpynbDemo(cell, md, widgetState) {
  let [codeOutput, widgetOutput] = cell.outputs
  let widgetHtml = widgetOutputHtml(widgetOutput, widgetState);

  let code
  try {
    code = JSON.parse(codeOutput.text[0])
  } catch (e) {
    // for empty ipynb cell
    console.error(e)
    return ''
  }
  const { vue, setup} = code;
  let vueHtml = md.render(`\`\`\`vue\n${vue}\n\`\`\`\n`)
  let setupHtml = !!setup ? md.render(`\`\`\`python\n${setup}\n\`\`\`\n`) : '';

  return `
    <IpywuiDemo>
      <template #output>
        ${widgetHtml}\n
      </template>

      <template #src>
        ${vueHtml}\n
        <hr/>
        ${setupHtml}\n
      </template>
    </IpywuiDemo>
    `;
}

export const mdPlugin = (md: MarkdownIt) => {
  md.use(mdContainer, 'ipywui-demo', {
    validate(params: string) {
      return !!params.trim().match(/^ipywui-demo\s*(.*)$/)
    },
    render(tokens, idx, options, env, self) {
      const m = tokens[idx].info.trim().match(/^ipywui-demo\s*(.*)$/)
      if (tokens[idx].nesting !== 1 /* 1 means the tag is opening */) {
        return ''
      }
      const description = m && m.length > 1 ? m[1] : ''
      const sourceFileToken = tokens[idx + 2]
      let nbContent = ''
      const sourceFile = sourceFileToken.children?.[0].content ?? ''

      // TODO
      let fileId = path.resolve(`${sourceFile}.ipynb`)
      if (sourceFileToken.type === 'inline') {
        nbContent = fs.readFileSync(fileId, 'utf-8')
      }
      if (!nbContent) throw new Error(`Incorrect source file: ${sourceFile}`)
      // ipynb -> md with ipywui demo
      let nb = JSON.parse(nbContent)
      if (nb.cells[0].cell_type == 'raw') {
        // let rawSource = extractCellSource(nb.cells.shift());
        // frontmatter = parseFrontmatter(rawSource, id).data;
      }

      let widgetState = nb.metadata?.widgets?.[WIDGET_STATE_MIMETYPE]
      let _widgetStateHtml = ''
      if (widgetState) {
        _widgetStateHtml += widgetStateHtml(widgetState)
      }
      let demosMarkdown = ''
      let append = {
        headers: [],
        title: '',
      }
      for (let cell of nb.cells) {
        let appendBLock = {
          headers: [],
          title: '',
        }
        switch (cell.cell_type) {
          case 'markdown':
            demosMarkdown += cellToMarkdown(cell, md, appendBLock)
            break
          case 'raw':
            demosMarkdown += cellToRawCode(cell, md, appendBLock)
            break
          case 'code':
            demosMarkdown += cellToIpynbDemo(cell, md, widgetState)
            break
        }
        if (appendBLock.headers) {
          append.headers = append.headers.concat(appendBLock.headers)
        }
        if (appendBLock.title) {
          append.title = appendBLock.title
        }
      }

      if (append.headers) {
        let idx = env.headers.findIndex((e) => e.title === "#header-mark#")
        if (idx !== -1) {
          env.headers.splice(idx, 1, ...append.headers)
        }
      }
      if (append.title) {
        env.title = append.title
      }

      return `
        ${demosMarkdown}\n
        ${_widgetStateHtml}\n
        `
    },
  } as ContainerOpts)
}
