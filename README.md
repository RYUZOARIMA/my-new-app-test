# 士道 SHIDO Gallery Paris — 予約・空き状況サイト

日本武道宮崎パリ支店のギャラリースペース「士道 SHIDO Gallery Paris」の展示ブース(A〜F)予約・空き状況確認サイト。

## 開発環境で動かす

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) をブラウザで開く。

Googleスプレッドシートの環境変数(下記)を設定していない場合、トップページ・料金表は表示されますが、予約カレンダーの読み込みと申込送信はエラーになります。

## Googleスプレッドシート連携のセットアップ(必須)

このサイトは予約データをGoogleスプレッドシート1枚で管理します。以下を一度だけ設定してください。

1. **スプレッドシートを新規作成**し、シート名を「予約」にする。1行目に以下のヘッダーを入力:
   `予約ID | 申込日時 | 希望日 | ブース | 氏名 | 連絡先 | 用途備考 | ステータス`
   - ステータス列には「仮予約」「確定」「却下」のいずれかを入力する運用。サイトからの新規申込みは自動で「仮予約」として追加される
   - 予約を確定する場合は、このシート上でステータス列を直接「確定」に書き換える(サイト側に管理画面はなし)
2. **Google Cloud Consoleでサービスアカウントを作成**し、Google Sheets APIを有効化してJSON鍵を発行する
3. 作成したスプレッドシートを、サービスアカウントのメールアドレス(`xxx@xxx.iam.gserviceaccount.com`)に**編集者として共有**する
4. `.env.local.example` を `.env.local` にコピーし、以下を設定:
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`: サービスアカウントのメールアドレス
   - `GOOGLE_PRIVATE_KEY`: JSON鍵内の `private_key`(改行は `\n` のまま貼り付けでOK)
   - `GOOGLE_SHEET_ID`: スプレッドシートのURL中のID部分

## 予約通知メールのセットアップ(任意)

新規予約が入るたびに `nipponbudomiyazaki@gmail.com` へ通知メールを送信します。[Resend](https://resend.com) を利用します。

1. [resend.com](https://resend.com) でアカウントを作成する
2. ダッシュボードでAPIキーを発行する
3. `.env.local` に以下を設定:
   - `RESEND_API_KEY`: 発行したAPIキー
   - `RESEND_FROM_EMAIL`: 送信元アドレス。独自ドメインをResendで認証していない場合は `onboarding@resend.dev` のままでOK(Resendアカウントのオーナーのメールアドレス宛にのみ届く制限あり。本番運用では独自ドメインの認証を推奨)

`RESEND_API_KEY` が未設定の場合、予約自体はスプレッドシートに保存されますが通知メールは送信されず、サーバーログにエラーが記録されるだけです(予約処理自体は失敗しません)。

## Vercelへのデプロイ

1. GitHubリポジトリにpushするか、`vercel` CLIで直接リンクする
2. Vercelプロジェクトの環境変数に上記(`GOOGLE_SERVICE_ACCOUNT_EMAIL` / `GOOGLE_PRIVATE_KEY` / `GOOGLE_SHEET_ID` / `RESEND_API_KEY` / `RESEND_FROM_EMAIL`)を登録する
3. `vercel --prod` またはGitHub連携での自動デプロイを実行する

## 構成

- `app/page.tsx` — トップページ(ギャラリー紹介・料金表)
- `app/booking/page.tsx` + `components/BookingClient.tsx` — 予約カレンダー・申込フォーム
- `app/api/bookings/route.ts` — 予約の取得(GET)・仮予約の追加(POST)
- `lib/googleSheets.ts` — Googleスプレッドシート読み書き
- `lib/notifyEmail.ts` — 予約通知メール送信(Resend)
- `lib/galleryData.ts` — ブース仕様・料金・ギャラリー基本情報
