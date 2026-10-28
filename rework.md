# 返工计数与路线返回点

本轮结论来自 fw_cpp_sqx 中已读取的实际方法体。它说明对象级算法，不代表已经找到完整返工交易和事务包装。

## 计数属于晶圆

PosLot_i::increaseReworkCount（poscimfw/pprmg/plot.cpp:15621–15706）取得流程上下文、主流程的根工艺定义 ID，以及当前路线前一道工序规格对应的完整工序号，将二者用分隔符组成 key。随后遍历 theMaterials，窄化为 PosWafer，并调用每片晶圆的 increaseReworkCount(key)（15688–15699）。对象为空时异常。

PosWafer_i::increaseReworkCount（poscimfw/pprmg/pwafer.cpp:2312–2341）标脏，在 theWaferReworkCounter 查找 key：已有则删除旧值、计数加一后重新添加；没有则添加 1，最后设置集合脏标记。

所以不能把这套结构描述成“Lot 上只有一个总返工次数”。同一批次不同晶圆、不同工艺及工序 key 可以有不同计数。

## 取消时使用返回点相关 key

PosLot_i::decreaseReworkCount（plot.cpp:15737 起）取得 getBackupOperation()，若备份数据 reworkOutKey 非空则直接使用；否则根据备份工序规格的前一道规格及主工艺重新组成 key（15805–15881）。之后遍历晶圆调用 decreaseReworkCount(key)（15886–15897）。

PosWafer_i::decreaseReworkCount（pwafer.cpp:2371–2407）在 key 不存在时抛 ReworkCounterNotFoundSignal；存在时删除旧记录，仅当原次数大于 1 才添加减一后的记录。原次数为 1 时删除条目，getReworkCount 在条目不存在时返回 0（2433–2452）。

这说明计数撤销依赖正确的备份/返回点；不能把“当前工序 key”无条件用于减少次数。批次循环中若某片晶圆失败，已处理晶圆是否回滚仍依赖缺失事务证据。

## 上限判断

PosLot_i::isOverMaxReworkCount（plot.cpp:15942–16064）：先构造工艺/工序 key，经当前工序的 findMaxReworkCountForProduct 获取产品对应上限（16010–16021）。

| 上限值 | 方法行为 | 证据 |
|---|---|---|
| 0 | 直接返回 TRUE | 16022–16026 |
| 小于 0 | 直接返回 FALSE | 16028–16032 |
| 大于 0 | 遍历晶圆，任一计数 >= 上限即返回 TRUE；否则 FALSE | 16038–16064 |

因此达到上限即被此方法视为超限，并非必须大于上限。没有晶圆时正数分支保留初始 FALSE。产品上限如何配置、何时调用检查及是否阻止实际交易尚未全部核实。

## 与路线分支的关系

branchTo 存在 REWORK/DURABLEREWORK 类型专门处理；cancelBranch 恢复备份工序并清理相应记录；changeFlowTo 按目标流程/工艺类型决定清空备份和返回数据。详细位置见 route-movement.md。

不能据此将 branchTo 与 increaseReworkCount 画成确定连续调用：当前核实的两段实现未证明这种直接调用关系，上层调用顺序仍未知。流程上下文中历史返工计数实现大量已被注释，不能将旧注释混入现行逻辑。
