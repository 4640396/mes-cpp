# 批次—流程—工序：已核实的源码规则

范围：现有 fw_cpp_sqx；文件路径均相对此目录。以下是方法级静态规则，不是进出站交易流程或生产环境运行记录。

## 批次是多维状态对象

| 维度 | 成员 | FRLOT 列 |
|---|---|---|
| 生命周期 | theLotState | LOT_STATE |
| 生产状态 | theLotProductionState | LOT_PRODCTN_STATE |
| 暂停状态 | theLotHoldState | LOT_HOLD_STATE |
| 完成分类 | theLotFinishedState | LOT_FINISHED_STATE |
| 加工状态 | theLotProcessState | LOT_PROCESS_STATE |
| 库存状态 | theLotInventoryState | LOT_INV_STATE |

依据：`poscimfw/pprmg/C_plotdo.cpp:5152–5184,5394–5406` 的宿主变量转换，以及 `poscimfw/pprmg/U_plotdo.sqx:1018` 的 UPDATE 列清单。宏展开与 BO/DO 绑定仍有缺失，以上不是数据库物理字段类型或约束说明。

`PosLot_i::getState()` 是优先级投影，并非另一个独立的持久化状态。按 `poscimfw/pprmg/plot.cpp:3342–3410` 的执行顺序：

1. 库存状态是 NonProBank：若完成状态为 Scrapped/Emptied，返回完成状态；否则返回库存状态。
2. 非上述分支且暂停状态为 OnHold：若完成状态为 Scrapped/Emptied，返回完成状态；否则返回暂停状态。
3. 其他情况下，生命周期为 LotCreated/Released/Shipped，返回生命周期状态。
4. 生命周期为 Finished，返回完成状态；生命周期为 Active，返回加工状态。
5. 未覆盖组合最终返回空字符串。

例如，Active + Waiting + OnHold 会显示 OnHold；NonProBank + OnHold 且没有报废/清空覆盖时显示 NonProBank。不能仅凭 getState() 的结果还原所有状态维度。

## 加工状态方法的真实限制

| 方法 | 前置条件 | 修改 | 证据：plot.cpp |
|---|---|---|---|
| makeWaiting | 生命周期 Released | 保存原状态，设 Waiting、Active、InProduction、NotOnHold | 5524–5555 |
| makeWaiting | 生命周期 Active 或 Finished | 保存原加工状态并设 Waiting，其他维度在此分支不重设 | 5557–5570 |
| makeProcessing | Active 且 Waiting | 保存原加工状态，设 Processing | 5676–5708 |
| makeProcessed | Active 且 Processing | 保存原加工状态，设 Processed | 5802–5834 |

条件不满足时抛出 InvalidStateTransitionSignal。特别注意：本段 makeProcessing/makeProcessed 没有额外检查暂停状态，也没有显示执行设备进站/出站、SQL 提交或路线前移；外层交易是否做这些检查未知。不能把方法名直接等同于完整业务交易。

Finished 分支下调用 makeWaiting 只改变加工维度，getState() 仍可能返回完成状态。这是源码可见行为，不在缺少调用上下文时认定为缺陷。

## 工序、流程上下文与工艺定义

| 查询 | 已核实行为 | 证据 |
|---|---|---|
| Lot::getProcessOperation | 通过宏取得 theProcessOperation 引用 | smtchcmf/prdctmng/lot.cpp:3471–3482 |
| PosLot::getProcessFlowContext | 通过宏取得 theProcessFlowContext 引用 | poscimfw/pprmg/plot.cpp:1201–1210 |
| PosLot::getResponsibleProcessOperation | 责任标志关闭时返回当前工序的窄化引用；开启时取流程上下文的前一道工序；上下文空则异常 | poscimfw/pprmg/plot.cpp:3488–3523 |
| Context::getPreviousProcessOperation | theContext->getBefore(theCurrentProcessOperation, ...) 后转换对象引用 | poscimfw/ppcdf/ppcflwx.cpp:606–621 |
| PosLot::getMainProcessDefinition | 通过宏取得 theMainProcessDefinition | poscimfw/pprmg/plot.cpp:8701–8711 |
| PosLot::getOperationNumber | 返回成员 theOperationNumber；不是此方法现场计算路线位置 | poscimfw/pprmg/plot.cpp:8786–8796 |
| Operation::getProcessDefinition | 通过宏取得 theProcessDefinition | poscimfw/ppcdf/ppcope.cpp:2247–2258 |
| Operation::getProcessFlow | 通过宏取得 theProcessFlow | poscimfw/ppcdf/ppcope.cpp:4254–4264 |

ProcessOperation 与 ProcessOperationSpecification 是不同类型。`poscimfw/include/ppcflw.idl:166,240–251` 中，流程的按工序号查找、first/next 方法返回 ProcessOperationSpecification，并通过 out 参数返回 ProcessFlow；不能把它们直接视为批次当前工序实例。

对应实现入口在 `poscimfw/ppcdf/ppcflw.cpp:1568,2699,2918`。本轮确认接口与入口存在，尚未完整分析内部路线选择、模块切换、跳步和返工逻辑。

## 数据落点与读取建议

- FRLOT 的 PO_OBJ：工序引用；宿主变量转换见 C_plotdo.cpp:5296。
- FRLOT 的 PFX_OBJ：流程上下文引用；转换见 C_plotdo.cpp:5364。
- FRLOT 的 OPE_NO：工序号；转换见 C_plotdo.cpp:5954。
- FRLOT 的 MAINPD_ID/MAINPD_OBJ：在 U_plotdo.sqx:1018 的更新清单中可见；其完整对象映射需继续核实。

查看“当前在哪里”时应组合当前工序、工序号、主工艺定义、流程上下文与多个状态维度。责任工序用于哪个上层业务仍需调用入口证据，不能一律代替当前工序。

## 本轮仍未知

上层交易入口、授权与暂停校验、路线真正前移方法的调用条件、工序实例的创建与替换、持久化调度和事务原子性。后续新增 IDL 可以补充契约，但仅靠 IDL 不能证明运行时事务或动态调用目标。
