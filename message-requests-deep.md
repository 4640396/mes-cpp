# 消息请求队列：编译分支与消费边界

`poscimfw/pmsds` 是消息分发模块。本报告完整读取管理器四个公开请求方法及三个SQL实现，不把入队解释为通知已送达。

## 两种编译分支

`pmsdnmg.cpp` addMessageRequest（570–611）在 TRANSIENT_MANAGER 下调用 _addMessageRequest；其他构建使用 theMessageRequests，以输入 floorEventTimeStamp 为键，已存在则抛重复异常。removeMessageRequest（652–683）在集合分支按该键移除，不存在抛未找到；SQL分支委托删除方法。

allMessageRequests（713–762）分别取集合序列或调用 _allMessageRequests。本轮完整读取公开方法，但尚未展开 _allMessageRequests 实现，因此不推断全部查询的排序和分页。

firstMessageRequest（798–851）初始化 retVal=NULL；其 INIT_POINTERDATAMEMBER 分配语句在原文件中被注释。非 TRANSIENT_MANAGER 分支随后把 *retVal 传给 getFirst，这是明确的空指针解引用表达式风险。是否构建了这一分支、实际调用是否到达尚未验证；不能据此宣称线上故障。TRANSIENT_MANAGER 则直接接收 SQL 方法返回值。

## 数据库入队不是原事件时间排序

`pmsdnmgdb.sqx` _addMessageRequest（291–418）将消息ID、Lot/设备/路线owner、Lot状态、原因、用户、工序、定义、设备、路线和消息文本投影到宿主变量。EVENT_TIME 使用 TIMESTAMP(GENERATE_UNIQUE()) + CURRENT TIMEZONE 生成，未使用输入 floorEventTimeStamp。随后插入 FRMSGREQ。

因此数据库分支排序键代表此处生成的队列时间，不能直接解释为原始生产事件时间；集合分支判重与数据库分支也不能视为等价。唯一性和精度需要数据库DDL与函数环境验证，当前没有DDL约束证据。

## 读取、删除与投递不是同一步

_firstMessageRequest（448–613）查询 EVENT_TIME 为全表 MIN(EVENT_TIME) 的记录，成功则创建返回结构并复制全部字段；SQLCODE=100 返回 NULL，其他错误抛 FrameworkError。没有在此领取、删除、加处理标志或发送通知。若最早键非唯一，单行SELECT的行为取决于实际数据和SQL错误，不能假定自动选一条。

_removeMessageRequest（641–657）把输入时间戳复制到31字节宿主缓冲区，然后按 EVENT_TIME 删除 FRMSGREQ 并调用SQL错误宏；没有核对消息ID或返回受影响行数。这里使用 strcpy，输入长度约束待接口与调用方验证。

本段没有显式锁定或原子领取机制；多个消费者是否会读到同一请求、发送失败如何重试、读取后何时删除、事务如何提交，都依赖外层消费者。当前只证明队列存储接口，不能承诺通知已达、仅投递一次或消息不会丢失。

## 本体及后续

### 消息定义和收件人配置补证据

完整读取 `pmsgdfn.cpp` setMessageDistributionInfo（1287–1394）：先设置描述、媒体ID、消息类型、模板文件名、分发类型、主/次消息，再取得人员管理器，清空 theDestinationPersons，按输入人员标识解析并重新添加；已存在的标识跳过。末尾设置 subsystem 和替换用户数据。人员解析失败时前面字段及集合已发生修改，方法没有局部恢复，原子性依赖外层事务。不会因媒体、分发类型名字就证明实际选中了某发送渠道。

完整读取 addDestinationPerson（1037–1055）、removeDestinationPerson（1085–1103）、allDestinationPersons（1133–1178）、findDestinationPersonNamed（1208–1218）：添加/删除依赖按标识操作的对象引用集合宏，分别映射重复和未找到异常；枚举及查找仍依赖宏加载。这里保存人员对象关系，没有实际地址解析、模板渲染或发送动作。

完整读取七对配置setter/getter：媒体ID（462–476、505–515）、类型（544–558、587–597，getter源码拼写为 getMesssageType）、模板文件（626–640、669–679）、分发类型（708–722、751–761）、主消息（790–804、833–843）、次消息（872–886、915–925）、子系统（954–968、997–1007）。setter 标脏后写状态/字符串宏，getter读对应宏，方法体没有校验模板文件存在、渲染内容或渠道可达性。未展开宏，不能据此断言任意输入在整个系统都被接受。

本轮在可见 C++/SQX 中搜索 firstMessageRequest、addMessageRequest、getTemplateFileName 调用，结果主要是定义及管理器内部委托；未找到实际发送消费者。这是当前可见材料的搜索边界，不证明外部进程或动态调用不存在，也不据此创建“请求必然发送给全部配置人员”的事实边。

MessageDistributionManager 对应请求队列管理，MessageDefinition 对应消息配置；它们与 EventManager 的生产事件待处理链分开建模，不凭名称合并。现有概念契约不等于消息定义配置、收件人选择和实际发送链已完成分析。

### 定义生命周期与删除检查补证据

完整读取 pmsdnmg.cpp createMessageDefinitionNamed（314–337）：用系统键创建宏传入标识、查询和工厂方法，重复异常映射仍依赖宏。findMessageDefinitionNamed（515–531）按编译分支使用集合或SQL。完整读取 pmsdnmgdb.sqx _findMessageDefinitionNamed（107–160）：查 FRMSGDEF 的对象引用和标识长度，SQL成功但输入长度与数据库长度不同则返回 nil；其他结果交给对象宏。不能凭可见代码推断所有SQL错误都被视为未找到。

完整读取 removeMessageDefinition（369–404）：非nil定义先 CIMFW_clear，再在非TRANSIENT_MANAGER构建下从集合移除，最后调用删除宏；nil抛未找到。完整读取 pmsgdfn.cpp CIMFW_clear（256–269）仅委托 NamedEntity_i::CIMFW_clear，基类内部未在本轮展开。公开删除体没有显式检查占用或删除 FRMSGREQ；不能据此宣称会自动丢弃排队消息，也不能排除删除宏/外层交易的额外门禁。

完整读取 removeAllMessageDefinitions（855–921）：先取定义序列，再逐个调用单项删除，只忽略未找到异常，其他异常向外传播。并非一条批量SQL，也未在本地证明所有删除原子提交。

完整读取 pmsgdfdb.sqx checkForDeletion（104–280）：先按 MSG_ID 计数并枚举 FRMSGREQ 的 EVENT_TIME；再检查 FRQTIME_ACTION 中 WATCHDOG_REQ=1 且 ACTION_DONE_FLAG=0、MSGDEF_ID匹配的记录，枚举时联接 FRQTIME 取得Lot、目标路线/工序和动作。两个类别各自使用调整后的消息上限，并非共同上限。动作表计数和联接枚举的行数可能依赖引用一致性，不能一概视作相同。返回检查消息不执行删除或拒绝删除；已完成及非watchdog动作不在这个条件中。

### 基础清理和工厂删除补证据

完整读取 smtchcmf/rsrcclss/nmdntity.cpp NamedEntity_i::CIMFW_clear（209–218），它继续委托 CIMFWBO_i::CIMFW_clear；后者在 smtchcmf/frmwrkgl/cimfwbo.cpp 120–124 的完整方法体只有trace。因此这条可见清理链没有调用 checkForDeletion，也没有清空消息队列。检查仍可能位于其他层，不能把空基类清理当删除许可证明。

完整读取 pmsds/msdsmnsp.cpp 工厂 deleteCIMFWObject 两个预处理分支：IMIZED 方法（97–153）窄化到 MOFW_ManagedObjectBase，释放窄化增加的引用后调用 remove，特定异常交给映射宏，剩余 catch(...) 为空。非IMIZED方法（158–169）窄化到 CIMFWBO 后取得引用计数，循环释放直到计数基准2，本地没有nil检查或SQL删除。两个方法是互斥构建分支，不是按顺序执行。对象remove、引用生命周期及实际持久化删除取决于外部CORBA/MOFW实现；DELETE_CIMFW_OBJECT宏定义在当前可见源码搜索中未找到，故不补造管理器到工厂的确定调用边。

后续需追外层删除门禁、删除宏、发送消费者、编译配置、数据库DDL、时间戳长度、事务和重试策略。此领域已新增完整方法审阅，但尚未完成全部语义分析。
