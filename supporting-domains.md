# 产品规格、计划、人员与支撑领域

本页为代码层面职责地图与已读样板，不能替代完整交易审计。

## 产品规格与工艺版本

`poscimfw/pprsp/pprsp.cpp:4363–4433` 的 PosProductSpecification_i::getProcessDefinition 检查工艺定义 identifier 中的版本：Active 时解析对象并取 getActiveObject，非空检查失败则异常；其他版本调用基础 ProductSpecification_i::getProcessDefinition（4374–4392）。因此产品的工艺关联不应只保存一个不带版本语义的名称。

## 计划与工序排程

`poscimfw/ppl/pltsch.cpp:271–360` 的 createLotOperationScheduleNamed 检查同 identifier 的排程是否存在，存在抛 DuplicateIdentifierSignal；获取对象工厂、创建新排程、设置管理器和 identifier，标脏后加入 theLotOperationSchedules（282–309）。这是排程对象管理，不等同于已实现全厂优化排程算法。

后续完整阅读已区分管理器创建、工序计划字段、Lot自身计划日期和EDD排序。EDD直接读取FRLOT.PLAN_END_TIME，Transient重名计划查询另有选择路径，详见 [计划与派工时间](planning-deep.md)。

## 人员与权限组

`poscimfw/ppsmg/pprivgr.cpp:674–715` 的 addPerson 对空人员直接返回；通过宏把人员加入组列表，然后查找该人员是否已关联当前权限组，没有时调用 aPerson->addPrivilegeGroup（680–697）。权限组成员关系有双向维护线索；真正交易授权仍需调用处证据，不能把组成员关系直接等同于某操作已授权。

## 认证模式与有效期

`poscimfw/patmg/pathmgr.cpp:295–459` 的 authenticate 在 Authserver 模式标志启用时抛错，说明此本地方法禁用（312–320）。本地路径查找人员，对不存在人员、密码校验失败、密码有效期到期分别有异常（325–396）；verifyPassword 在有效期判断之前调用（386–396）。外部认证服务的行为不在本代码证明范围内。

## BOM/零部件

`poscimfw/pptsmg/pbom.cpp:463–515` 的 findPartsFor 创建返回结构后在 theParts 中按标识查找；475–478 的未找到分支为空，没有显式抛“零件不存在”。因此不能按 find 命名或常见习惯自动补写异常规则；具体返回默认值由初始化宏决定，尚缺定义。

## 其他支撑域的定位

- pfa：工厂、区域、库区等对象；以 IDL 分类及 parea/pbank 等实现为依据。位置模型不等于生产部署拓扑。
- pcdmg：类别、代码、设备状态代码等主数据；以 Code Management 的接口分类为依据。
- pmsds：消息定义、目标人员和分发配置；不能仅凭配置接口声称实际投递到邮件或其他外部渠道。
- pabcl/pfwgls：公共属性、框架辅助与全局定义。
- iiop：CORBA/IIOP 辅助实现；不推断现网端口、网络安全边界或服务器拓扑。
- ras：跟踪日志与诊断支撑；构建文件有静态库对象打包记录，不证明运行日志已启用。
- smtchcmf：基础对象实现，包含 Lot、ProductRequest、ProcessFlow、Machine 等；与 Pos 扩展的关系要结合每个 IDL 继承或实际基础类调用逐项核对。

更完整的目录/接口/方法/表证据由业务地图、method-index.json 和 source-graph.json 提供；本页不将未逐个读取的所有方法描述为已核实业务规则。
