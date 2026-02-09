# アプリケーション設計書

## 1. 全体アーキテクチャ

Nuxt 3 のフルスタック機能（Nitro Server）を活用し、フロントエンドとバックエンドを単一のリポジトリ・プロセスで完結させます。

```mermaid
graph TD
    User[管理者 / ユーザー] -->|Access| Apache[Apache Reverse Proxy]
    Apache -->|Forward| Nuxt[Nuxt 3 Server (Nitro)]
    
    subgraph Nuxt 3 Application
        Auth[Auth Middleware]
        API[API Routes /server/api]
        Redirect[Redirect Route /server/routes]
        Page[Admin Pages /pages/admin]
    end
    
    Nuxt -->|Query| DB[(MySQL Database)]
    Nuxt -->|OAuth2| Discord[Discord API]
```

## 2. ディレクトリ構成

Nuxt 3 のベストプラクティスに基づいた構成です。

```text
/
├── prisma/                 # Prisma Schema & Migrations
│   └── schema.prisma
├── server/
│   ├── api/                # API Endpoints
│   │   ├── auth/           # 認証関連 (login, callback)
│   │   └── links/          # リンク管理 (CRUD)
│   ├── middleware/         # サーバーサイドミドルウェア (認証チェック)
│   ├── routes/             # リダイレクト用ルート (/:code)
│   └── utils/              # ユーティリティ (JWT, PrismaClient)
├── pages/
│   ├── login.vue           # ログインページ
│   └── admin/              # 管理画面 (要認証)
├── components/             # UIコンポーネント
├── layouts/                # レイアウト
└── .env                    # 環境変数
```

## 3. データモデル (Prisma Schema)

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Link {
  id          Int      @id @default(autoincrement())
  shortCode   String   @unique @db.VarChar(10) // 7-10文字
  originalUrl String   @db.Text
  enabled     Boolean  @default(true)
  clicks      Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([shortCode])
}
```

## 4. 認証・認可フロー

1.  **ログイン**: `/api/auth/discord/login` へアクセスし、Discord OAuth2 認証ページへリダイレクト。
2.  **コールバック**: `/api/auth/discord/callback` で認可コードを受け取り、Discord API で Access Token と User Info を取得。
3.  **ID検証**: 取得した `id` が `ALLOWED_DISCORD_ID` 環境変数と一致するか確認。
4.  **セッション発行**: 一致する場合、JWT (User ID含む) を署名し、`HttpOnly, Secure, SameSite=Lax` 属性の Cookie に保存。
5.  **アクセス制御**: 
    - API: Server Middleware で Cookie 内の JWT を検証。
    - UI: Route Middleware で認証状態を確認し、未認証ならログインページへ。

## 5. セキュリティ対策

-   **不正スキーム対策**: URL登録時に `javascript:`, `data:`, `vbscript:` 等の危険なスキームを正規表現でブロック。
-   **Cookie セキュリティ**: `HttpOnly` (JSからアクセス不可), `Secure` (HTTPS必須) を設定。
-   **短縮コード**: `nanoid` 等を使用し、衝突しにくく推測しにくい文字列を生成。
-   **環境変数**: シークレットキーやIDは必ず `.env` で管理。

## 6. API設計

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| GET | `/api/auth/discord/login` | Discord認証開始 | - |
| GET | `/api/auth/discord/callback` | コールバック処理 | - |
| GET | `/api/auth/me` | 現在のユーザー情報 | Required |
| GET | `/api/links` | リンク一覧取得 | Required |
| POST | `/api/links` | リンク作成 | Required |
| PATCH | `/api/links/:id` | リンク更新 (無効化等) | Required |
| DELETE | `/api/links/:id` | リンク削除 | Required |
| GET | `/:code` | 短縮URLリダイレクト | Public |
