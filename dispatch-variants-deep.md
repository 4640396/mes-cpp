# 普通、暂停与耐用品派工选择的差异

路径均为 poscimfw/pdp/pdp.sqx。四条选择路径使用同类规则配置，但候选表、条件和默认规则不同，不能归并成一个统一 SQL。

## 普通批次与暂停批次

| 路径 | 来源及筛选 | 关键差异 |
|---|---|---|
| whatNextForMachine：2296–2655 | FRLOT + FRLOT_EQP；设备关联、NotOnHold、Waiting、未预留 | 此 SQL 没有显式限制 LOT_STATE=Active 或库存 OnFloor |
| whatNextHoldLotForMachine：2965–3223 的第一游标 | FRLOT + FRLOT_HOLDEQP；设备关联、Active、OnFloor、Waiting、未预留 | 3010–3019 未显式要求 OnHold；不能仅凭方法名补上暂停条件 |
| 同方法第二游标 | FRLOT + FRLOT_EQP；另要求 OnHold，及 Active、OnFloor、Waiting、未预留 | 3064–3074 兼容仍保留普通设备关联的暂停批次 |

暂停方法将两个游标的结果依次追加，初始容量 500，每次不足增加 100；不是最多返回 500。FETCH 未找到时正常结束并关闭游标，其他错误转框架异常。方法内部没有显式按批次去重；两组结果能否重叠取决于外部集合维护不变式，暂不据此判定存在实际重复缺陷。

普通和暂停批次都过滤耐用品前缀规则，过滤后为空使用 INT-PRIORITY，随后从后到前依次调用 dispatchFor_inSQL，将每次结果作为下一次输入，最终封装为 DispatchDecisionSequence。

## 正常耐用品选择

whatNextDurableForMachine（3776–4125）只接受 Cassette、Reticle、ReticlePod 三类；不支持类别或设备为空直接返回初始化的空决策序列。

| 类型 | 主表 | 设备关联表 | 额外筛选 |
|---|---|---|---|
| Cassette | FRCAST | FRCAST_EQP | DRBL_HOLD_STATE=NotOnHold、DRBL_PROCESS_STATE=Waiting |
| Reticle | FRDRBL | FRDRBL_EQP | 同上 |
| ReticlePod | FRRTCLPOD | FRRTCLPOD_EQP | 同上 |

实际 SQL 分别在 3842–3849、3906–3913、3970–3977。没有把普通批次的 DISP_RESERVED 条件复制到这些 SQL。候选初始容量 500，不足按 500 扩充，按实际数量缩短。

## 暂停耐用品选择

whatNextHoldDurableForMachine（4206–4723）同样只接受三类。每类都拼接两组候选：

1. 主表与对应 *_HOLDEQP：设备关联、DRBL_INV_STATE=OnFloor、DRBL_PROCESS_STATE=Waiting，没有显式暂停状态条件。
2. 主表与对应 *_EQP：在以上条件之外要求 DRBL_HOLD_STATE=OnHold。

六个 SQL 位置为 4274、4327、4394、4447、4514、4567。没有显式按标识去重。是否重复、何时维护暂停关联表，需配合具体耐用品队列管理和状态操作继续核实。

## 耐用品规则组合

正常耐用品在 4037–4055、暂停耐用品在 4635–4653 仅保留耐用品前缀规则，方向与普通批次过滤相反。若为空，使用 SP_DefaultDurableDispatchRule。此常量定义缺失，不能把默认值自动写成 DURABLE-FIFO。

之后仍从后到前取策略对象，但调用 dispatchForDurable_inSQL，并传入 durableCategory。返回的 ProcessActivity 同样使用 processedMaterialGroups 字段容纳对象标识，不能因字段名推断其中一定是生产批次。

## 还不能确认的部分

各类别 getter/setter 的暂停视图是否完全等价、队列集合到各关系表的 BO 绑定、两个候选集合不重叠的保证、耐用品默认规则具体值、排序容器稳定性及事务提交。它们保持为深入分析的待核实项。
