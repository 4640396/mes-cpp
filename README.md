# MES C++ 源码分析入口

本轮范围为 `fw_cpp_sqx`，未修改原源码，也未运行 MES 或连接数据库。

- **[可浏览的统一总览](index.html)**：当前阶段、全部产物入口、本体解释和可搜索的已核实事实。
- **[当前进度、本体说明与后续队列](PROGRESS.md)**
- **[领域覆盖与缺口](domain-coverage.md)**：按41个目录区分索引、片段、完整阅读及相关报告，不把数量当完成率。
- **[普通派工深入追踪](dispatch-deep.md)**：完整候选筛选、规则顺序、配置生效与 dispatcher 空实现纠正。
- [队列存储深入追踪](queue-storage-deep.md)：暂停 getter 的空视图与回退、关系表差异保存、缺失的 BO/DO 桥接。
- [派工候选路径对照](dispatch-variants-deep.md)：普通、暂停批次与三类耐用品的 SQL 条件和规则过滤差异。
- [FlowBatch 深入追踪](flowbatch-deep.md)：区别于普通 dispatcher 的真实 SQL、setLots 的组批口径与双向关联。
- [设备资源深入追踪](machine-resource-deep.md)：条件可用、subLotType 集合、配置禁用入口与 FlowBatch 存储模式。
- [配方选择深入追踪](recipe-selection-deep.md)：设备基础参数、默认及专用参数覆盖，带 Lot 的限制及例外分支。
- [实体限制查询深入追踪](inhibit-query-deep.md)：阈值决定的两条数据库路径、时间和批次类型差异、格式参数疑点。
- [事件待处理链深入追踪](event-delivery-deep.md)：无订阅早退、随机分流、FIFO 集合、清理与具体事件负载。
- [数据采集深入追踪](data-collection-deep.md)：版本配置入口、输入校验、派生统计与结果汇总。
- [工序采集快照](dc-snapshot-deep.md)：定义 getter 的首项选择、开工快照与局部项目更新。
- [生成持久化模板族候选](persistence-families.md)：按角色和操作导航变体，结构化成员见 persistence-families.json；同形不等于语义等价。
- [生成删除模式](persistence-delete-deep.md)：七种代表的对象key、集合key与嵌套序号范围。
- [集合持久化](persistence-collections-deep.md)：字典/序列/嵌套序列的加载、差异检测、Shift/Travel 与保存。
- [SQL计划框架](persistence-planner-deep.md)：配置成本、编辑图搜索/回溯，以及模板定义单列登记。
- [载具装卸](cassette-loading-deep.md)：位置、物料集合、Lot计数、反向引用与逐片转盒。
- [拆批与成员转移](lot-split-deep.md)：多输入与首子批扩展差异、数量更新及关联复制。
- [合批与子批初始化](lot-join-init-deep.md)：joinAll_into、Lot初始化来源及Emptied的家族/请求影响。
- [计划与派工时间](planning-deep.md)：Lot计划、工序计划和EDD数据库排序键的不同层次。
- [生产请求](product-request-deep.md)：计划/生产双状态、LotFamily联动、请求数量与完成判定边界。
- [认证与权限](auth-privileges-deep.md)：本地认证、密码有效期、组关系、权限合并及真实授权边界。
- [BOM与零部件](bom-deep.md)：清单配置、产品规格关联与SQL保存，区分实际领用消耗。
- [方法级深入审查状态](semantic-coverage.json)：索引、采样证据与完整方法体审查分开记录；项目目标仍在进行。
- [路线前移分析](route-movement.md)：正常前移的实际修改点、指定位置、分支路线的证据范围。
- [返工计数规则](rework.md)：晶圆级计数、返回点 key、上限判定和未知事务边界。
- [设备、配方、载具与派工规则](equipment-recipe.md)：设备状态、配方选择、载具暂停、FIFO 与入队分支及其覆盖边界。
- [本体定义](ontology.json) 与 [已核实事实集](verified-facts.json)：实体类型、关系约束、条件及源码证据。
- [本体的含义与当前覆盖](ontology.md)：区分模型规则、已核实事实和全量候选索引。
- [可搜索业务地图](business-map.html)：搜索目录、IDL 接口、业务分类与数据库表引用。
- [业务地图文字版](business-map.md) 与 [结构化数据](business-map.json)：41 个有文件目录、220 个接口定义候选及其同名实现目录候选。
- [按表反查源码](table-access.json)：689 个非 # 表名候选和 159 个预编译符号对应的 SQL 操作位置。
- [Doxygen 源码文档](doxygen/html/index.html)：类、接口、文件、源码及解析得到的引用关系。
- [源码盘点](inventory.md)：各模块文件数量、提取口径和限制。
- [批次暂停样板](lot-hold.md)：已核实的分支、数据操作和待补证部分。
- [批次—流程—工序规则](lot-process.md)：多维状态、显示优先级、加工状态转换和责任工序选择。
- [批次与工序对象关系图](../../.archify/architecture-mes-lot-process-20261028-001/lot-process.html)：当前工序、流程上下文、前道工序与工艺定义。
- [交互架构图](../../.archify/architecture-mes-lot-hold-20261028-001/lot-hold.html)：暂停状态和暂停记录两条独立路径。
- [SQL 索引](sql-index.json)：去注释后提取的静态 SQL 操作候选，保留文件和行号。
- [缺失 include 清单](missing-includes.json)：仅在 `fw_cpp_sqx` 内按文件名检查，不代表其他项目或 SDK 中不存在。
- [跨项目依赖检索](dependency-audit.json)：三个源项目内关键头文件与 IDL 的查找结果和范围。
- [文件快照](inventory.json)：每个源文件的 SHA-256。
- [Doxygen 警告](doxygen-warnings.log)：解析覆盖限制。

## 重新生成

在 `D:/works/cxmt/xmes` 执行：

```powershell
node analysis/mes-cpp/extract.mjs
& 'C:\Program Files\doxygen\bin\doxygen.exe' analysis/mes-cpp/Doxyfile
```

Doxygen 配置启用了 SQX 到 C++ 的扩展名映射、源码浏览、XML、调用及被调用图。缺少头文件、生成文件和宏定义时，部分实现只能显示为文件级函数，不能据此断言接口与实现已经自动关联。Graphviz 图设置了节点上限，大型关系图可能被截断。

本轮没有运行 graphify。现有交付将人工核实的业务事实与文本提取的结构图分层保存，不把候选匹配当作语义证明。补齐生成头文件和 SDK 可进一步提高解析覆盖。当前目录不是 Git 仓库，不能给出可验证的提交版本；本地文件哈希用于标识输入。

## 本轮生成验证

Doxygen 退出码为 0，HTML 和 XML 首页存在，生成 19,707 个 SVG 文件；日志包含 30,595 次 warning。退出成功只说明文档生成完成，不代表语义解析完整。SQX/IDL 以及缺失声明导致的匹配警告需持续核实。

SQL 索引包含 7,853 条操作候选、689 个非 # 表名候选及 159 个预编译符号；已修正早期 UPDATE SET/FOR UPDATE WITH 误识别。未把表名候选与实际数据库 schema 对照验证。四张架构图通过 Archify 自动生成和浏览器检查，未进行截图视觉审查；图中证据为本地源码核实及文档引用，未执行 Git 提交级来源验证。

## 查询与交付

- [综合报告](SUMMARY.md)、[全领域目录](domain-catalog.md)、[重建说明](REBUILD.md)。
- [交互查询](explorer.html)：方法定义、表访问和业务事实邻域。
- [全量结构图](source-graph.json)：方法、接口、SQL 与文件关系，严格区分候选等级。
- [验证结果](validation.json)：全量端点和类型、证据哈希、SQL 真实语句回归、本地链接与四张图回执。
- `node analysis/mes-cpp/rebuild.mjs` 重建；附加 `--doxygen` 重新生成 Doxygen。

## 轻量本体约定

实际业务实体及关系约束以 ontology.json 的 entityTypes / relationTypes 为准，包括 BusinessObject、Method、Rule、Collection、Table 等。sourceGraphModel 单独定义文本结构图，不能把两种类型系统混用。

已核实事实的关系保存来源路径、line/end_line、文件及片段哈希；条件分支写入 condition。文本 SQL 匹配保留候选等级；跨对象动态接口调用用 INVOKES_VIRTUAL_CONTRACT，不据名称自动建立确定运行目标。未知的持久化桥接、事务和部署绑定继续保留。
