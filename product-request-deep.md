# 生产请求：双状态、批次联动与数量

完整方法体审阅，路径相对 fw_cpp_sqx。ProductRequest 的状态方法是对象层操作，不代表完整投料、订单履约或产能计算交易。

## 计划与生产是两个独立维度

基础实现 smtchcmf/plnnngcm/prdctrqs.cpp 的状态入口如下，条件不满足会抛 InvalidStateTransitionSignal：

| 入口 | 接受的当前状态 | 写入状态 |
|---|---|---|
| makeNotPlanned，128–174 | Planning Undefined 或 Planned | Planning NotPlanned |
| makePlanned，196–234 | Planning NotPlanned | Planning Planned |
| makeNotInRelease，256–294 | Production Undefined | Production NotInRelease |
| makeInRelease，316–354 | Production NotInRelease | Production InRelease |
| makeInWork，376–422 | Production InRelease 或 OnHold | Production InWork |
| makeOnHold，444–482 | Production InWork | Production OnHold |
| makeCompleted，504–542 | Production InWork | Production Completed |

同状态重调通常不会当作无事发生；例如 Completed 再 makeCompleted 不满足守卫。Planning 的转换没有在这些方法里检查 Production，反之亦然，所以不能画成一条包含所有标签的线性状态机。isNotPlanned/isPlanned/isNotInRelease/isInRelease/isInWork/isOnHold/isCompleted（648–929）分别用状态宏读取各自维度，完整宏语义仍未知。

ProductRequest_init（1455–1481）初始化两个维度为 Undefined，日期为空，数量与两个优先级为0，关联输入产品规格。PosProductRequest_init（poscimfw/ppl/pprrq.cpp:126–172）加上 Bank/Owner/客户/主工艺/计划等引用和来源批次序列，调用基类初始化；它本身没有自动逐步推进到 InWork。

setAllStatesForVendorLot（1730–1745）是特别路径，直接写 Planned 与 Completed，绕过上表普通转换守卫；该方法未在这里校验来源Vendor批次、数量平衡或实际完成生产。

## 请求创建不等于投料完成

PosPlanManager_i::createProductRequestNamed（pplmgr.cpp:323–442）在非TRANSIENT查本地标识集合，TRANSIENT则调用数据库查找，未存在时通过工厂创建并设置manager/identifier，重复抛异常。有效体未直接调用 makePlanned/makeInRelease/makeInWork，也不创建晶圆或载具。

setSourceLots/allSourceLots（pprrq.cpp:343–357、387–434）复制来源批次信息序列，本方法不执行库存预留、扣减、去重或物理转盒。不能把来源清单当作已投料凭证。

## 批次方法会反向推动请求状态

Lot_i::makeInProduction（smtchcmf/prdctmng/lot.cpp:736–850）接受 Released 或 InRework。若实际 LotState 为 Released，则将 Lot 激活并记录激活时间；仅 OriginalLot 且请求非空时调用 request.makeInWork，并设置家族进厂时间。它不是“每片晶圆开始加工都重置请求状态”。

Lot_i::makeOnHold（947–1063）先改本批Hold，再检查家族所有 currentLots；全部OnHold且请求非空才调用 request.makeOnHold。空列表遍历也保留初始 all=true，currentLots 完整性是外部不变式。请求若非InWork，调用可能在Lot状态已修改后失败。

Lot_i::makeNotOnHold（1092–1215）先把本批设NotOnHold；只有此前确为OnHold，且家族全部currentLots都NotOnHold，且请求非InWork时才请求 makeInWork。调用者没有先把请求限为OnHold，实际可接受状态由请求方法自身判断。不能据这条链断言Lot状态与请求状态总是自动一致或原子恢复。

Lot_i::makeCompleted（1244–1367）要求Lot Active，先归档并移除家族currentLots，再写Finished/Completed与完成时间；家族当前批列表为0时设家族完成时间，并对非空请求 makeCompleted。不是按已交付晶圆数量是否达到请求数量决定完成。makeEmptied 也有类似末批联动，见 [合批与初始化](lot-join-init-deep.md)。

这些方法通过家族currentLots驱动联动，未证明一个请求是否只对应一个家族，以及所有创建/归档路径都正确维护该列表。跨对象更新没有本地回滚证据。

## 数量、交付日与优先级只是字段

setProductQuantity（prdctrqs.cpp:1202–1215）、setSchedulePriority（1100–1113）、setPlanPriority（1369–1382）直接标dirty并赋值；本地不检查非负、产能或与Lot数量平衡。setDeliveryDateTime（966–987）、setPlanReleaseDateTime（1287–1301）赋 TimeStamp，未与Lot/工序计划联动检查；TimeStamp 输入格式约束需类/宏补证。

这些字段也不等同于Lot静态优先级或INT-PRIORITY规则。可见请求数量和Completed守卫之间没有本方法内的数量比较，不能以名称补出订单达成算法。

## 剩余边界

真实投料/工单入口、来源Lot与请求数量分配、创建工厂生命周期、请求到LotFamily基数约束、权限和外部认证、完成撤销/补偿、DO持久化与事务。当前双维状态和具体Lot联动已明确，但完整订单交易尚未验证。
