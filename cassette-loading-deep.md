# 载具、位置、晶圆与 Lot 的装卸链

本报告完整阅读24个方法，区分 MaterialContainer、PositionalContainer、Cassette 与 PosCassette 层；路径相对 fw_cpp_sqx。没有真实设备/数据库测试，不证明这些对象操作等同于完整搬运交易。

## 四层数据不是同一份集合

MaterialContainer 维护按物料标识的集合及 usedCapacity；PositionalContainer 另存按位置索引的引用序列；Cassette 另有按 Lot 标识的 LotEntry/waferCount；Lot 自己再保存反向载具序列。修改要跨多层回调，不能仅依据某一层 getter 推断其他层一致。

MaterialContainer_i::addMaterial（smtchcmf/drblmngm/mtrlcntn.cpp:119–213）先比较 usedCapacity<capacity，再按标识 addUnique；插入成功后调用物料 setMaterialContainer，最后才递增 usedCapacity。重复项且未满时不重复计数，但已满时连重复项也先进入 Full 分支。removeMaterial（240–313）先删除集合项，再清空物料容器引用，随后递减计数，找不到报错。没有本地回滚。

Material_i::setMaterialContainer（smtchcmf/mtrlmngm/material.cpp:728–851）在标识变化时先清本地旧引用并尝试旧容器 removeMaterial，忽略 MaterialNotFound；新容器非空则设置引用并回调 addMaterial。这种双向调用依靠引用清空及 addUnique 结束递归，异常后的不变式仍需框架事务证据。getMaterialContainer（890–901）通过宏取引用；getPosition（925–955）在容器引用指针为空时抛不在容器异常；setPosition（989–1001）只标 dirty 并写数值，没有同步更新位置表。

## 位置与容量的配置边界

PositionalContainer_i::configureContainer（pstnlcnt.cpp:892–941）先调基类配置，仅在位置序列长度为0时分配 capacity+1 个位置、初始化引用并写 capacity。非空序列不在这里重新 resize。

基类 configureContainer（mtrlcntn.cpp:71–91）实际条件是已有物料条目时才赋 contents/capacity；空容器时不赋这两个字段。不能按注释或函数名把条件改读成“空时才允许配置”。派生类首次位置分配补写 capacity，但没有对应补写 contents。是否为旧版本遗留问题，需结合实际初始化/调用和宏核实。

空位枚举 emptyPositions（pstnlcnt.cpp:301–372）仅在 usedCapacity<capacity 时扫描1..capacity，按引用指针是否为 nullptr 判断空位，返回递增位置；getMaterialPosition（975–1064）同样扫描1..capacity，按物料标识匹配，未找到返回0。空字符串与空指针不能未经初始化宏证明就视为相同。

addMaterial_atPosition（63–152）检查 position>capacity 和位置序列长度，再要求该位置引用指针为空；随后 addMaterial、设置位置引用，并在可 narrow 为 Product 时 setPosition。没有显式 position<1 检查；removeMaterial_fromPosition（180–270）只见上界检查，没有同等的序列长度检查。移除依次调用 removeMaterial、清位置引用、设物料位置0。序列下标类型转换和越界保护需框架验证，不能宣称任意异常位置都已安全拒绝。

## Cassette 的 Lot 计数与反向关系

Cassette_i::addWafer_atPosition（cassette.cpp:73–197）要求晶圆非空且 nominalSize 完全相等，先调用位置装入，再取得 wafer.getLot。首次 Lot 建 LotEntry、count=1 并调用 Lot.addMaterialContainer；已有 Lot 只递增 count。若装入后才发现 Lot 为空，本方法没有显式撤销前面的装入。

removeWafer_fromPosition（232–358）先移除位置物料并 narrow Wafer，再找其 Lot；有 LotEntry 时递减 count，恰为0才移除 LotEntry 和 Lot 的反向载具引用；无条目时仍返回晶圆。计数下溢、重复位置或跨对象不一致没有在此方法完整校验。

Lot_i::addMaterialContainer（smtchcmf/prdctmng/lot.cpp:4457–4538）按字符串化对象引用去重，而不是按容器业务标识；removeMaterialContainer（4566–4667）先重建保留的引用列表，再在可 narrow 为 Cassette 时回调 removeLot。集合空时提前返回。不要把“同标识”与“相同字符串引用”合成一个等价关系。

allLots（cassette.cpp:384–485）对 LotEntry 集合加锁并解析引用，跳过 nil 并裁剪结果长度。这只证明此 getter 的锁范围，不证明装卸多对象操作有同一把锁。

## 三个移除入口不等价

removeAllLots（657–704）按当前载具1..capacity位置逐项 removeWafer。removeLot（749–861）先删 LotEntry，再遍历 Lot 的所有 products，按产品自己的 position 调当前载具 removeMaterial_fromPosition；本方法没有逐项验证该产品当前容器就是 thisCassette。跨盒 Lot 的使用前提不能省略。

PosCassette_i::unloadLot（poscimfw/pdrmg/pcas.cpp:3552–3636）则遍历 Lot.allMaterial，读取 position 并调用当前盒 removeWafer，忽略 PositionEmpty/PositionInvalid 和 MaterialNotInMaterialContainer；也没在这里对每片比较容器 ID。不能把这些宽容异常分支描述成“只移除确定属于本盒的所有晶圆”。

## 转盒是先移除再装入

transferWafers_toCassette（cassette.cpp:519–609）空输入直接返回；初始尺寸只比较源盒与第一片。取目标 emptyPositions 后，输入数量超过空位数则先报 Full；逐片在源盒找位置，找不到（0）则跳过，找到则先 removeWafer，再调用目标 addWafer，目标方法会逐片校验尺寸等条件。

它不保留原槽位，而按目标空位序列的同一输入索引安排；没有批量预验证所有片，也没有本地撤销已经完成的移除或装入。失败后的恢复需要上层交易/补偿证据，不能声称原子搬运。

## 库存位置与加工可用性分开

PosCassette_i::makeOnFloor（pcas.cpp:8084–8114）只接受空/InBank/Undefined；makeInBank（8151–8181）只接受空/OnFloor/Undefined，重复调用当前状态会报转换异常，并非幂等 setter。

isLotProcessAvailable（12250–12294）只先接受 DurableState 为 Available/InUse；传入 subLotType 非空且有条件可用子状态时，要求所有类型均允许；空类型列表、nil子状态或非条件模式维持该状态下的 true。此方法本身没有检查 Hold、InventoryState、槽位或容量，不能单靠这个返回值推出允许装载/加工的完整条件。

## 尚待核实

实际装卸/拆合批交易的输入约束、Pos 子类覆盖、状态和权限守卫、并发锁、BO/DO 保存与事务回滚；尤其跨盒 Lot、重复晶圆、空引用及异常位置场景。当前仅还原对象层装卸链。
