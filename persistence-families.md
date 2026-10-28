# 生成持久化模板族候选

全量定位 19907 个方法，624 个文件，387 个名称族；完整方法体审阅 48 个成员。分组没有增加语义已审阅数量。

## 如何使用

1. 按 C/R/U/K 文件名前缀及 Writer/Reader/CollectionHelper/DO 角色定位族。命名代表候选，未还原生成器。
2. 在 persistence-families.json 中选择不同 patternHash 的代表，逐项阅读分支、SQL 和宏。
3. patternHash 保留数字，丢弃字符串内容并一致重命名标识符；SQL 表名、字段、错误宏及业务常量可能被掩盖。因此同形方法也必须比较字面值、表/字段映射和宏，不自动继承审阅状态。
4. tokenHash 对去 C++ 注释后的 token 完整保留名称及字面值，空白变化不影响；不执行预处理。文件哈希与现有源码清单校验。SQL 列表仍是文本候选，动态 SQL 和头文件隐藏逻辑不完整。

## 最大的45个族

| 族 | 方法数 | token模式候选数 | 已完整审阅成员 | 首个定位样本 |
|---|---|---|---|---|
| U:Writer:deleteFrom | 730 | 7 | 9 | poscimfw/pabcl/U_ppptsedo.sqx:79 |
| R:Reader:constructor | 695 | 180 | 2 | poscimfw/pabcl/R_ppptsedo.sqx:53 |
| R:Reader:destructor | 695 | 2 | 1 | poscimfw/pabcl/R_ppptsedo.sqx:72 |
| U:Writer:constructor | 678 | 3 | 0 | poscimfw/pabcl/U_ppptsedo.sqx:67 |
| U:Writer:destructor | 678 | 1 | 0 | poscimfw/pabcl/U_ppptsedo.sqx:74 |
| U:Writer:insertInto | 678 | 158 | 2 | poscimfw/pabcl/U_ppptsedo.sqx:97 |
| U:Writer:update | 677 | 287 | 3 | poscimfw/pabcl/U_ppptsedo.sqx:115 |
| U:Writer:deleteAll | 575 | 3 | 2 | poscimfw/pabcl/U_ppptsedo.sqx:154 |
| C:CollectionHelper:load | 539 | 190 | 4 | poscimfw/pabcl/C_ppptsedo.cpp:191 |
| C:CollectionHelper:setCollectionItemFromHostVars | 539 | 103 | 1 | poscimfw/pabcl/C_ppptsedo.cpp:621 |
| R:Reader:close | 539 | 1 | 1 | poscimfw/pabcl/R_ppptsedo.sqx:147 |
| R:Reader:fetch | 539 | 142 | 1 | poscimfw/pabcl/R_ppptsedo.sqx:100 |
| C:CollectionHelper:getHostVarsFromCollectionItem | 522 | 96 | 2 | poscimfw/pabcl/C_ppptsedo.cpp:601 |
| R:Reader:getTableMarker | 522 | 1 | 1 | poscimfw/pabcl/R_ppptsedo.sqx:130 |
| U:CollectionHelper:save | 522 | 17 | 6 | poscimfw/pabcl/U_ppptsedo.sqx:567 |
| U:Writer:setTableMarker | 522 | 2 | 0 | poscimfw/pabcl/U_ppptsedo.sqx:148 |
| C:CollectionHelper:checkDirty | 521 | 17 | 4 | poscimfw/pabcl/C_ppptsedo.cpp:263 |
| C:CollectionHelper:clear | 521 | 2 | 0 | poscimfw/pabcl/C_ppptsedo.cpp:159 |
| C:CollectionHelper:destructor | 521 | 1 | 0 | poscimfw/pabcl/C_ppptsedo.cpp:153 |
| C:CollectionHelper:compareCollectionItemToHostVars | 518 | 89 | 2 | poscimfw/pabcl/C_ppptsedo.cpp:370 |
| C:CollectionHelper:constructor | 518 | 1 | 0 | poscimfw/pabcl/C_ppptsedo.cpp:147 |
| C:Other:assign | 518 | 84 | 0 | poscimfw/pabcl/C_ppptsedo.cpp:169 |
| C:Other:release | 518 | 17 | 0 | poscimfw/pabcl/C_ppptsedo.cpp:183 |
| U:Writer:burstInsert | 506 | 135 | 2 | poscimfw/pabcl/U_ppptsedo.sqx:230 |
| U:Writer:singleInsert | 506 | 135 | 3 | poscimfw/pabcl/U_ppptsedo.sqx:207 |
| U:Writer:shift | 361 | 4 | 1 | poscimfw/pcdmg/U_pcodedo.sqx:225 |
| U:Writer:travel | 361 | 38 | 1 | poscimfw/pcdmg/U_pcodedo.sqx:247 |
| R:DO:lockARecordInDatabase | 312 | 4 | 0 | poscimfw/pabcl/R_ppptsedo.sqx:334 |
| C:DO:clearCollectionHelper | 159 | 17 | 0 | poscimfw/pabcl/C_ppptsedo.cpp:112 |
| C:DO:constructor | 159 | 1 | 0 | poscimfw/pabcl/C_ppptsedo.cpp:21 |
| C:DO:destructor | 159 | 1 | 0 | poscimfw/pabcl/C_ppptsedo.cpp:30 |
| C:DO:initializeCollectionHelper | 159 | 17 | 0 | poscimfw/pabcl/C_ppptsedo.cpp:104 |
| C:DO:setMyBOImplDataPtrs | 159 | 79 | 0 | poscimfw/pabcl/C_ppptsedo.cpp:431 |
| K:DO:deleteARecordFromDatabase_key | 159 | 2 | 0 | poscimfw/pabcl/K_ppptsedo.sqx:236 |
| R:DO:selectARecordFromDatabase | 159 | 45 | 0 | poscimfw/pabcl/R_ppptsedo.sqx:171 |
| U:DO:deleteARecordFromDatabase | 159 | 18 | 0 | poscimfw/pabcl/U_ppptsedo.sqx:289 |
| U:DO:deleteFromDataStore | 159 | 3 | 0 | poscimfw/pabcl/U_ppptsedo.sqx:661 |
| U:DO:insertARecordInDatabase | 159 | 2 | 0 | poscimfw/pabcl/U_ppptsedo.sqx:376 |
| U:DO:insertOrUpdateTheObjectEntry | 159 | 38 | 0 | poscimfw/pabcl/U_ppptsedo.sqx:446 |
| U:DO:insertToDataStore | 159 | 3 | 0 | poscimfw/pabcl/U_ppptsedo.sqx:645 |
| U:DO:retrieveFromDataStore | 159 | 1 | 0 | poscimfw/pabcl/U_ppptsedo.sqx:669 |
| U:DO:updateARecordInDatabase | 159 | 1 | 0 | poscimfw/pabcl/U_ppptsedo.sqx:426 |
| U:DO:updateToDataStore | 159 | 2 | 0 | poscimfw/pabcl/U_ppptsedo.sqx:653 |
| C:DO:convertFromCPPToSQLDataFormat | 158 | 3 | 0 | poscimfw/pabcl/C_ppptsedo.cpp:452 |
| C:DO:convertFromSQLToCPPDataFormat | 158 | 3 | 0 | poscimfw/pabcl/C_ppptsedo.cpp:478 |

## 下一批核实重点

CollectionHelper 的 load/checkDirty/save，以及 Writer 的单行/批量插入和更新；随后核对 DO 锁、删除、成员数组绑定。已经读过的 Lot 队列和 LotHold FIFO 只是两个样板，不覆盖所有成员。

索引只覆盖 method-index.json 的定义候选，不能据总数反推整个 C++ 编译单元已完整解析。
