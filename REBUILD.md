# 重建与查询

在 D:/works/cxmt/xmes 执行：

```powershell
node analysis/mes-cpp/rebuild.mjs
node analysis/mes-cpp/query.mjs search PosLot
node analysis/mes-cpp/query.mjs table FRLOT
node analysis/mes-cpp/query.mjs facts rework
```

追加 --doxygen 会先调用已安装的 Doxygen，启用 Graphviz 重新生成文档；运行时间与图数量有关。

```powershell
node analysis/mes-cpp/rebuild.mjs --doxygen
```

重建不会运行 MES 或连接数据库，也不会修改 fw_cpp_sqx。它更新 analysis/mes-cpp 的派生产物。四张 Archify 图保留各自生成与自动检查回执；源码变更后应重新核实图含义，而不是仅更新图的检查时间。

人工事实由 build-knowledge.mjs 维护，源码文件及证据片段哈希保存在 evidence-lock.json。来源发生变化时脚本会失败，避免旧业务结论被重新计算的哈希掩盖。应复核相关事实后再有意识地更新证据锁，不直接删除锁以绕过检查。

方法文本解析不覆盖所有 C++ 语法，SQL 文本解析不覆盖动态 SQL、所有逗号连接、带引号标识符和完整 CTE 语义。查询结果是定位工具，不是编译器或数据库验证结论。
