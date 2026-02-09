# Copilot Instructions

## プロジェクト概要
このリポジトリは、Nuxt 3（TypeScript）で実装する、**自分専用のURL短縮・リダイレクトサービス**である。

Discord OAuth2 を用いてログインを行い、**特定の Discord ユーザーID（1人のみ）だけが管理画面を利用可能**とする。

---

## 技術スタック

- フレームワーク: Nuxt 3
- 言語: TypeScript
- 認証: Discord OAuth2（scope: identify）
- 認可: Discord User ID の完全一致で制御
- セッション管理: JWT（HttpOnly Cookie）
- ORM: Prisma
- データベース: MySQL
- サーバー: Ubuntu 24.04 LTS + Apache2

---

## 実装方針

### 認証・認可
- Discord OAuth2 を使用する
- ログイン後に取得した Discord User ID が
  環境変数 `ALLOWED_DISCORD_ID` と一致しない場合は **必ず 403 を返す**
- 認証状態は JWT を HttpOnly Cookie に保存する
- API は未認証アクセスを許可しない

### セキュリティ
- `javascript:` や `data:` スキームの URL は必ず拒否する
- Cookie は `HttpOnly / Secure / SameSite=Lax` を指定する
- 短縮コードは推測困難なランダム文字列（7〜10文字）を使用する
- DB の shortCode カラムは UNIQUE 制約を付ける

---

## 機能要件

### 管理機能（ログイン必須）
- 長い URL を短縮 URL に変換する
- 短縮 URL の一覧を表示する
- 短縮 URL を無効化（enabled=false）できる

### 短縮URLアクセス
- `https://link.example.com/{code}` にアクセスされた場合
  - DB から該当データを取得
  - 有効であれば 302 リダイレクト
  - 存在しない or 無効な場合は 404 を返す

---

## ディレクトリ設計ルール

- API は `/server/api` 配下に実装する
- 認証チェックは server middleware で行う
- 管理画面はログイン必須ページとして実装する
- フロントエンドとバックエンドは Nuxt 3 内で完結させる

---

## コーディングルール

- TypeScript の型を省略しない
- `any` の使用は禁止
- エラーハンドリングは `createError` を使用する
- 抽象的な説明だけのコード生成は禁止
- 実際に動作する実装を前提にする

---

## Copilot への指示

- このプロジェクトは **一般公開サービスではない**
- 管理者は 1 人のみである前提で設計する
- 「簡略化のため省略」などの実装は行わない
- Nuxt 3 / Nitro のベストプラクティスに従う
- 日本語でコメントを書く
