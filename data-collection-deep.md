# 数据采集：配置、计算与汇总的边界

本报告完整阅读下述方法体，路径相对 fw_cpp_sqx。未运行 C++、连接数据库或证明整个判限/SPC 交易。

## 定义与规格配置

poscimfw/pdcmg/pdcdf.cpp:690–786 的 setDCDefinitionInfo 明确抛此版本无效异常；__170（5056–5075）调用 __XXX（4955–5028），复制采集类型、项目名、单位、数据类型、Raw/Derived、位置、计算类型/表达式、历史保存标志和 tag，设置白定义、FPC 分类和用户数据集。relNo 在该方法未参与条件判断，不据参数名推定版本转换。

setCollectionType（444–458）通过状态宏赋值；setDCItems（533–547）替换序列，getDCItems（579–625）复制返回。方法内没有完整校验不证明调用者也不校验。

规格对象 pdcsp.cpp:834–1029 的旧 setDCSpecificationInfo 也禁用。__101（2594–2613）调用 __XXX（2419–2565），清空后按名称重建 screen/spec/control 上下限、检查标志及动作码、target、tag、group，重复项目名称只接受首次加入者；再通过管理器解析、重建关联定义集合。配置限值不等于执行限值比较。

addDataCollectionDefinition（1827–1862）对重复定义标识抛异常；findDataCollectionDefinitionFor（1891–1954）未找到时空分支后仍进入引用提取宏，不能称为明确抛找不到异常。findDCSpec（599–648）未找到也保留初始化结构；默认值依赖宏。

## Raw 输入处理

doValidCheck（pdcdf.cpp:987–1239）只处理 Raw，空值和 `*` 跳过。默认输入最长12；SP_LONG_STRING_VALUE 恰为 ON 且类型 String 时允许128。Integer 白名单为数字、星号、空格、正负号，随后 strtoll 检查 ERANGE、INT32 范围与尾字符；Float 额外允许点和 Ee，再 strtod 检查范围和尾字符。String 除长度外未见额外内容校验；未知类型没有显式拒绝。

代码没有显式检查数值转换是否至少消费一个字符，空白输入约束需继续核实。nullptr 判断之前已有 CIMFWStrCmp 调用，其对空指针保障未知。

doValueConversion（1330–1436）独立处理 Raw：`*` 设置 specCheckResult 为 `*` 并保留原 numValue；整数和浮点通过 sscanf 赋值，不检查转换返回值，临时数每项重置0。此方法没有调用 doValidCheck，不能假定所有入口先校验。

## 派生计算

doCalculation（1634–1972）按输入顺序原地处理 Derived，已有 `*` 跳过。Delta 调 doCalcDelta，CollectedDataNotFound 变成 `#`，Delta 历史取值及表达式解析仍待深入。

其他计算按表达式的项目名、waferPosition、sitePosition 找引用值。输入 `*` 或结果 `#`、`5`、`6` 的项不加入，但只是退出当前内层查找，不必然使整个派生项失败。完全找不到引用或收集为空时设 `#`；没有拓扑排序证据，派生间依赖可能受输入顺序影响。

| 计算方法 | 公式及本地边界 | doCalculation 的保护 |
|---|---|---|
| Mean，2539–2566 | sum/n，辅助方法未防空 | 已排除空集合 |
| StdDev，2712–2748 | sqrt(sum((x−mean)^2)/(n−1))，辅助方法未防小样本 | 空集排除，单样本设 `#` |
| Range，2614–2655 | max−min，空集返回0 | 非空后调用 |
| Min/Max，2790–2825、2867–2902 | 极值，空集返回0 | 非空后调用 |
| Uniformity，2953–3003 | (max−min)/(2×mean)，不乘100；空集0但未防均值0 | 非空保护不等于均值非0 |

整数派生结果通常强制转换 int 后格式化，等于 INT32 极值时输出 `*`；标准差走浮点分支。浮点分支按数值范围选择格式，部分直接截断到12字符。`%LG` 与实际 CORBA::Double/编译 ABI 的兼容性需编译核实，未声称复现故障。

## 汇总不是实际判限

pdcsp.cpp:1158–1605 的旧 doSpecCheck 整段注释。getTotalResultForSpecCheck（1685–1798）从已有结果汇总：初始 `0`，跳过 `*`，按字符串比较取较大值；全为 `*` 或空输入时结果为 `*`。不能未经码表就称为数值最大或最严重状态。

动作码从全部输入项按遇到顺序去重，包括结果为 `*` 的项；没有执行动作（例如 Hold）的调用。

## 有效判限在工序对象上

PosProcessOperation_i::doSpecCheck（poscimfw/ppcdf/ppcope.cpp:14828–15341）是有效方法。它按 dcSpecIdentifier 找工序 theAssignedDataCollections 中的规格快照，再按项目名找规格项，未调用规格对象的旧 doSpecCheck。

已有结果 `*`、`#` 直接保留；measurementType 为 PJ/PJWafer/PJWaferSite 且已有非空结果时也跳过。找不到指定规格或项目时设置 `*`，这些跳过/未找到分支没有清空原 actionCodes。

| 顺序 | 启用且越界时 | 结果码 |
|---|---|---|
| 1 | value > screenUpper | 5 |
| 2 | value < screenLower | 6 |
| 3 | value > specUpper | 3 |
| 4 | value < specLower | 4 |
| 5 | value > controlUpper | 1 |
| 6 | value < controlLower | 2 |

每项命中后设置结果、拆分对应动作字符串并 continue；不是收集所有越界级别。比较为严格大于/小于，因此恰好相等不触发该限值；重叠或反向阈值按上述分支顺序处理，不证明配置合理。全部未命中设置 `0`，这个分支也未显式清空旧 actionCodes。动作字符串按逗号拆分，没有去空白、去重或过滤空 token 的逻辑；返回动作列表仍不等于执行动作。

## Delta 与表达式的具体含义

doCalcDelta（pdcdf.cpp:2169–2495）要求 Derived，表达式解析后恰好两项且 whichDef 不相同。whichDef=0 对应本次 rawDcItemData，按项目/waferPosition/sitePosition 找数值并带出 waferID 和 itemType；输入星号、结果 #/5/6 或找不到均报 CollectedDataNotFound。前道工序指针必须非空，然后调用 findCollectedDataByWafer，传入初始化 nil 的定义引用。

表达式中 `#.` 标记的项为前道；前道在前时计算 pre−post，本次在前时计算 post−pre，不能统一概括为“本次减前次”。历史值为空记录/项目名空/星号时报找不到；历史结果5/6仅在 SP_SCREENLIMITOVER_NOTCALCULATE_FLAG 存在且不等于字符串 `0` 时排除，这和本次 raw 输入始终排除5/6不同。历史 value 用 strtod，未检查 errno 或尾字符。

findCollectedDataByWafer（ppcope.cpp:7069–7231）在定义引用 nil 时取该前道工序 getAssignedDCDef，再按定义标识访问已分配采集集合。匹配 wafer 有多个 OR 分支：双方 waferPosition 为空、Raw 同 waferID、非空同 waferID、Derived/UserFunction 相关项同 waferPosition，随后匹配 sitePosition；不能简化成总是按 waferID 唯一查找。无匹配时返回初始化记录；内层匹配后只 break 项目循环，外层若有同定义标识后续条目仍可能覆盖结果。未直接在此方法查数据库。

全局 convertFromCalculationExpression（poscimfw/pfwgls/pfwgls.cpp:135–393）按逗号拆项目，再从右侧两个点解析 site/wafer，剩余为 itemName。Delta 模式检查前缀 `#` 以设置 whichDef=1，否则0；普通模式为−1。这是引用列表解析，不是加减乘除表达式求值器。缺少分隔点时有 continue 并保留预分配序列长度；未见完整语法拒绝。CimfwStrtok 以及异常/初始化宏仍待核实，不能假定支持转义、空 token 或任意点号项目名。

## 尚未核实

__120 算法版本、分配到工序的规格快照如何形成及何时刷新、真实交易校验/转换/计算/判限的调用顺序、动作执行、保存与 SPC。已确认工序判限方法存在，但不代表整个交易链完成。
