# AI用プロンプト文
あなたはフルスタックエンジニアです。
Nuxt 3（TypeScript）を用いて、以下の要件を満たすWebアプリケーションの設計と実装例を、実務レベルで詳細に出力してください。

## 【目的】
自分専用で使えるURL短縮・リダイレクトサービスを作成する。
Discord OAuth2でログインでき、許可されたDiscord IDのユーザーのみが管理画面にアクセス可能とする。

## 【必須要件】
1. フレームワークは Nuxt 3（Nitro Server 使用）
2. 言語は TypeScript
3. Discord OAuth2（scope: identify）を使用
4. ログイン後、DiscordユーザーIDが特定の1人（環境変数で指定）と一致しない場合は403で拒否
5. JWTを HttpOnly Cookie に保存して認証を行う
6. 長いURLをランダムな短縮コード（7〜10文字）に変換する
7. 短縮URL形式は https://link.example.com/{code}
8. 短縮URLへアクセスした場合、302リダイレクトを行う
9. 管理画面はログイン必須
10. 短縮URLの作成・一覧表示・無効化ができる
11. javascript: や data: スキームは拒否する
12. Cloudflare などのCDN配下での運用を想定する

## 【データベース要件】
- Prisma ORM を使用
- テーブル例：
  - links
    - id
    - shortCode（UNIQUE）
    - originalUrl
    - enabled
    - createdAt

## 【出力してほしい内容】
- 全体アーキテクチャ図（テキストベースで可）
- ディレクトリ構成
- Discord OAuth2 の実装例（認可 → コールバック）
- 認証ミドルウェア実装
- 短縮URL作成API
- リダイレクトAPI
- Prisma schema 定義
- セキュリティ上の注意点
- 本番運用時の注意点

## 【制約】
- 実際に動作するコードを前提にすること
- 抽象的な説明だけで終わらせないこと
- Nuxt 3 のベストプラクティスに従うこと
