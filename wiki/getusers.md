---
title: PAAS API Documentation v1.0.0
language_tabs:
  - "'shell": Shell'
  - "'http": HTTP'
  - "'javascript": JavaScript'
language_clients:
  - "'shell": ""
  - "'http": ""
  - "'javascript": ""
toc_footers: []
includes: []
search: true
highlight_theme: darkula
headingLevel: 2

---

<!-- Generator: Widdershins v4.0.1 -->

<h1 id="paas-api-documentation">PAAS API Documentation v1.0.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

API documentation for PAAS platform

Base URLs:

* <a href="https://paas.bworks.app/api">https://paas.bworks.app/api</a>

# Authentication

- HTTP Authentication, scheme: bearer 

<h1 id="paas-api-documentation-default">Default</h1>

## getUsers

<a id="opIdgetUsers"></a>

> Code samples

`GET /users`

*Retrieve a list of all users*

Retrieve a list of all users.

<h3 id="getusers-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string|true|Bearer token for authentication|

> Example responses

> 200 Response

```json
[
  {
    "isShowContact": false,
    "isShowEmail": false,
    "issContractDev": true,
    "isdAppDev": true,
    "isApproved": true,
    "isNotified": true,
    "skills": [],
    "_id": "6603d0afe9aceb37b1bb6ced",
    "username": "demo",
    "fullName": "Demo user",
    "createdAt": "2022-11-20T12:52:06.702Z",
    "__v": 0,
    "completedAt": "2023-02-15T07:34:35.957Z",
    "nonce": "7061617378376a64364f38645945653245365042756466646165797643387a4a69713243",
    "walletAddress": "addr1qxpel0kkv0ewx5wdxa3kfzsgy8hvjqkyy6amwelc6m69w45uaauv0tfwhmtcmn69rpakh5erdrspzpqxauyf5t0y8d8s32lnda",
    "authType": "email",
    "roles": [
      "admin",
      "user"
    ]
  }
]
```

<h3 id="getusers-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successfully retrieved the user details.|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Authentication failed. Please check your API key or bearer token.|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|The user with the specified ID was not found.|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|An error occurred on the server.|None|

<h3 id="getusers-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[User](#schemauser)]|false|none|none|
|» isShowContact|boolean|false|none|none|
|» isShowEmail|boolean|false|none|none|
|» issContractDev|boolean|false|none|none|
|» isdAppDev|boolean|false|none|none|
|» isApproved|boolean|false|none|none|
|» isNotified|boolean|false|none|none|
|» skills|[string]|false|none|none|
|» _id|string|false|none|none|
|» username|string|false|none|none|
|» fullName|string|false|none|none|
|» createdAt|string(date-time)|false|none|none|
|» __v|integer|false|none|none|
|» completedAt|string(date-time)|false|none|none|
|» nonce|string|false|none|none|
|» walletAddress|string|false|none|none|
|» authType|string|false|none|none|
|» roles|[string]|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

# Schemas

<h2 id="tocS_User">User</h2>
<!-- backwards compatibility -->
<a id="schemauser"></a>
<a id="schema_User"></a>
<a id="tocSuser"></a>
<a id="tocsuser"></a>

```json
{
  "isShowContact": true,
  "isShowEmail": true,
  "issContractDev": true,
  "isdAppDev": true,
  "isApproved": true,
  "isNotified": true,
  "skills": [
    "string"
  ],
  "_id": "string",
  "username": "string",
  "fullName": "string",
  "createdAt": "2019-08-24T14:15:22Z",
  "__v": 0,
  "completedAt": "2019-08-24T14:15:22Z",
  "nonce": "string",
  "walletAddress": "string",
  "authType": "string",
  "roles": [
    "string"
  ]
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|isShowContact|boolean|false|none|none|
|isShowEmail|boolean|false|none|none|
|issContractDev|boolean|false|none|none|
|isdAppDev|boolean|false|none|none|
|isApproved|boolean|false|none|none|
|isNotified|boolean|false|none|none|
|skills|[string]|false|none|none|
|_id|string|false|none|none|
|username|string|false|none|none|
|fullName|string|false|none|none|
|createdAt|string(date-time)|false|none|none|
|__v|integer|false|none|none|
|completedAt|string(date-time)|false|none|none|
|nonce|string|false|none|none|
|walletAddress|string|false|none|none|
|authType|string|false|none|none|
|roles|[string]|false|none|none|

