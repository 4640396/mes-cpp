# 本体说明：统一源码分析的词汇和规则

这里的本体不是 MES 业务实体类本身，而是分析工具使用的模型。它回答三个问题：有什么类型的东西、允许怎样关联、凭什么相信这个关联。

## 当前本体 v0.2

| 类型 | 含义 | 例子 |
|---|---|---|
| BusinessObject | 业务对象类型，不是生产实例 | Lot、ProcessOperation |
| Interface | IDL 契约 | PosLot |
| Method | 源码方法 | beginNextProcessOperation |
| StateDimension | 业务状态维度 | HoldState、ProcessState |
| Table / Column | SQL 存储名称 | FRLOT、LOT_HOLD_STATE |
| SourceFile | 证据载体 | plot.cpp |
| Collection | BO 或 DO 侧的集合成员；两侧不自动等同 | theQueuedMachines、theDB_QueuedMachines |
| Rule | 方法级条件和结果，不是自动执行引擎 | 暂停时普通队列 getter 返回空视图 |

关系约束例如：Method CALLS Method、BusinessObject HAS_STATE StateDimension、Method RETURNS_REFERENCE BusinessObject、Table STORES Column。只有符合约束的两端才能建立对应关系。当前定义了可供后续使用的类型和关系，不代表每类已填满实例。

## 从规则到事实

- 本体规则：CALLS 的两端必须是方法。
- 具体事实：PosLot 的暂停方法，在不在库时调用基础 Lot 的暂停方法。
- 证据：plot.cpp:6606–6617。
- 限制：这里只证明源码分支存在，不证明某个实际批次运行时走过它。

`ontology.json` 是规则；`verified-facts.json` 是少量经核实的具体事实；`business-map.json` 和 SQL 索引是大范围候选材料。三者用途不同，名称匹配不能直接当作调用事实。

当前本体词汇含 30 个业务对象概念，事实集有 485 个节点、403 条关系。来源文件和片段哈希锁定于 evidence-lock.json，防止源码变化后静默沿用旧结论。事件基类的虚调用使用 INVOKES_VIRTUAL_CONTRACT，避免冒充实际覆写调用目标。

另有全量结构图 source-graph.json：39,537 节点、85,111 条关系，包含 Module、SourceFile、Implementation、Interface、Method、SQLStatement、Table，类型约束记录在 ontology.json 的 sourceGraphModel。方法 ID 包含源文件、起点和签名哈希；它是文本定义索引，不是编译器统一符号 ID。结构边明确区分文本事实、名称候选和表引用候选，不自动生成 CALLS。

尚未接入 graphify 或 OWL 推理，不是完整 MES 生产实例本体。业务事实集中的部分早期方法 ID 是样板别名，进一步用于代码变更追踪时需迁移为全限定签名，不可将其用作全项目重载解析键。

## 后续扩展原则

1. 按源码证据增加设备、配方、工艺规格、晶圆、载具等对象，而非先凭行业常识填满模型。
2. 将读写索引逐条核实后提升为事实，保留条件和来源。
3. 对宏、动态分派、外部交易与事务边界保留未知，不通过图谱推断自动补齐。
4. 新增 IDL 后补契约和继承；不把接口声明视为运行行为。
