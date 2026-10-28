# 设备资源与流程批约束深入分析

这是完整方法体的静态审阅，不代表宏展开、交易回滚或生产运行验证。来源目录均相对 fw_cpp_sqx。

## 资源状态匹配的真正含义

PosMachine_i::isSameProcessResourceStatesForSubLotType（poscimfw/pmcmg/pmc.cpp:13935–14016）逐项查找命名资源，所有要求必须成立；空要求列表返回 TRUE。它比较可用性，不是任意状态编号相等。

| 情况 | 要求 TRUE | 要求 FALSE |
|---|---|---|
| 找不到资源 | FALSE | FALSE，不能把不存在解释成不可用 |
| 条件可用状态 | subLotType 必须在允许集合中 | subLotType 必须不在允许集合中 |
| 非条件可用状态 | isMachineAvailable 为 TRUE | isMachineAvailable 为 FALSE |
| 当前状态为空 | 抛 FrameworkError | 抛 FrameworkError |

Machine_i::findProcessResourceNamed（smtchcmf/mchnmngm/machine.cpp:3986–3997）使用查找宏；具体异常与引用转换仍依赖缺失宏。

PosMachineState_i::isMachineAvailable（poscimfw/pcdmg/pmstat.cpp:853–864）读取 equipmentAvailableFlag；isConditionalAvailable（1347–1358）读取 conditionalAvailableFlag。isConditionalAvailableFor（1590–1612）只检查允许集合，不自行检查条件可用标志。因此不能把三个方法合并成同一个布尔属性。

## 允许的 subLotType 集合与配置入口

pmstat.cpp:1472–1499 的 addAvailableSubLotType 拒绝重复；1533–1560 的 removeAvailableSubLotType 对不存在项抛错，且在删除尝试前已标记对象 dirty。1642–1687 获取集合，1716–1735 清空并标记集合 dirty。是否立即落库不由 dirty 标志证明。

setEquipmentStateInfo（981–1000）明确抛错，提示该版本不支持。另一个名字带 __XXX 的方法（1838–1954）才有赋值逻辑：写入状态标志，替换转换条件、下一状态、允许 subLotType 及用户数据。转换条件的重复 checkSequence 显式拒绝；下一状态通过所有 E10 分组尝试查找。不能仅因同名语义就把公开入口与 __XXX 实现视为同一条可用调用链。其调用者、宏和部署绑定待核实。

## FlowBatchMaxCount 同时决定存储模式

pmc.cpp:21427–21536 的 addFlowBatch 在 MaxCount>0 时使用集合，否则使用单个兼容引用。该方法中没有集合大小小于 MaxCount 的比较，因此这个字段不能直接解释为“此入口保证数量上限”。已存在的同标识批次不重复添加；单引用模式已有不同有效批次时拒绝指派。

removeFlowBatch（21561–21649）在集合模式移除指定标识，并维护兼容引用为剩余首项或空；单引用模式在输入非空后清除当前关联，未显式比较输入标识与当前标识。双向 setMachine 回调及异常恢复依赖外部实现和事务，不能推定原子性。

allFlowBatches（21674–21706）集合为空时还会回退到兼容单引用；findFlowBatchNamed（21731–21767）按模式选择集合查找或标识比较。

setFlowBatchMaxCount（21851–21884）只对恰好 0→正数、正数→0 的模式切换检查已有单引用/集合，存在关联时拒绝切换。正数之间调整未见容量校验，负数也未在此方法显式拒绝；这不证明负数是受支持的配置。getFlowBatchMaxCount（21909–21918）仅返回字段。

旧 setFlowBatch（9490–9605）在 MaxCount>0 时直接拒绝，适用于单引用路径。getFlowBatch（9424–9433）通过宏读取单引用。结合 [FlowBatch 深入追踪](flowbatch-deep.md)，应区分设备集合模式、单引用兼容视图及 FlowBatch 自身的设备引用。

## 剩余核实

设备容量是否在更上层交易或其他入口执行；配置对象持久化；双向关联异常后的恢复；__XXX 配置入口是否被实际调用。不能从上述对象方法推出整条生产交易已经完整校验。
