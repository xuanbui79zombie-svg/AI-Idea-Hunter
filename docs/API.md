# API

## 状态

`Planned` | `In Use` | `Not Applicable`

当前状态：`<API_STATUS>`

## 基本信息

- **Base URL**：`<BASE_URL>`
- **版本策略**：`<VERSIONING_STRATEGY>`
- **数据格式**：`application/json`
- **字符编码**：`UTF-8`

## API 设计规则

- 资源、动作、状态码和错误语义保持一致。
- 请求和响应必须有明确 Schema，并验证所有外部输入。
- 分页、过滤、排序和幂等性规则必须文档化。
- 破坏性变更必须升级版本或提供兼容迁移期。
- 日志不得记录令牌、密码或敏感请求内容。

## 认证与授权

- **认证方式**：`<AUTHENTICATION_METHOD>`
- **授权模型**：`<AUTHORIZATION_MODEL>`
- **令牌有效期**：`<TOKEN_LIFETIME>`
- **权限范围**：`<SCOPES_OR_ROLES>`

## 通用响应

### 成功响应

```json
{
  "data": {},
  "meta": {}
}
```

### 错误响应

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "requestId": "request-id"
  }
}
```

## 端点

### `<METHOD> <PATH>`

**用途**：`<PURPOSE>`

**权限**：`<REQUIRED_PERMISSION>`

**请求参数**：

| 参数 | 位置 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `<PARAMETER>` | path/query/body/header | `<TYPE>` | Yes/No | `<DESCRIPTION>` |

**成功响应**：`<STATUS_CODE>`

```json
{
  "data": {}
}
```

**错误情况**：

| 状态码 | 错误代码 | 条件 |
| ---: | --- | --- |
| 400 | `VALIDATION_ERROR` | 请求数据无效。 |
| 401 | `UNAUTHENTICATED` | 缺少或使用了无效凭据。 |
| 403 | `FORBIDDEN` | 当前身份没有操作权限。 |
| 404 | `NOT_FOUND` | 资源不存在。 |
| 409 | `CONFLICT` | 当前状态与操作冲突。 |
| 500 | `INTERNAL_ERROR` | 未预期的服务错误。 |

## 限流与重试

- **限流策略**：`<RATE_LIMIT_POLICY>`
- **重试条件**：`<RETRY_CONDITIONS>`
- **退避策略**：`<BACKOFF_STRATEGY>`

## API 测试要求

- 覆盖成功、验证失败、未认证、无权限、资源不存在和冲突场景。
- 验证响应 Schema、状态码、错误代码和权限边界。
- 对幂等接口验证重复请求行为。
- 对外部集成使用可控的测试替身，不依赖生产服务。
