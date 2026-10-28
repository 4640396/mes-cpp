# 合批、子批初始化与清空状态

本报告补齐 [拆批与成员转移](lot-split-deep.md) 中的工厂/初始化和合批对象入口，完整阅读12个方法。仍未证明外层交易、宏工厂调用绑定及数据库原子性。

## newLot 参数不是“复制父对象全部属性”的证据

SPProductManagementObjectFactory_i::newLot（poscimfw/pprmg/prdctmsp.cpp:120–137）通过 CREATE_SPFWOBJECT_PARAM1_NORETURN(PosLot,splitFromLot) 传参创建，附加配置的用户数据集后返回。基类工厂（smtchcmf/prdctmng/prdctmof.cpp:90–95）也用宏创建，宏展开仍未证实。

已完整阅读 PosLot_i 构造（plot.cpp:431–474）、PosLot_init（517–639），以及 Lot_i 的两个构造（smtchcmf/prdctmng/lot.cpp:4953–4964、4967–4978）与 Lot_init（4829–4881）。构造主要清空指针；PosLot_init 将数量、优先级类、若干计数设0，标志设false，初始化状态、引用、Hold/备注/QTime/Monitor/FutureHold/队列等集合，调用 Lot_init(aLot)，最后把指针交给 DO。

Lot_init 将四个基础状态设 Undefined，清引用及完成/激活/释放时间，创建时间取当前；把 splitFromLot 存入 theLotMostRecentlySplitFrom，并以参数是否 nil 决定 theOriginalLot。随后 MaterialGroup_init（mtrlmngm/mtrlgrup.cpp:1351–1371）初始化成员集合。因此在这些可见初始化方法里，没有遍历复制父批全部业务属性的实现。前一报告对工厂复制范围的未知仍保留，但不能以 newLot(parent) 的调用形式声称已证明克隆。

这也补上了拆分来源的具体赋值：createSplitLotsFrom 主体没有调独立 setLotMostRecentlySplitFrom，但 Lot_init 内有该来源写入；宏工厂到 init 的精确绑定仍需宏/生成框架证据。

## 合批入口叫 joinAll_into

ProductManager_i::joinAll_into（prdctmng/prdctmng.cpp:1366–1503）取得源批所有物料并 narrow 成 Product，要求源/目标非空，然后调用 sourceLot.transferProducts_toLot。转移中的任意异常映射 LotJoinFailedSignal；该映射不执行本地撤销。

转移成功后调用源批 makeEmptied，最后 duplicate 目标批返回。读取了 size 并计算数量变量，但有效方法体没有用这些局部变量直接更新数量。源/目标同一对象、规格/路线/暂停/在制兼容和载具状态在这段方法没有完整显式预验证，不能据此宣称业务允许任意两批合并。

PosProductManager_i::joinAll_into（poscimfw/pprmg/pprmgr.cpp:1889–1982）先将源批每片 PreviousLot 改为源批，再显式调基类；之后将目标 originalQuantity 加源 originalQuantity，并对源、目标调用 refreshQuantity。方法没有把源 originalQuantity 清0；originalQuantity 不是合批后当前片数的同义字段。失败可能发生在 PreviousLot/成员已修改之后。

## makeEmptied 会影响家族和生产请求

Lot_i::makeEmptied（lot.cpp:1636–1792）只接受 isFinished 或 isActive，要求家族存在。Active 批先 archiveLot 并 removeCurrentLot；随后写 LotState=Finished、FinishedState=Emptied、当前完成时间。若家族 currentLots 为空，则设置家族完成时间，并对非空 ProductRequest 调 makeCompleted。

这里没有先检查实际成员数为0的代码，所以单独调用 makeEmptied 不是已证实的“强制清空所有物料”。它也不是删除 Lot 对象或所有持久化历史。

PosLot_i::makeEmptied（plot.cpp:6963–7011）先保存之前状态、调用基类；当 SP_FRLOTPO_MAINTENANCE 与 SP_FRLOTPO_DELETE_FOR_EMPTIED 都解析为1时调用已读 deleteLotPO。最后才检查 isStacked，若真抛 InvalidStateTransitionSignal。这个后置检查不能解释成状态修改前的守卫，前面状态/家族/维护表是否恢复由外层事务决定。

## 装卸与合批仍是两条链

joinAll_into 复用成员转移，没有直接逐片转盒或重算 Cassette LotEntry 的调用。因此合批后物理位置、各盒计数、反向载具集合如何同步，还需上层交易或覆盖实现证据。不能用“晶圆 Lot 引用已改变”替代“物理载具关系已一致”。

剩余：宏工厂生命周期、单子批输入约束、真实拆合批交易前置校验、重复/同源目标场景、Hold记录处理、各计数/载具持久化以及并发与回滚。
