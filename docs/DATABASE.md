# Database

## 状态

`Planned` | `In Use` | `Not Applicable`

当前状态：`<DATABASE_STATUS>`

## 数据存储概览

- **数据库类型**：`<DATABASE_TYPE>`
- **版本**：`<VERSION>`
- **托管方式**：`<HOSTING>`
- **主要用途**：`<PURPOSE>`

## 数据建模规则

- 表和字段使用一致、明确的命名规范。
- 主键、外键、唯一约束和空值语义必须显式定义。
- 时间统一使用 UTC 存储，并在展示层转换时区。
- 敏感字段必须分类，按需加密或脱敏。
- 数据保留和删除策略必须与产品及合规要求一致。

## 实体关系

```text
<ENTITY_RELATIONSHIP_DIAGRAM>
```

## 数据字典

| 实体 | 字段 | 类型 | 必填 | 约束 | 说明 |
| --- | --- | --- | --- | --- | --- |
| `<ENTITY>` | `<FIELD>` | `<TYPE>` | Yes/No | `<CONSTRAINT>` | `<DESCRIPTION>` |

## 索引策略

| 索引 | 字段 | 类型 | 查询场景 | 成本 |
| --- | --- | --- | --- | --- |
| `<INDEX>` | `<FIELDS>` | `<TYPE>` | `<QUERY>` | `<TRADE_OFF>` |

## 迁移流程

1. 创建可审查、可重复的迁移脚本。
2. 在隔离环境验证前向迁移和回滚。
3. 评估锁表、数据量、兼容窗口和停机风险。
4. 备份关键数据并记录恢复步骤。
5. 部署后验证数据完整性和核心查询。

## 安全与隐私

- `<ACCESS_CONTROL>`
- `<ENCRYPTION_POLICY>`
- `<RETENTION_POLICY>`
- `<AUDIT_REQUIREMENTS>`

## 备份与恢复

- **备份频率**：`<BACKUP_FREQUENCY>`
- **保留周期**：`<RETENTION>`
- **RPO**：`<RPO>`
- **RTO**：`<RTO>`
- **恢复演练**：`<RESTORE_TEST_PLAN>`
