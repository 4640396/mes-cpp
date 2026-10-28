# 队列集合、暂停视图与关系表保存

本专题把普通批次的队列集合、读视图、暂停恢复操作、数据对象保存和 SQL 查询连接起来。已知链路与缺失的 BO/DO 宏绑定、事务调度分开表示。

## Lot 的四个集合方法

路径：poscimfw/pprmg/plot.cpp。

| 方法与范围 | 实际行为 | 不能直接推出 |
|---|---|---|
| setQueuedMachines：10470–10549 | 标脏，先清空普通集合并标记集合脏，再按设备 identifier 和字符串对象引用逐项添加；空输入就是清空；空设备抛框架异常 | 方法返回前已保存数据库、失败前的清空一定被回滚 |
| getQueuedMachines：10580–10640 | LotHoldState=OnHold 时主动返回空序列；否则通过 GET_SEQUENCE 读取普通集合 | 返回空就意味着底层集合或 FRLOT_EQP 没有记录 |
| setHoldQueuedMachines：16131–16159 | 清空并逐项替换暂停设备集合，标记对象与集合脏；空设备异常 | 它会清除普通集合或切换暂停状态 |
| getHoldQueuedMachines：16189–16217 | 先读暂停集合；若为空且批次 OnHold，则改读普通集合 | 读到设备就意味着 FRLOT_HOLDEQP 一定有对应行 |

这些 getter 是带业务语义的视图，不是直接数据库集合镜像。状态变化与集合迁移顺序会改变调用结果。

## 管理器的暂停、删除与恢复

路径：poscimfw/pdp/pdpmg.cpp。

- addToHoldQueue（2871–2925）：批次为空异常；isNotOnHold() 为真时取普通视图，否则取暂停视图；取得设备非空时写入暂停集合。没有直接修改 LotHoldState，也没有直接清空普通集合。
- removeFromHoldQueue（2960–2993）：总是清空暂停集合；若批次仍 OnHold，再清空普通集合，避免暂停 getter 的回退重新暴露旧设备。
- moveToWIPQueue（3034–3074）：取得暂停视图；非空时复制到普通集合，再清空暂停集合。设备列表为空时不执行这些替换，也不直接修改暂停状态。

不能据方法名认定它们各自是完整暂停/解除暂停交易；外部何时切换状态仍需上层调用方证据。

## DO 保存路径与桥接缺口

1. `C_plotdo.cpp:7438–7555` 的 setMyBOImplDataPtrs 中，[78] 赋给 theDB_QueuedMachines（7521），[103] 赋给 theDB_HoldQueuedMachines（7546）。这些是 DO 端的槽位绑定事实。
2. `plot.cpp:634` 的初始化中有 GIVE_MY_POINTERS_TO_MY_DO，但宏实现缺失，未找到 BO 端构造相同数组的完整代码；不把相同成员命名当作已经证明两端地址一致。
3. `U_plotdo.sqx:4812–4840` 的对象保存片段：在外层允许处理集合的路径中，受 HAS_COLLECTION_SELECT 编译条件下的 isResynced 和集合 isCollectionDirty 控制。非插入时调用 checkDirty，创建 Writer_FRLOT_EQP，调用 helper.save，最后 singleInsert 冲刷余项。
4. 普通 dispatcher 的 addToQueue/removeFromQueue 仅跟踪，与 Lot 集合到关系表的保存职责不同。

因此可描述“Lot 替换集合并标脏 → 缺失框架桥接/保存触发 → DO 集合保存 → FRLOT_EQP → SQL 派工候选”，但中间缺口不能画成已确认的直接调用。

## FRLOT_EQP 读取与比较

Reader_FRLOT_EQP（R_plotdo.sqx:1160–1250 的五个方法）按 d_theSystemKey 查询 EQP_ID/EQP_OBJ，构造时 OPEN；fetch 遇未找到返回 false，其余错误走检索异常宏；析构调用 close(false)，close 在句柄已清除时直接返回。getTableMarker 读取首行 marker，没记录时置空字符串。

CollectionHelper_FRLOT_EQP::load（C_plotdo.cpp:2797–2867）在 aboutToWrite 时清理旧缓存并依据 update/partial 配置决定是否缓存旧行和 marker；逐项 fetch 后把 EQP_ID 转集合键，再把 EQP_OBJ 转成集合值。

getHostVarsFromCollectionItem（8740–8757）把集合值转换到 EQP_OBJ；setCollectionItemFromHostVars（8760–8782）执行反向转换。compareCollectionItemToHostVars（2976–2992）把空值视为空字符串，并在 EQP_OBJ 的固定最大长度内比较，变化返回 true。

## checkDirty 不是单纯“脏不脏”布尔值

完整方法：C_plotdo.cpp:2869–2974。

它比较已缓存的旧集合与当前集合，按配置生成 Delete、Update、None 或 DeleteAll 操作；partial 模式计数超过阈值且非强制 update，或旧集合非空而全部需删除时，可退回 DeleteAll。否则按 UpdateSQLOrder 排序操作列表。

返回值是 `bOldTableMarker && !deleteAll`，用于旧 marker 处理，不是“集合存在变化”的直接布尔结论。真正的脏标志检查已经在调用方执行。若只按名字把返回 true 解释为发现差异，会误读保存分支。

## save 与 Writer 的实际 SQL

CollectionHelper_FRLOT_EQP::save（U_plotdo.sqx:5712–5786）：

- 依据 marker 模式决定是否设置 PosLot_QueuedMachines marker。
- update 模式先处理 DeleteAll/Delete；非 update 模式先 deleteAll。
- 遍历当前集合，对 None 跳过；其他项转换宿主变量后调用 insertInto 或 update。

Writer_FRLOT_EQP 的方法：

| 方法 | 位置：U_plotdo.sqx | 作用 |
|---|---|---|
| deleteAll | 2499–2514 | 按 system key 删除该批次所有 FRLOT_EQP 行 |
| deleteFrom | 2516–2533 | 按 system key 和 EQP_ID 删除单个设备关联 |
| insertInto | 2535–2550 | 设置键并积累记录，按配置调用单条/批量写入 |
| singleInsert | 2552–2573 | 写入 system key、marker、EQP_ID、EQP_OBJ，随后清零待写计数 |
| burstInsert | 2575–2610 | 达到 SP_DO_BURST_INSERT_COUNT 后执行源码中固定五行 VALUES 插入 |
| update | 2612–2630 | 按 system key 和 EQP_ID 更新 EQP_OBJ |

批量阈值宏未提供，不能独立验证它与五行模板的匹配约束。错误由缺失的 DO 宏映射为插入、更新或检索异常；代码中执行 SQL 不证明已经提交事务。

## 当前证据支持的结论

实际队列候选由 Lot 设备集合及其关系表承担，普通 dispatcher 的旧内存列表更新已停用。普通/暂停读方法会过滤或回退视图，所以分析不能只靠 getter 名称或单表是否有行。后续仍要验证保存触发、BO 数组槽位、暂停状态切换顺序与事务一致性。
