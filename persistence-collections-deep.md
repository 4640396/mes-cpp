# 集合加载、差异检测与保存

完整阅读三个形态的 load/checkDirty/save，各自只代表已列方法，不将整族自动标为完成。来源相对 fw_cpp_sqx；框架宏、DDL、并发与事务未运行验证。

## 三种已读形态

| 形态 | load / checkDirty | save |
|---|---|---|
| 字典 PosPropertyList | pabcl/C_ppptsedo.cpp:191–261、263–368 | pabcl/U_ppptsedo.sqx:567–641 |
| 平序列 UserDataSets | pcdmg/C_pcodedo.cpp:250–330、332–371 | pcdmg/U_pcodedo.sqx:673–758 |
| 序列中的 reticleGroups 子序列 | pdrmg/C_prtclsdo.cpp:591–717、719–781 | pdrmg/U_prtclsdo.sqx:2078–2227 |

表中路径省略 poscimfw/ 前缀。

## load 不只是复制数据

aboutToWrite 为真时清 helper 缓存，并按 updateModeSetting 决定是否保留数据库记录快照；部分更新保存值，普通更新模式主要保留定位信息。字典按数据库 key 添加元素；序列按 d_SeqNo 扩容并赋对应位置，不自动压缩空洞。

嵌套序列从 d_theTableMarker 的旧前缀及后缀解析父序号，再按子 d_SeqNo 定位。解析残余字符或父序号超过父集合长度时抛取数异常；负数、空字符串及类型范围的完整约束还需结合宏、构造与 Reader。方法不创建缺失父对象，因此父集合预先加载的顺序很重要。

Reader::fetch、setCollectionItemFromHostVars 决定具体值转换，失败返回 false；load 不是编译/运行层面的数据库约束证明。

## checkDirty 的两条算法

字典遍历旧记录：不存在的 key 生成 Delete；存在的 key 在部分更新下比较值，未修改标 None。updatedCount 与 oldSize×partialThreshold 比较；部分更新且不强制更新模式时，超阈值可回退 DeleteAll。所有旧项删除的情况也可简化为 DeleteAll。这里不能把阈值称作数据库写入次数上限，因为新增项和最终 Writer 操作另有路径。

平序列/嵌套序列在 partialThreshold>0 时调用 searchOptimalSQL；仅普通更新模式时按旧长度和新长度构造尾部删除/插入与重叠范围更新。嵌套模式先排序记录，再分别处理父范围和各子范围。

三个 checkDirty 最终均返回 bOldTableMarker && !deleteAll。它们通过 outSQLs 输出计划，返回值不是“数据是否 dirty”，也不能用 false 解释成“无需保存”。

## save 与序号操作

save 在更新配置下先执行计划中的 DeleteAll/Delete；序列还处理 Shift/Travel。配置未启用更新时整体 deleteAll 后重新插入。字典遍历当前 key，用 equal_range 找 Update/None，否则默认 Insert；平序列从末尾向前遍历，并按半开范围匹配操作。嵌套序列先处理父，再处理对应子序列，父/子标记以及迭代器排序依赖计划生成器。

序列 Writer_FRCODE_UDATA::shift（U_pcodedo.sqx:225–245）用 UPDATE 将指定旧区间的 d_SeqNo 加偏移。travel（247–273）用 MERGE 将来源区间的数据写到偏移后的目标：目标存在则更新业务字段，不存在则插入；该方法没有删掉源行。不能把 travel 单独解释成“移动并删除原记录”，清理是否由计划其他操作承担需追调用顺序。

两者的 SQL BETWEEN 上界都是 toSeqNo−1，代表 [from,to)。唯一键冲突、范围交叠的执行效果与数据库规则待验证。save 只组织调用，不代表事务提交。

## 实际框架代码可继续追查

smtchcmf/frmwrkgl/cimfwdo.cpp 中的 CIMFW_DO_SequenceHelperBase::searchOptimalSQL（2739–2782）取得 comparator 的旧/新长度，按 bUseMergeStatement 选择不同成本模型，再调用 doSearchOptimalSQL 返回 deleteAll。嵌套入口 CIMFW_DO_SequenceInSequenceHelperBase::searchOptimalSQL（3307–3361）还取得父/子长度，Merge 分支为新增父项的旧长度补0。

因此算法源并非全部缺失。此次完整阅读的是两个入口，内部编辑图、成本函数、callback、比较器顺序仍未全部核实，不能仅凭 Optimal 名称声称数据库全局最优或正确性已证明。

## 后续核实

继续连接比较器、计划操作顺序、编辑图、Writer 缓冲与 DO 保存；检查同族其余模式及各表字面值映射。已读13个方法不覆盖全部521个 checkDirty / 522个 save。
