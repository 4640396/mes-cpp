# 批次暂停与暂停记录：源码样板

## 已核实的结论

`PosLot` 在 IDL 中继承 `Lot` 和 `MOFW_CachedManagedObject`。实现里暂停状态与暂停记录为独立操作。不能从方法命名推断“添加暂停记录必定调用暂停”，也不能把标脏当作已经提交数据库。

下文路径均相对于 `fw_cpp_sqx`。这些是静态源码事实，不是实际运行记录。

## 暂停状态

1. `poscimfw/include/plot.idl:87` 声明 `PosLot : Lot, MOFW_CachedManagedObject`。基础 `lot.idl` 不在当前扫描目录内，因此暂停操作的完整上游接口声明仍需补充。
2. `poscimfw/pprmg/plot.cpp:6597-6629`：`PosLot_i::makeOnHold` 先保存之前的暂停状态。`isInBank()==TRUE` 时标脏并直接设置 OnHold；否则标脏并调用 `Lot_i::makeOnHold()`。
3. `smtchcmf/prdctmng/lot.cpp:947-1037`：基础实现仅在当前不是 OnHold 时执行更新，设置 OnHold，再检查同批次族的各批次。只有全部为 OnHold 且 ProductRequest 非空时，才调用该 ProductRequest 的 `makeOnHold()`。批次族为空或族内对象为空时会抛出框架异常。
4. `poscimfw/pprmg/plot.cpp:6691-6723`：解除暂停也分在库直接设置与调用基础实现两路。
5. `smtchcmf/prdctmng/lot.cpp:1092-1150`：基础解除暂停实现先改为 NotOnHold，若原来为 OnHold，再检查同族批次是否全部解除；后续同步分支需结合完整函数阅读。

上述实现中的部分旧事件发布代码已经被 `//D8000029` 注释，不能作为仍会发布事件的证据。

## 暂停记录

`poscimfw/include/plot.idl:1100-1125` 声明查找、添加、删除和查询全部暂停记录等接口。

`poscimfw/pprmg/plot_hold.cpp:188-229` 的 `addHoldRecord` 用 holdType、reasonCode.identifier、holdPerson.identifier、relatedLot.identifier 拼接键；若键已存在，抛出 LotHoldRecordDuplicateSignal。否则标脏、向 theHoldRecords 添加记录、标记集合为脏。该段没有直接执行 SQL，也没有调用 makeOnHold。

## 数据库存储证据

| 事实 | 位置 |
|---|---|
| `theDB_LotHoldState` 转为 `hLOT_HOLD_STATE` 宿主变量 | `poscimfw/pprmg/C_plotdo.cpp:5172` |
| FRLOT UPDATE 包含 LOT_HOLD_STATE | `poscimfw/pprmg/U_plotdo.sqx:1018` |
| 对象保存函数按 bNeedToInsert 调用 Writer_FRLOT 的 insertInto 或 update | `poscimfw/pprmg/U_plotdo.sqx:4506-4564` |
| 暂停记录集合在集合脏标记等条件满足后交给 CollectionHelper 保存 | `poscimfw/pprmg/U_plotdo.sqx:4692-4718` |
| 暂停记录表 INSERT | `poscimfw/pprmg/U_plotdo.sqx:1798,1876` |
| 暂停记录表 UPDATE | `poscimfw/pprmg/U_plotdo.sqx:1911` |

因此源码中可确认 FRLOT 存储暂停状态，FRLOT_HOLDRECORD 存储暂停明细。但业务方法到对象保存函数的调度、BO/DO 指针绑定、事务开始/提交/回滚和实际运行顺序尚未完整追通。不能画成“makeOnHold 直接 UPDATE FRLOT”。

## 下一步需要补证

- lot.hpp、plot.hpp、lot.idl、MOFW.idl、宏定义和对象持久化调度代码的位置。
- 暂停交易入口如何组合状态更新与暂停记录操作，以及权限、原因码校验和事务边界。
- 条件编译实际启用哪些分支；目前索引同时包含不同编译配置的候选。

`datadictionaries` 目录当前没有扫描到文件，不能据目录名认定已拿到完整数据字典，也不能把 SQL 使用关系当作物理外键。

## 第二轮追踪：持久化调用链和异常边界

基础实现调用 ProductRequest 的后续已查到：`smtchcmf/plnnngcm/prdctrqs.cpp:444-471` 中，`ProductRequest_i::makeOnHold` 仅在 `isInWork()` 时标脏并设置生产状态 OnHold，否则抛出 InvalidStateTransitionSignal。因此“同族全部暂停”只是调用条件，并不保证请求暂停成功。

Lot 的状态写入发生在调用 ProductRequest 之前。若后者抛出异常，当前片段不能证明前者的内存状态或数据库写入已经回滚；必须依靠缺失的事务调度证据才能判断一致性。这里是待核实的异常边界，不是已确认的缺陷。

持久化实现内部现已追通以下静态调用：

| 调用方 | 被调用方 | 证据（U_plotdo.sqx） |
|---|---|---|
| PosLot_DO_i::updateToDataStore | updateARecordInDatabase | 6393–6398 |
| updateARecordInDatabase | insertOrUpdateTheObjectEntry(FALSE) | 4486–4503 |
| insertOrUpdateTheObjectEntry | getHostVarsFromMembers | 4553–4556 |
| insertOrUpdateTheObjectEntry 的非插入分支 | Writer_FRLOT::update | 4557–4564 |
| Writer_FRLOT::update | UPDATE FRLOT | 899–1021 |

新增路径对应的 insertToDataStore → insertARecordInDatabase → insertOrUpdateTheObjectEntry(TRUE) 也在 `6385–6390`、`4436–4453` 中可见。尚未找到谁在正常交易流程中调度这些 data-store 方法，所以业务方法与这条持久化链仍不能画成连续调用。

`C_plotdo.cpp:7450` 将 theDB_LotHoldState 绑定到 aPtrArray[7]，`7491` 将 theDB_HoldRecords 绑定到 aPtrArray[48]。数组上游的 BO 成员地址建立链还需补证；不能仅因成员命名相似就声称绑定已全部核实。

第二轮在 C++/SQX 中检索 makeOnHold/addHoldRecord 调用，仅看到本样板的实现、基础方法调用和 ProductRequest 同步，以及载具等其他对象的同名操作，未发现组合批次状态与暂停记录的交易入口。对明确 commit()/rollback()/EXEC SQL COMMIT/ROLLBACK 与事务回调名称的检索未找到有效调用；peninmg.cpp 中的 after_completion 命中为旧注释。此结论仅描述检索覆盖，不能证明运行时没有事务，也不覆盖别名或宏展开。

## 依赖检索结果与所需材料

运行 `node analysis/mes-cpp/audit-dependencies.mjs` 可重新检查三个源项目的可见普通文件，详细范围、排除目录和结果保存于 dependency-audit.json。归档内容及工作区外 SDK 未检索。若缺少下列材料，当前切片无法独立还原完整交易：

1. 基础框架及生成头文件：lot.hpp、plot.hpp、lot.idl、MOFW.idl。
2. 框架宏及持久化定义：spmacro.hpp、dbmacros.h、pfwgls.hpp 和 MOFW/IMFW 对象保存、事务调度实现。
3. 上层交易服务源码：调用批次 makeOnHold/addHoldRecord 的请求处理、校验和事务包装代码。

这些缺口不妨碍继续分析其他领域对象，但限制了“完整暂停交易”的确定性。暂不通过伪造头文件或抑制警告制造解析成功。
