# LLMs辅助开发vuepy组件：以vleaflet为例

目标：基于 Vue.py 和 ipyleaflet 开发的响应式地图组件库 [vleaflet](/vleaflet/overview)，在 Jupyter 中实现交互式地图。

在 vleaflet 的开发中我们尝试使用 LLMs 来加速整个开发过程。

## 使用 LLMs 学习 ipyleaflet

**目的**：快速了解 ipyleaflet 的功能和用法。  
**Prompt**：写一个ipyleaflet的学习教程  
**回答**：
> IPyLeaflet 交互式地图学习教程
> IPyLeaflet 是一个基于 Leaflet.js 的 Jupyter 交互式地图库，非常适合在 Notebook 环境中进行地理空间数据可视化。本教程将从基础到高级功能逐步介绍。
> 
> 1. 环境安装与配置
> 安装 IPyLeaflet
> ```bash
> pip install ipyleaflet
> JupyterLab 用户需要额外安装扩展
> ```
> ```bash
> jupyter labextension install @jupyter-widgets/jupyterlab-manager jupyter-leaflet
> ```
> 验证安装
> ```python
> import ipyleaflet
> print(ipyleaflet.__version__)
> ```
> 2. 基础地图创建
> 创建第一个地图
> ```python
> from ipyleaflet import Map
> # 创建地图，设置中心点和缩放级别
> m = Map(center=(39.9042, 116.4074), zoom=10)  # 北京坐标
> m
> ```
> 3. 底图类型与切换
> IPyLeaflet 内置多种底图：
> 
> ```python
> from ipyleaflet import basemaps, basemap_to_tiles
> 
> # 查看所有可用底图
> print([b for b in dir(basemaps) if not b.startswith('_')])
> 
> # 使用不同底图
> m = Map(
>     center=(34.0522, -118.2437),  # 洛杉矶
>     zoom=10,
>     basemap=basemap_to_tiles(basemaps.Esri.WorldImagery)  # 卫星影像
> )
> m
> ```
> 常用底图类型
> 底图名称 | 描述
> -- | --
> OpenStreetMap.Mapnik | 标准OSM地图
> Esri.WorldStreetMap | ESRI街道地图
> Esri.WorldImagery | 卫星影像
> Stamen.Terrain | 地形图
> CartoDB.Positron | 浅色主题
> 4. 标记与矢量图形
> 添加标记
> ```python
> from ipyleaflet import Marker
> 
> m = Map(center=(51.5074, -0.1278), zoom=12)  # 伦敦
> 
> # 简单标记
> marker = Marker(location=(51.5074, -0.1278))
> m.add_layer(marker)
> 
> # 可拖动标记
> draggable_marker = Marker(
>     location=(51.51, -0.1),
>     draggable=True,
>     title="拖动我!"
> )
> m.add_layer(draggable_marker)
> 
> m
> ```
> 添加矢量图形
> ```python
> from ipyleaflet import Circle, Rectangle, Polygon, Polyline
> 
> # 圆形
> circle = Circle(
>     location=(51.5074, -0.1278),
>     radius=1000,  # 单位：米
>     color="blue",
>     fill_color="blue",
>     fill_opacity=0.2
> )
> 
> # 矩形
> rectangle = Rectangle(
>     bounds=((51.5, -0.14), (51.52, -0.1)),
>     color="red",
>     fill_color="red",
>     fill_opacity=0.2
> )
> 
> # 多边形
> polygon = Polygon(
>     locations=[(51.51, -0.12), (51.51, -0.13), (51.50, -0.13)],
>     color="green",
>     fill_color="green",
>     fill_opacity=0.3
> )
> 
> # 折线
> polyline = Polyline(
>     locations=[(51.51, -0.12), (51.50, -0.10), (51.49, -0.12)],
>     color="purple"
> )
> 
> m.add_layer(circle)
> m.add_layer(rectangle)
> m.add_layer(polygon)
> m.add_layer(polyline)
> 
> m
> ```
> 5. 交互功能
> 图层控制
> ```python
> from ipyleaflet import LayersControl
> 
> m.add_control(LayersControl())
> m
> ```
> 绘图工具
> ```python
> from ipyleaflet import DrawControl
> from ipywidgets import Output
> 
> draw_control = DrawControl()
> m.add_control(draw_control)
> 
> output = Output()
> display(m, output)
> 
> def handle_draw(self, action, geo_json):
>     with output:
>         print(f"绘制动作: {action}")
>         print(f"GeoJSON 数据: {geo_json}")
> 
> draw_control.on_draw(handle_draw)
> ```
> 测量工具
> ```python
> from ipyleaflet import MeasureControl
> 
> measure = MeasureControl(
>     position='bottomleft',
>     active_color='orange',
>     primary_length_unit='kilometers'
> )
> m.add_control(measure)
> m
> ```
> 6. 高级功能
> 热力图
> ```python
> import numpy as np
> from ipyleaflet import Heatmap
> 
> # 生成随机数据
> np.random.seed(42)
> n = 100
> lat = np.random.uniform(39.8, 40.0, n)
> lon = np.random.uniform(116.3, 116.5, n)
> weight = np.random.uniform(0, 1, n)
> 
> heatmap = Heatmap(
>     locations=list(zip(lat, lon)),
>     weights=weight,
>     radius=15,
>     blur=10,
>     gradient={0.4: 'blue', 0.6: 'lime', 1: 'red'}
> )
> 
> m = Map(center=(39.9, 116.4), zoom=11)
> m.add_layer(heatmap)
> m
> ```
> GeoJSON 数据可视化
> ```python
> from ipyleaflet import GeoJSON
> import json
> 
> # 示例GeoJSON数据
> geojson_data = {
>     "type": "FeatureCollection",
>     "features": [
>         {
>             "type": "Feature",
>             "properties": {"name": "区域A"},
>             "geometry": {
>                 "type": "Polygon",
>                 "coordinates": [[
>                     [116.3, 39.9], [116.35, 39.9], 
>                     [116.35, 39.85], [116.3, 39.85], [116.3, 39.9]
>                 ]]
>             }
>         }
>     ]
> }
> 
> geo_json = GeoJSON(
>     data=geojson_data,
>     style={
>         'color': 'blue',
>         'opacity': 1,
>         'weight': 1.9,
>         'fillOpacity': 0.5
>     },
>     hover_style={
>         'color': 'red',
>         'fillOpacity': 0.8
>     }
> )
> 
> m = Map(center=(39.875, 116.325), zoom=12)
> m.add_layer(geo_json)
> m
> ```
> 7. 实战项目：城市POI可视化
> ```python
> from ipyleaflet import Map, Marker, MarkerCluster, basemaps
> import pandas as pd
> from ipywidgets import HTML
> 
> # 示例数据 - 北京景点
> data = {
>     "name": ["天安门", "故宫", "颐和园", "长城", "天坛"],
>     "lat": [39.9047, 39.9163, 39.9999, 40.3596, 39.8822],
>     "lon": [116.3912, 116.3972, 116.2754, 116.0204, 116.4063],
>     "type": ["历史", "历史", "公园", "历史", "历史"]
> }
> 
> df = pd.DataFrame(data)
> 
> # 创建地图
> m = Map(
>     center=(39.9, 116.4),
>     zoom=11,
>     basemap=basemaps.OpenStreetMap.Mapnik
> )
> 
> # 创建标记集群
> marker_cluster = MarkerCluster(
>     markers=[
>         Marker(
>             location=(row['lat'], row['lon']),
>             draggable=False,
>             popup=HTML(f"<b>{row['name']}</b><br>类型: {row['type']}")
>         ) for _, row in df.iterrows()
>     ],
>     name='北京景点'
> )
> 
> m.add_layer(marker_cluster)
> m.add_control(LayersControl())
> m
> ```
> 8. 保存与导出
> 保存为HTML
> ```python
> m.save('beijing_poi.html', title='北京景点地图')
> ```
> 截图功能
> ```python
> from IPython.display import display
> import time
> 
> # 等待地图加载
> time.sleep(3)
> 
> # 截图
> m.get_png()
> ```
> 
> 通过本教程，你应该已经掌握了 IPyLeaflet 的核心功能。建议从简单地图开始，逐步尝试更复杂的可视化效果。

<!-- https://chat.deepseek.com/a/chat/s/4b264807-8ec4-4097-863e-8746999409a5 -->

## 为所有 Layers 和 Controls 编写 vuepy 组件

### 第一步

**目的**：列出 ipyleaflet 的所有 `Layers` 和 `Controls` 用于后续的提示词。  
**Prompt**: 列出ipyleaflet的所有Layer类  
**回答**：
> TileLayer, ImageOverlay, VideoOverlay, LocalTileLayer, Marker, MarkerCluster, Polyline, Polygon, Rectangle, Circle, CircleMarker, GeoJSON, Choropleth, LayerGroup, Heatmap, DivIcon, Popup, AntPath, Velocity, WMSLayer, WMTSLayer, FullScreenControl, MeasureControl, SplitMapControl
<!-- https://chat.deepseek.com/a/chat/s/a5a7d4da-a6a0-4767-bac7-a73665448352 -->


### 第二步
**目的**：生成 vue 组件文件，主要用于接口定义和代码补全  
**Prompt**:
> 参考以下组件，为ipyleaflet的TileLayer, ImageOverlay, VideoOverlay, LocalTileLayer, Marker, MarkerCluster, Polyline, Polygon, Rectangle, Circle, CircleMarker, GeoJSON, Choropleth, LayerGroup, Heatmap, DivIcon, Popup, AntPath, Velocity, WMSLayer, WMTSLayer, FullScreenControl, MeasureControl, SplitMapControl编写组件
> ```vue
> <template>
>   <div></div>
> </template>
> <script>
> export default {
>   name: 'VlImageOverlay',
>   props: {
>     // Url to the local or remote image file.
>     url: {
>       type: String,
>       required: true,
>       default: ''
>     },
>     // SW and NE corners of the image.
>     bounds: {
>       type: Array,
>       required: true,
>       default: [0, 0],
>       validator: (value) => value.length === 2 && value.every(coord => Array.isArray(coord) && coord.length === 2)
>     },
>     // layer name
>     name: {
>       type: String,
>       default: ''
>     },
>     // Image attribution.
>     attribution: {
>       type: String,
>       default: ''
>     },
>     alt: {
>       type: String,
>       default: ''
>     },
>   }
> }
> </script>
> ```
**回答**：
> Here's a component for ipyleaflet's ImageService based on the provided VlImageOverlay component structure
> ```vue
> <template>
>   <div>
>     <!-- The component will be rendered by ipyleaflet -->
>   </div>
> </template>
> 
> <script>
> export default {
>   name: 'VlImageService',
>   props: {
>     // URL to the ArcGIS ImageService
>     url: {
>       type: String,
>       required: true,
>       default: '',
>       validator: (value) => value.startsWith('http') || value.startsWith('https')
>     },
>     // Name of the layer
>     name: {
>       type: String,
>       default: 'Image Service'
>     },
>     // Image attribution
>     attribution: {
>       type: String,
>       default: ''
>     },
>     // Whether the layer is visible
>     visible: {
>       type: Boolean,
>       default: true
>     },
>     // Opacity of the layer (0-1)
>     opacity: {
>       type: Number,
>       default: 1,
>       validator: (value) => value >= 0 && value <= 1
>     },
>     // Additional parameters for the ImageService
>     params: {
>       type: Object,
>       default: () => ({})
>     },
>     // Pixel size for the exported image
>     pixelSize: {
>       type: Object,
>       default: null,
>       validator: (value) => value === null || (value.width && value.height)
>     },
>     // Time range for temporal data
>     time: {
>       type: Array,
>       default: null,
>       validator: (value) => value === null || value.length === 2
>     },
>     // Band IDs to display
>     bandIds: {
>       type: Array,
>       default: null
>     },
>     // Rendering rule for the image
>     renderingRule: {
>       type: Object,
>       default: null
>     },
>     // Mosaic rule for the image
>     mosaicRule: {
>       type: Object,
>       default: null
>     },
>     // Whether to use CORS
>     useCors: {
>       type: Boolean,
>       default: true
>     }
>   },
>   methods: {
>     // You can add methods here to interact with the ImageService
>     // For example: refresh, update parameters, etc.
>     refresh() {
>       this.$emit('refresh');
>     },
>     updateParams(newParams) {
>       this.$emit('update:params', { ...this.params, ...newParams });
>     }
>   }
> }
> </script>
> ```
> TileLayer
> ```vue
> <template>
>   <div>
> ...
>  
> ```

将生成的代码保存到vue文件中，文件目录结果如下：
```bash
vleaflet
├── components
    ├── Controls
    │   ├── FullScreenControl.vue
    │   ├── GeomanDrawControl.vue
    │   ├── LayersControl.vue
    │   ├── LegendControl.vue
    │   ├── MeasureControl.vue
    │   ├── ScaleControl.vue
    │   ├── SearchControl.vue
    │   ├── SplitMapControl.vue
    │   ├── WidgetControl.vue
    │   └── ZoomControl.vue
    ├── Layers
    │   ├── AntPath.vue
    │   ├── AwesomeIcon.vue
    │   ├── Choropleth.vue
    │   ├── Circle.vue
    │   ├── CircleMarker.vue
    │   ├── DivIcon.vue
    │   ├── GeoData.vue
    │   ├── GeoJson.vue
    │   ├── Heatmap.vue
    │   ├── Icon.vue
    │   ├── ImageOverlay.vue
    │   ├── ImageService.vue
    │   ├── LayerGroup.vue
    │   ├── LocalTileLayer.vue
    │   ├── MagnifyingGlass.vue
    │   ├── Marker.vue
    │   ├── MarkerCluster.vue
    │   ├── Polygon.vue
    │   ├── Polyline.vue
    │   ├── Popup.vue
    │   ├── Rectangle.vue
    │   ├── TileLayer.vue
    │   ├── VectorTileLayer.vue
    │   ├── Velocity.vue
    │   ├── VideoOverlay.vue
    │   ├── WKTLayer.vue
    │   └── WMSLayer.vue
    └── Map.vue
```

如果使用 Cursor，也可以使用如下提示词自动化该过程：
> 参考以下组件，为ipyleaflet的TileLayer, ImageOverlay, VideoOverlay, LocalTileLayer, Marker, MarkerCluster, Polyline, Polygon, Rectangle, Circle, CircleMarker, GeoJSON, Choropleth, LayerGroup, Heatmap, DivIcon, Popup, AntPath, Velocity, WMSLayer, WMTSLayer, FullScreenControl, MeasureControl, SplitMapControl编写组件，每个组件使用单独的文件保存到 @components 中，一次性生成所有组件  
> ...

<!-- https://chat.deepseek.com/a/chat/s/7900ea36-b15a-4b7a-860e-b278481553a8 -->

### 第三步

**目的**：生成组件的 python 实现  
**Prompt**:
> 参考以下组件，为ipyleaflet的TileLayer, ImageOverlay, VideoOverlay, LocalTileLayer, Marker, MarkerCluster, Polyline, Polygon, Rectangle, Circle, CircleMarker, GeoJSON, Choropleth, LayerGroup, Heatmap, DivIcon, Popup, AntPath, Velocity, WMSLayer, WMTSLayer, FullScreenControl, MeasureControl, SplitMapControl编写组件  
> ```python
> class VBox(IPywidgetsComponent):
>    def _render(self, ctx, attrs, props, params, setup_returned):
>        slots = ctx.get('slots', {})
>        return ipywui.widgets.VBox(children=slots.get('default', []), **props, **attrs, **params)
> ```
**回答**：
> ```python
> class ZoomControl(IPyLeafletComponent):
>     def _render(self, ctx, attrs, props, params, setup_returned):
>         return ipyleaflet.ZoomControl(**props, **attrs)
> 
> class ScaleControl(IPyLeafletComponent):
>     def _render(self, ctx, attrs, props, params, setup_returned):
>         return ipyleaflet.ScaleControl(**props, **attrs)
> ...
>   
> ```

将生成的代码保存到`comps.py`中。  

如果使用 Cursor，也可以使用如下提示词自动化该过程：
> 参考以下组件，为ipyleaflet的TileLayer, ImageOverlay, VideoOverlay, LocalTileLayer, Marker, MarkerCluster, Polyline, Polygon, Rectangle, Circle, CircleMarker, GeoJSON, Choropleth, LayerGroup, Heatmap, DivIcon, Popup, AntPath, Velocity, WMSLayer, WMTSLayer, FullScreenControl, MeasureControl, SplitMapControl编写组件，每个组件使用单独的文件保存到 @comps.py 中，一次性生成所有组件  
> ...

生成的代码还需要经过一些修改，如：添加组件注册代码、attr参数处理、slot处理等。

之后就是调试过程，调试的示例代码也可以借助 LLMs 自动生成，不再一一列举。


## 根据vue文件生成组件文档

<!-- https://chat.deepseek.com/a/chat/s/c6aea2a8-f975-4c1c-89d1-ddfb682f9c39 -->

**目的**：根据组件的vue文件生成组件文档  
**Prompt**：
> src/vleaflet/components/Layers/AntPath.vue
> ```vue
> <template>
>   <div>
>     <slot name="popup"></slot>
>   </div>
> </template>
> 
> <script>
> // https://ipyleaflet.readthedocs.io/en/latest/layers/antpath.html
> export default {
>   name: 'VlAntPath',
>   props: {
>     // Locations through which the ant-path is going.
>     locations: {
>       type: Array,
>       required: true,
>       validator: (value) => value.every(coord => Array.isArray(coord) && coord.length === 2)
>     },
>     // layer name
>     name: {
>       type: String,
>       default: ''
>     },
>     // Type of shape to use for the ant-path. Possible values are ‘polyline’, ‘polygon’, ‘rectangle’ and ‘circle’.
>     use: {
>       type: String,
>       validator: (value) => ['polyline', 'polygon', 'rectangle', 'circle'].includes(value),
>       default: 'polyline'
>     },
>     // The color of the primary dashes.
>     color: {
>       type: String,
>       default: '#0000FF'
>     },
>     // Weight of the ant-path.
>     weight: {
>       type: Number,
>       default: 5
>     },
>     // Radius of the circle, if use is set to ‘circle’
>     radius: {
>       type: Number,
>       default: 10,
>     },
>     // The sizes of the animated dashes.
>     dash_array: {
>       type: String,
>       default: '10, 20'
>     },
>     // Add a delay to the animation flux.
>     delay: {
>       type: Number,
>       default: 400
>     },
>     // Whether the animation is running or not.
>     paused: {
>       type: Boolean,
>       default: false
>     },
>     // Whether the animation is going backwards or not.
>     reverse: {
>       type: Boolean,
>       default: false
>     },
>     // Whether the ant-path uses hardware acceleration.
>     hardware_accelerated: {
>       type: Boolean,
>       default: false
>     },
>     // The color of the secondary dashes.
>     pulse_color: {
>       type: String,
>       default: '#ffffff'
>     }
>   }
> }
> </script> 
> ```
> 按以下格式生成文档，按照实例给的顺序：属性、events、slots、方法。如果没有events、slots、方法也保留对应的表格
> ```markdown
> ## API
> 
> ### 属性
> 
> | 属性名    | 说明                 | 类型                                                           | 默认值 |
> | -------- | ------------------- | ---------------------------------------------------------------| ------- |
> | v-model/value | 绑定值             | ^[str]                                                      | —       |
> | desc     | 按钮文字             | ^[str]                                                         | —       |
> | icon     | 按钮图标             | ^[str]                                                         | —       |
> | type     | 类型                | ^[enum]`''\| 'success'\| 'warning'\| 'danger'\| 'info'`        | —       |
> | tooltip  | 提示信息             | ^[str]                                                         | —       |
> | disabled | 按钮是否为禁用状态     | ^[boolean]                                                     | false   |
> | style    | 自定义css样式             | ^[str]                                                         | -       |
> 
> ### Events
> 
> | 事件名 | 说明                  | 类型                                   |
> | ---   | ---                  | ---                                    |
> | click | 当按钮被点击时触发的事件 |  ^[Callable]`(button: Widget) -> None` |
> 
> ### Slots
> 
> | 插槽名   | 说明               |
> | ---     | ---               |
> | default | 自定义默认内容      |
> 
> ### 方法
> 
> | 属性名 | 说明 | 类型 |
> | --- | --- | --- |
> ```
**回答**：
> ```markdown
> ## API
> 
> ### 属性
> 
> | 属性名                | 说明                                                                 | 类型                                                           | 默认值       |
> |----------------------|--------------------------------------------------------------------|----------------------------------------------------------------|-------------|
> | locations            | Locations through which the ant-path is going                      | ^[Array]`Array<[number, number]>`                             | -           |
> | name                 | Layer name                                                        | ^[string]                                                     | ''          |
> | use                  | Type of shape to use for the ant-path                              | ^[enum]`'polyline' \| 'polygon' \| 'rectangle' \| 'circle'`   | 'polyline'  |
> | color                | The color of the primary dashes                                    | ^[string]                                                     | '#0000FF'   |
> | weight               | Weight of the ant-path                                             | ^[number]                                                     | 5           |
> | radius               | Radius of the circle, if use is set to ‘circle’                   | ^[number]                                                     | 10          |
> | dash_array           | The sizes of the animated dashes                                   | ^[string]                                                     | '10, 20'    |
> | delay                | Add a delay to the animation flux                                  | ^[number]                                                     | 400         |
> | paused               | Whether the animation is running or not                           | ^[boolean]                                                    | false       |
> | reverse              | Whether the animation is going backwards or not                   | ^[boolean]                                                    | false       |
> | hardware_accelerated | Whether the ant-path uses hardware acceleration                   | ^[boolean]                                                    | false       |
> | pulse_color          | The color of the secondary dashes                                 | ^[string]                                                     | '#ffffff'   |
> 
> ### Events
> 
> | 事件名 | 说明 | 类型 |
> | --- | --- | --- |
> 
> ### Slots
> 
> | 插槽名   | 说明               |
> | ---     | ---               |
> | popup   | 自定义弹出内容      |
> 
> ### 方法
> 
> | 属性名 | 说明 | 类型 |
> | --- | --- | --- |
> ```

如果使用 Cursor，也可以使用如下提示词自动化该过程：
> 为 @components 目录下的所有组件按以下格式生成文档，按照实例给的顺序：属性、events、slots、方法。如果没有events、slots、方法也保留对应的表格，一次性生成所有组件
> ```markdown
> ## API
> 
> ### 属性
> 
> | 属性名    | 说明                 | 类型                                                           | 默认值 |
> | -------- | ------------------- | ---------------------------------------------------------------| ------- |
> | v-model/value | 绑定值             | ^[str]                                                      | —       |
> | desc     | 按钮文字             | ^[str]                                                         | —       |
> | icon     | 按钮图标             | ^[str]                                                         | —       |
> | type     | 类型                | ^[enum]`''\| 'success'\| 'warning'\| 'danger'\| 'info'`        | —       |
> | tooltip  | 提示信息             | ^[str]                                                         | —       |
> | disabled | 按钮是否为禁用状态     | ^[boolean]                                                     | false   |
> | style    | 自定义css样式             | ^[str]                                                         | -       |
> 
> ### Events
> 
> | 事件名 | 说明                  | 类型                                   |
> | ---   | ---                  | ---                                    |
> | click | 当按钮被点击时触发的事件 |  ^[Callable]`(button: Widget) -> None` |
> 
> ### Slots
> 
> | 插槽名   | 说明               |
> | ---     | ---               |
> | default | 自定义默认内容      |
> 
> ### 方法
> 
> | 属性名 | 说明 | 类型 |
> | --- | --- | --- |
> ```
