# 身份认证、权限成员与权限合并

完整方法体审阅，来源相对 fw_cpp_sqx。区分身份校验、权限组关系、权限数据汇总与交易执行授权；未连接认证服务或读取实际用户凭据。

## 本地 authenticate 的范围

PosAuthenticationManager_i::authenticate（poscimfw/patmg/pathmgr.cpp:295–459）在 SP_AUTH_AUTHSERVER_AVAILABLE 等于启用常量时直接抛“Authserver模式禁用本入口”的框架异常；它没有在这个分支转发到外部认证服务。

本地路径取得 PersonManager，按 UserId 查找并 narrow PosPerson，失败报 UserIdNotFound。取得改密时间与过期周期，按时间差转换为天数，并对未来改密时间调整符号；先 verifyPassword，失败报 InvalidPassword，再在 expiredPeriod非0且days≥period时报PasswordExpired。没有在这里创建会话、枚举权限或执行交易动作；用户禁用状态、锁定次数等也不能凭常见认证流程补进该方法。

setExpiredPeriod/getExpiredPeriod/getPasswordChangeTimeStamp（ppsmg/pperson.cpp:2032–2044、2073–2084、2156–2167）只写/读字段；周期0在上述入口跳过有效期判定，负值未在 setter 本地拒绝，实际配置约束待查。日期与持续时间的边界/时区/天数舍入仍需进一步验证。

## 校验器的两条分支

PosPerson_i::verifyPassword（1862–1884）优先使用非空 theEncryptedPassword，经 SPVerifyPassword 校验；没有该值时才用字符串比较 thePassword。不能只因成员名带 Encrypted 就认定所有记录使用同一算法。

SPVerifyPassword（pfwgls/spencrypt.cpp:150–165）在可见非_WIN32编译分支中，AIX以锁保护 crypt，其他平台调用 crypt_r，将存储字符串作为校验参数再比较返回值。具体算法/格式由平台和存储字符串决定；空返回处理、平台库约束及Windows实现未在此证实。这里没有实际用户密码，也未做算法强度或生产安全结论。

时间基准的一个未知已缩小：TimeStampImpl 默认构造（smtchcmf/tmsrvcsc/timstamp.cpp:914–917）调用 init（890–906），正常分支从 gettimeofday 取得时间；不是凭变量名猜“当前时间”。失败分支调用 makeNull 后仍有后续赋值，需运行条件验证。另完整读取复制构造（926–930）及字符串构造（933–997）：后者要求长度26及sscanf返回13项，再由mktime转换；分隔符和日期归一化不是严格格式拒绝的同义词。不能把这一构造器样板外推为所有TimeStamp赋值入口已验证。

## 人员与组是双向关系

PosPerson.addPrivilegeGroup/removePrivilegeGroup（pperson.cpp:2745–2787、2823–2862）和 PosPrivilegeGroup.addPerson/removePerson（pprivgr.cpp:674–715、751–793）先修改本地集合，再查对侧是否仍需回调，忽略部分重复/找不到异常。add传nil直接返回，remove传nil报找不到。不能据双向维护代码认定跨对象修改原子，或者调用这些配置方法本身已有交易授权守卫。

allPrivilegeGroups/findPrivilegeGroupNamed（pperson.cpp:2891–2935、2964–2973）通过集合/查找宏返回引用，默认与失联行为需宏定义。属于组只提供后续权限数据来源，不直接等于允许某项业务动作。

## 权限条目与覆盖规则

组 addPrivilege（pprivgr.cpp:1028–1057）按 privilegeID 防重复；removePrivilege（1089–1112）找不到抛异常。allPrivileges（1141–1185）返回集合；findPrivilegeNamed（1214–1259）初始化记录后查找，未检查返回布尔值，不显式抛找不到。

setPrivilegeGroupInfo（1307–1378）更新描述、subSystem、category、组ID，清空重建权限条目。重复 privilegeID 只保留首次加入项；本方法未验证 permission 是否属于允许码表。未知permission的含义不能自动解释成拒绝或允许。

## 两个权限查询接口不等价

allPrivilegesFor（pperson.cpp:3519–3632）要求subSystem非空；category为空时不筛category，然后按组顺序直接追加全部条目，保留重复权限。

allOperablePrivilegesFor（3268–3456）使用相同筛组条件，但以“真实组category + 点 + privilegeID”为key合并：

| 已有值 / 新值 | 行为 |
|---|---|
| 已有Access | 保留已有 |
| 与已有相同 | 保留已有 |
| 新值NoAccess | 保留已有 |
| 其他组合 | 用新值替换 |

因此不是“拒绝优先”。Access具有保留优先性，其他中间值的合并还可能受组遍历顺序影响。该方法并未过滤掉最终NoAccess，而是返回permission值，由调用方解释。

两个接口返回的 category 都复制调用参数；当传空category查询所有组时，结果category仍为空，不能从返回结构直接恢复真实组category。合并接口从组合key最后一个点之后取privilegeID，输入标识是否允许点号需配置约束。不能省略这些边界再声称已得到标准RBAC授权判定。

## 交易授权仍未还原

在 fw_cpp_sqx 的当前检索范围，看到这些接口定义及组内调用，尚未找到实际业务交易在执行前调用权限查询并强制拒绝的完整链。外部Authserver、登录协议、事务服务和客户端过滤均不能从配置数据模型推断。当前能证明本地身份校验和权限汇总规则，不能证明每个MES动作已经受其保护。
