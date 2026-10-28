# 配方选择、参数覆盖与批次限制

来源以 poscimfw/prcmg/plcrc.cpp 为主，行号相对 fw_cpp_sqx。完整阅读下面方法体，宏、动态对象目标、交易和运行配置仍未知。

## 两类选择接口不能互换

findMachineRecipeForSubLotType（4398–4525）按默认设置顺序选第一个设备适用、资源列表为空或资源匹配的条目；最后解析 Active 配方版本。findDefaultSettingForSubLotType（5519–5604）采用相同筛选，返回设置并将选中 Active 引用改为实际版本；没有匹配时返回初始化结构，其字段默认值依赖宏及 IDL。

带 Lot 的 findMachineRecipeFor（4599–4876）和 findDefaultSettingFor（5677–5928）还读取 SP_ENTITY_INHIBIT_SEARCH_CONDITION。只有解析值为 1、并进入非空资源要求且资源匹配的分支，才执行这里的实体限制查询。空资源列表分支直接选择，未执行该方法中的限制查询。不能将这个局部分支外推为整个系统都跳过限制，外层可能另有检查。

查限制时组装产品（存在时）、设备、配方和要求 TRUE 的有名 chamber；FALSE 资源要求不加入 chamber 查询。Active 引用在相关分支尝试转换。对每条返回限制查 Lot 例外：任意一条没有例外就跳过该候选配方；零条限制或每条都有例外才接受。不是“任意一条有例外就全部放行”。

## 参数和配套对象的来源

setDefaultRecipeSettings（1144–1158）和 setMachineSpecificRecipeSettings（1266–1280）直接标记 dirty 并复制序列，本方法没有排序或完整校验。

findDefaultSettingItemsForSubLotType（6593–6677）按传入配方标识比较，Active 先转换为当前版本标识用于比较，然后复制首个满足资源条件的默认设置。该方法并不把复制结果中的 Active 引用改写。findMachineSpecificItemsForSubLotType（6742–6829）还要求设备标识匹配。二者未匹配时返回初始化结构，不能当作明确 nil 对象。

findRecipeParametersForSubLotType（6428–6528）从设备基础参数开始，逐个合入默认设置参数，再合入设备专用设置参数。同 parameterName 替换已存在的首个匹配项，否则追加，因此覆盖优先次序为：设备基础值 < 默认设置 < 设备专用设置。没有证据证明初始重复名称会被全面去重。

findProcessDCSpecificationForSubLotType（6063–6102）先尝试设备专用 DC specification，再尝试默认项，引用转换宏是否提前返回仍需宏定义核实。findDataCollectionDefinitionForSubLotType（6159–6202）取默认 DC definition，后续有 Measurement 类型缺定义异常；不能忽略宏潜在提前返回而说它总会抛错。findFixtureGroupsForSubLotType（6249–6286）转换默认 fixtureGroups；findBinDefinitionForSubLotType（6327–6354）尝试默认 binDefinition，无可用引用时保持初始化 nil。

## 限制查询与例外的衔接

PosEntityInhibitManager_i::allEntityInhibitRecordsForLotEntities（poscimfw/penmg/peninmg.cpp:2373–2422）在 entities 为空时返回 nullptr，否则调用 getEntityInhibitRecordsFor。配方上述分支会先加入设备及配方等实体，不能据空输入分支直接判定该调用存在空指针故障。

PosEntityInhibit_i::getExceptionLotRecord（poscimfw/penmg/penin.cpp:1961–1992）查不到时返回 nullptr，查到时复制例外记录；配方方法同时处理 nullptr 和命名的找不到异常。

数据库查询存在两条不同路径，见 [实体限制数据库筛选](inhibit-query-deep.md)。这些细节意味着限制规则必须带入口、配置和分支条件保存到本体事实中。
