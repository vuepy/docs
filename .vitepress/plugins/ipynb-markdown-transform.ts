import type { Plugin} from 'vitepress'
// import { useData } from 'vitepress'
import MarkdownIt from 'markdown-it'
import mdContainer, { ContainerOpts } from 'markdown-it-container'
import fs from 'fs'
import path from 'path'
import crypto from 'node:crypto'
import prettier from 'prettier'

const removeComments = (code) => {
  return code.replace(/(['"])(?:\\.|.)*?\1|\/\/.*$/gm, (match) => {
    return match.startsWith('//') ? '' : match;
  });
}

/**
 * 替换以var docs_json开头的行中的指定HTML实体
 * @param {string} input - 输入文本
 * @param {string} entity - 要替换的实体名称
 * @returns {string} 处理后的文本
 */
function replaceEntityInDocsJson(input, entity) {
  return input.replace(/^\s*html: .*$/gm, line =>
    line.replace(new RegExp(`&${entity};`, 'g'), `&amp;${entity}`)
  );
}

/**
 * 替换以var docs_json开头的行中的指定HTML实体
 * @param {string} input - 输入文本
 * @param {string} entity - 要替换的实体名称
 * @returns {string} 处理后的文本
 */
function replaceEntityInDocsJsonScript(input, entity) {
  return input.replace(/var docs_json.*$/gm, line =>
    line.replace(new RegExp(`&${entity};`, 'g'), `&amp;${entity}`)
  );
}

function replaceLast(str, search, replacement) {
  const pos = str.lastIndexOf(search);
  if (pos === -1) return str;
  return str.substring(0, pos) + replacement + str.substring(pos + search.length);
}

// const data = useData()
// const base = data.site.value.base.replace(/\/$/, '')
// const base = '/docs/'
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
	<component :is="'script'" type="application/vnd.jupyter.widget-state+json">
	  ${escapeHTML(JSON.stringify(widgetState))}
	</component>\n
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
function widgetOutputHtml(output, widgetState, fileId) {
  let outputType = output?.output_type;
  if (outputType !== 'display_data' && outputType !== 'execute_result') {
    return ''
  }
  let html = '';
  let data = output?.data;
  if (data['text/html']) {
    let _html = data['text/html']?.join('');
    _html = removeComments(_html);

    if (fileId.includes('TextEditor.ipynb')) {
      // fix function is_loaded(root)
      _html = _html.replace(
        'return (Bokeh != null && Bokeh.Panel !== undefined)',
        'return (Bokeh != null && Bokeh.Panel !== undefined && window.Quill !== undefined)');
    } else if (fileId.includes('Plotly.ipynb')) {
      // fix function is_loaded(root)
      _html = _html.replace(
        'return (Bokeh != null && Bokeh.Panel !== undefined)',
        'return (Bokeh != null && Bokeh.Panel !== undefined && window.Plotly !== undefined)');
    } else if (fileId.includes('Perspective.ipynb')) {
      _html = _html.replace(
        'return (Bokeh != null && Bokeh.Panel !== undefined',
        'return (Bokeh != null && Bokeh.Panel !== undefined && window.perspective !== undefined');
    } else if (fileId.includes('ChatFeed.ipynb')) {
      _html = replaceEntityInDocsJsonScript(_html, 'quot');
    }

    _html = prettier.format(_html, {
      semi: true,
      parser: "html",
    });
    _html = _html.replace(/<script/g, '<component :is="\'script\'"');
    _html = _html.replace(/<\/script>/g, '<\/component>');
    _html = _html.replace(/<style/g, '<component :is="\'style\'"');
    _html = _html.replace(/<\/style>/g, '<\/component>');
    _html = _html.replace(/<enter>/g, 'enter');
    _html = _html.replace(/<class 'panel.layout.base.Column'>/g, 'class \'panel.layout.base.Column\'');
    _html = _html.replace(/callback=<bound method ChatInterface/g, 'callback=bound method ChatInterface');
    _html = _html.replace(/<PowerCurve PowerCurve(\d+)>/g, 'PowerCurve PowerCurve$1');

    // 替换以var docs_json中html的&quot;为&amp;quot;
    _html = replaceEntityInDocsJson(_html, 'quot');
    _html = replaceEntityInDocsJson(_html, 'lt');
    _html = replaceEntityInDocsJson(_html, 'gt');

    html += _html;
  }
  // if (data['text/plain']) {
  //   html += data['text/plain']?.join('');
  // }
  if (data['application/javascript']) {
    let js = data['application/javascript'];
    if (!js) {
      return ''
    }
    let script_content = typeof js === 'string' ? js : js.join('');

    if (fileId.includes('Plotly.ipynb')) {
      script_content = script_content.replace(
        'window.Plotly = Plotly',
        'if (Plotly) { window.Plotly = Plotly; }',
      );
    }
    if (fileId.includes('Perspective.ipynb')) {
      script_content = script_content.replace(
        'window.perspective = perspective',
        'if (perspective) { window.perspective = perspective; }',
      );
      // script_content = script_content.replace(
      //  "window.requirejs.config({'packages': {}, 'paths': {'perspective': 'https://cdn.jsdelivr.net/npm/@finos/perspective@2.9.0/dist/cdn/perspective', 'perspective-worker': 'https://cdn.jsdelivr.net/npm/@finos/perspective@2.9.0/dist/cdn/perspective.worker', 'perspective-viewer': 'https://cdn.jsdelivr.net/npm/@finos/perspective-viewer@2.9.0/dist/cdn/perspective-viewer', 'perspective-viewer-datagrid': 'https://cdn.jsdelivr.net/npm/@finos/perspective-viewer-datagrid@2.9.0/dist/cdn/perspective-viewer-datagrid', 'perspective-viewer-d3fc': 'https://cdn.jsdelivr.net/npm/@finos/perspective-viewer-d3fc@2.9.0/dist/cdn/perspective-viewer-d3fc', 'tabulator': 'https://cdn.jsdelivr.net/npm/tabulator-tables@6.3.1/dist/js/tabulator.min', 'moment': 'https://cdn.jsdelivr.net/npm/luxon/build/global/luxon.min'}, 'shim': {}});",
      //  "window.requirejs.config({'packages': {}, 'paths': {'perspective': 'https://cdn.holoviz.org/panel/1.7.2/dist/bundled/perspective/@finos/perspective@3.6.1/dist/cdn/perspective.js', 'perspective-worker': '', 'perspective-viewer': 'https://cdn.holoviz.org/panel/1.7.2/dist/bundled/perspective/@finos/perspective-viewer@3.6.1/dist/cdn/perspective-viewer.js', 'perspective-viewer-datagrid': 'https://cdn.holoviz.org/panel/1.7.2/dist/bundled/perspective/@finos/perspective-viewer-datagrid@3.6.1/dist/cdn/perspective-viewer-datagrid.js', 'perspective-viewer-d3fc': 'https://cdn.holoviz.org/panel/1.7.2/dist/bundled/perspective/@finos/perspective-viewer-d3fc@3.6.1/dist/cdn/perspective-viewer-d3fc.js', 'tabulator': 'https://cdn.jsdelivr.net/npm/tabulator-tables@6.3.1/dist/js/tabulator.min', 'moment': 'https://cdn.jsdelivr.net/npm/luxon/build/global/luxon.min'}, 'shim': {}});\n",
      // )
    }
    script_content = removeComments(script_content);
    script_content = prettier.format(script_content, {semi: true, parser: "babel"});
    let uuid = crypto.randomUUID();
    html += `
    <div id="${uuid}" class="jupyter-widgets jp-OutputArea-output jp-OutputArea-executeResult">\n
      <component :is="'script'" type="text/javascript">\n
        ${script_content}\n
      </component>\n
    </div>
    `;
  }

  /* application/vnd.jupyter.widget-view+json */
  let widgetData = data[WIDGET_VIEW_MIMETYPE];
  let widgetStateIds = new Set(Object.keys(widgetState?.state ?? {}));
  if (widgetData && widgetStateIds.has(widgetData.model_id)) {
    let uuid = crypto.randomUUID();
    html += `
    <div id="${uuid}" class="jupyter-widgets jp-OutputArea-output jp-OutputArea-executeResult">\n
      <component :is="'script'" type="text/javascript">\n
        var element = document.getElementById('${uuid}');\n
      </component>\n
      <component :is="'script'" type="application/vnd.jupyter.widget-view+json">\n
        ${JSON.stringify(widgetData)}\n
      </component>\n
    </div>
    `;
  }
  return html;
}

function cellToMarkdown(cell, md, env) {
    let mdContent = extractCellSource(cell)
    return md.render(mdContent, env)
}

function cellToRawCode(cell, md, env) {
    let mdContent = `\`\`\`\n${extractCellSource(cell)}\n\`\`\`\n`;
    return md.render(mdContent, env)
}

function cellToIpynbDemo(cell, md, widgetState, fileId) {
  let source = cell.source.join('')
  let code
  if (source.startsWith('##controls')) {
    code = {
      vue: '',
      setup: source,
    }
  }

  let widgetHtml = []
  let _out;
  try {
    let widgetHtmls = []
    cell.outputs.forEach(output => {
      _out = output;
      let output_type = output.output_type;
      if (output_type === 'stream') {
        if (output.name === 'stderr') {
          console.warn('cellToIpynbDemo: ignore cell stream stderr');
          return '';
        }
        if (!output.text) {
          console.warn('cellToIpynbDemo: cell output text is empty')
          return '';
        }
        code = JSON.parse(output.text[0]);
      } else if (output_type === 'display_data' || output_type === 'execute_result') {
        // widgetHtmls.push(widgetOutputHtml(output, widgetState))
        widgetHtmls.push(widgetOutputHtml(output, widgetState, fileId))
      }
    });
    widgetHtml = widgetHtmls.join('\n')
    if (!widgetHtml) {
      console.info(`widgetHtml is empty, code ${code}`)
    }
  } catch (e) {
    // for empty ipynb cell
    if (_out && _out.text) {
      console.error(`gen cellToIpynbDemo failed, ${_out.text[0]}`);
    }
    console.error(e)
    console.error(`gen cellToIpynbDemo end`);
    return ''
  }
  if (!code) {
    return '';
  }
  const { vue, setup} = code;
  if (!!!vue) {
    console.info('');
  }
  let vueHtml = !! vue ? md.render(`\`\`\`vue\n${vue}\n\`\`\`\n`) : '';
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

    <noscript>
      ${vueHtml}\n
      <hr/>
      ${setupHtml}\n
    </noscript>
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
            demosMarkdown += cellToIpynbDemo(cell, md, widgetState, fileId)
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

      /*
      <component :is="'script'" src="${base}require.min.js"></component>
      <component :is="'script'" src="${base}html-manager.min.js"></component>\n

      <component :is="'script'" src="https://cdn.holoviz.org/panel/1.6.3/dist/bundled/reactiveesm/es-module-shims@%5E1.10.0/dist/es-module-shims.min.js"></component>\n
      <component :is="'script'" src="https://cdn.bokeh.org/bokeh/release/bokeh-3.7.2.min.js"></component>\n
      <component :is="'script'" src="https://cdn.bokeh.org/bokeh/release/bokeh-gl-3.7.2.min.js"></component>\n
      <component :is="'script'" src="https://cdn.bokeh.org/bokeh/release/bokeh-widgets-3.7.2.min.js"></component>\n
      <component :is="'script'" src="https://cdn.bokeh.org/bokeh/release/bokeh-tables-3.7.2.min.js"></component>\n
      <component :is="'script'" src="https://cdn.holoviz.org/panel/1.6.3/dist/panel.min.js"></component>\n
      <component :is="'script'" src="https://cdn.jsdelivr.net/npm/@bokeh/jupyter_bokeh@^4.0.5/dist/index.js"></component>\n
      */
      let scripts = ''
      if (fileId.includes('CodeEditor.ipynb')) {
        scripts = `<component :is="'script'" src="https://cdn.jsdelivr.net/npm/ace-builds@1.4.11/src-min-noconflict/ace.js"></component>`;
      } else if (fileId.includes('JSONEditor.ipynb')) {
        scripts = `<component :is="'script'" src="https://cdn.jsdelivr.net/npm/jsoneditor@10.0.1/dist/jsoneditor.min.js"></component>`;
      } else if (fileId.includes('ECharts.ipynb')) {
        scripts = `<component :is="'script'" src="https://cdn.holoviz.org/panel/1.6.3/dist/bundled/echarts/echarts@5.4.1/dist/echarts.min.js"></component>`;
      } else if (fileId.includes('Perspective.ipynb')) {
        scripts = `
<component :is="'script'" src="https://cdn.holoviz.org/panel/1.6.3/dist/bundled/perspective/@finos/perspective@2.9.0/dist/cdn/perspective.js" type="module"></component>
<component :is="'script'" src="https://cdn.holoviz.org/panel/1.6.3/dist/bundled/perspective/@finos/perspective-viewer@2.9.0/dist/cdn/perspective-viewer.js" type="module"></component>
<component :is="'script'" src="https://cdn.holoviz.org/panel/1.6.3/dist/bundled/perspective/@finos/perspective-viewer-datagrid@2.9.0/dist/cdn/perspective-viewer-datagrid.js" type="module"></component>
<component :is="'script'" src="https://cdn.holoviz.org/panel/1.6.3/dist/bundled/perspective/@finos/perspective-viewer-d3fc@2.9.0/dist/cdn/perspective-viewer-d3fc.js" type="module"></component>
<component :is="'script'" type="module">
    import perspective from "https://cdn.holoviz.org/panel/1.6.3/dist/bundled/perspective/@finos/perspective@2.9.0/dist/cdn/perspective.js";
    window.perspective = perspective;
</component>
<component :is="'script'" type="module">
    import perspective_viewer from "https://cdn.holoviz.org/panel/1.6.3/dist/bundled/perspective/@finos/perspective-viewer@2.9.0/dist/cdn/perspective-viewer.js";
    window.perspective_viewer = perspective_viewer;
</component>
        `;
      }

      /*
      <!-- Load mathjax
      1. load_libs中通过require(["autoLoad"], function(renderMathInElement) { window.renderMathInElement = renderMathInElement
      2. panel.js class d extends l.PanelMarkupView { render()调用renderMathInElement渲染公式
      3. 第一个cell的load_libs不加载autoLoad导致renderMathInElement一直空，导致渲染失败
      <component :is="'script'" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/latest.js?config=TeX-AMS_CHTML-full,Safe"></component>
      <component :is="'script'" type="text/x-mathjax-config">
          init_mathjax = function() {
              console.info('xxx');
              if (window.MathJax) {
                  console.info('yyy');
                  MathJax.Hub.Config({
                      TeX: {
                          equationNumbers: {
                          autoNumber: "AMS",
                          useLabelIds: true
                          }
                      },
                      tex2jax: {
                          inlineMath: [ ['$','$'], ["\\(","\\)"] ],
                          displayMath: [ ['$$','$$'], ["\\[","\\]"] ],
                          processEscapes: true,
                          processEnvironments: true
                      },
                      displayAlign: 'center',
                      CommonHTML: {
                          linebreaks: {
                          automatic: true
                          }
                      }
                  });

                  MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
              }
          };
          init_mathjax();
      </component>
      -->
      <!-- End of mathjax configuration -->
      */

      return `
      ${scripts}\n
      <component :is="'script'" src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.1.10/require.min.js"></component>

      <component :is="'script'" type="text/javascript">
      (function() {
          console.info('addWidgetsRenderer');
          function addWidgetsRenderer() {
              var mimeElement = document.querySelector('script[type="application/vnd.jupyter.widget-view+json"]');
              var scriptElement = document.createElement('script');
              scriptElement.setAttribute('data-jupyter-widgets-cdn-only', '');

              var widgetRendererSrc = 'https://unpkg.com/@jupyter-widgets/html-manager@*/dist/embed-amd.js';

              var widgetState;

              /* Fallback for older version: */
              try {
                  widgetState = mimeElement && JSON.parse(mimeElement.innerHTML);
                  if (widgetState && (widgetState.version_major < 2 || !widgetState.version_major)) {
                      var widgetRendererSrc = 'https://unpkg.com/@jupyter-js-widgets@*/dist/embed.js';
                  }
              } catch (e) {};

              scriptElement.src = widgetRendererSrc;
              document.body.appendChild(scriptElement);
          }

          document.addEventListener('DOMContentLoaded', addWidgetsRenderer);
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', addWidgetsRenderer);
          } else {
            addWidgetsRenderer();
          }
      }());
      </component>\n

      ${demosMarkdown}\n
      ${_widgetStateHtml}\n
      `;
    },
  } as ContainerOpts)
}
