# 下一工序与支线返回选择

本报告完整阅读四个方法体，沿 Lot 动态入库要求所调用的下一工序链补证据。对象层查询不等于实际推进、生产完成或交易提交。

## 当前路线优先，路线结束再查返回点

`poscimfw/ppcdf/ppcflwx.cpp` getNextProcessOperationSpecificationFor（4533–4739）有效代码先调用 getNextProcessOperationSpecificationOnCurrentRouteFor；返回 nil 时释放 outModuleNumber，再调用 getReturnProcessOperationSpecificationFor。此前版本的长段注释不作为执行逻辑。只有当前路线和返回点都没有后续结果，上一层末道查询才可能得到 nil。

同文件 getNextProcessOperationSpecificationOnCurrentRouteFor（11006–11124）对缺省主流程、模块号及模块流程从上下文补齐，缺失则抛异常。输入当前模块 POS 为 nil 时取得主流程第一工序，否则调用主流程 getNextProcessOperationSpecificationFor。这里区分的是输入 POS 是否为空，不能一概解释成当前工序已完成。

## 跨模块选择

`poscimfw/ppcdf/ppcflw.cpp` PosProcessFlow_i::getNextProcessOperationSpecificationFor（8877–8994）先在输入模块流程中找下一 POS。若找到，保持输入模块号和当前主流程；否则 findNextProcessDefinitionFor 查下一模块。

下一模块存在时取得 activeProcessFlow，若该流程 isNewlyCreated，则改取 previousActiveProcessFlow，任一必要流程为 nil 抛异常。随后取目标模块默认路径第一 POS，返回对应模块流程。这里没有循环跳过多个空模块；默认路径首 POS 和查下一模块的具体算法仍由被调用方法决定。不能把此方法简化成“工序编号加一”，也不能将 newlyCreated 等同于已可执行生产版本。

## 支线返回点与配置

`ppcflwx.cpp` getReturnProcessOperationSpecificationFor（9860–10185）先令 outseqno=inseqno，读取 SP_BRANCH_RETURN_ACTIVE_MODULE，用 atoi 转为模式，大于1复位为0。负数没有同样被归零，代码走非零分支；实际环境配置尚未提供。

getReturnOperationFor(inseqno) 返回记录的 operationNumber 非 NULL 时，outseqno 增为 inseqno+1。模式0按保存的模块流程和主流程对象引用解析，并在模块内按返回工序号查询，必要对象或 POS 缺失时抛异常。

非零模式读取 backupOperation；inseqno=0 时从当前工序取得相关主定义，否则从前一 backupOperation 取得。对 Rework/DurableRework 类型，存在 reworkOutKey 时解析第三段作为回退模块号；否则从备份工序取得主/模块流程及 POS，并查询上一工序的模块号。其他类型使用备份工序模块号。

返回模块号与推得模块号相同时，使用保存的模块流程。不同则先在保存主流程中按完整工序号解析；查不到才回退保存模块流程查询。该分支不能解释为始终使用最新 active 模块。返回记录 operationNumber 为 NULL 时保留初始化结果，不推进序号；记录获取、初始化宏及字符串空值约束仍需验证。

## 异常及尚未闭合的链

### 默认路径及版本映射补证据

完整读取 `ppcflw.cpp` nextProcessOperationSpecification（2918–3127）。当前 POS 为 nil 时委托 firstProcessOperationSpecification；当前流程 active 时直接取默认路径后继。非 active 时从根定义取得 active 流程，若 newlyCreated 则取 previousActive。先按当前工序号查有效流程，再取其后继；找不到当前号时，先在旧流程取后继，再按后继号尝试映射。若后继号也无法映射则保留旧流程后继。因此查询输出可能继续带旧流程，不能建模成强制迁移到最新版本。这里依赖工序号对应，未在方法内验证跨版本工艺语义等价。

完整读取 findNextProcessDefinitionFor（7989–8133）：active 主流程直接取默认集合后继。非 active 时取得 activeMainProcessFlow（newlyCreated 则 previousActiveMain），先按当前模块号在有效流程定位；不存在时在旧流程取后继模块，再尝试按该后继号映射有效流程，映射失败继续使用旧模块及旧流程。

完整读取 getFirstProcessOperationSpecification（8723–8801）：第一模块必须存在，模块 active 流程必须存在，newlyCreated 时回退 previousActive，再取默认路径第一 POS。缺第一模块抛异常，不是直接返回“流程已结束”。firstProcessDefinition 的具体实现仍待展开。

完整读取 PosProcessFlow_i::nextProcessOperationSpecificationOnDefaultPathFrom（3238–3305）：窄化输入 POS 后，以其 operationNumber 作为 theFlow->getAfter 的键并解析结果；未检查 getAfter 返回值，末端行为依赖输出初始化及解析宏。基类同名方法（`smtchcmf/prcssdfn/prcssflw.cpp` 329–387）则以字符串化对象引用作键，并检查 getAfter 成功才解析，不能把两者键约定混为一谈。

完整读取 findNextProcessDefinitionOnDefault（8599–8677）：从 theProcessDefinitions->getAfter 取后继记录，若标识版本为 Active 则解析 activeObject，随后返回记录中的定义引用。getAfter 失败分支仍进入 GET_OBJECTIDENTIFIER 宏，没有在方法体显式返回 nil；默认结构和宏决定末端行为，需继续验证。

完整读取基类 firstProcessOperationSpecificationOnDefaultPath（55–123）：getFirstValue 失败或解析对象为 nil 时都抛 ProcessOperationSpecificationRetrievalFailedSignal。这种空路径错误与合法末道不同，不能合并为“无下一工序”。有序集合的装配顺序、键约束和 getAfter 实现仍待展开，不推断为编号数值排序。

### 返回记录与首模块读取补证据

完整读取 `ppcflwx.cpp` getReturnOperationFor（7313–7386）：初始化返回结构，seqno 小于集合长度时取得序列，用空循环将 indx 从0递增到seqno，然后复制对应返回记录四个字段。没有显式 seqno>=0 检查；负数在该循环中不会递增 indx，因此可能读取第0项。超过上界时返回初始化结构，默认字段依赖结构和初始化宏；未找到记录不等于方法返回 nil 指针。

完整读取 getBackupOperationFor（8253–8291）：初始化游标和返回结构，当 seqno 小于长度时按游标读取 seqno+1 次。然后无条件从局部 value 复制 processOperation 和 reworkOutKey。负数或超过上界时可能没有任何读取；value 的默认构造与字段初始化定义当前未确认，因此记录为条件风险，不能断言这些路径必然安全或必然崩溃。getNextEntry 返回值也没有逐次检查，集合长度与游标并发一致性仍需证据。

完整读取 `ppcflw.cpp` firstProcessDefinition（8189–8297）：active 时读当前默认集合首项；非 active 时优先 activeMain（newlyCreated 则 previousActiveMain），该流程首项为 nil 才回退旧流程首项。

完整读取 firstProcessDefinitionOnDefault（8489–8569）：getFirstEntry 成功后处理 Active 版本标识并解析 activeObject。但 getFirstEntry 失败后仍把局部 key 复制到 outKey 并执行对象宏；key 在方法内未显式初始化。集合失败输出约定和宏行为决定实际影响，不把本地代码直接解释为可靠的空集合返回 nil。首工序和后继工序的失败语义需要分别验证。

上述方法对异常清理部分输出并传播或映射，不执行 Lot 状态推进或入库。尚未展开默认路径装配、集合getAfter/getFirstEntry、记录默认构造和序号调用约束，也未验证外层交易和并发版本切换。图谱中的方法间调用只覆盖可见直接调用；对象动态调用目标仍保留边界。
