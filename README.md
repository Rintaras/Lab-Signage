# デジタルサイネージアプリケーション

PDFスライドショーを表示するデジタルサイネージアプリケーションです。

## 機能

### 基本機能
- PDFファイルの自動スライドショー表示
- フルスクリーン表示対応
- 画面サイズに合わせた自動リサイズ
- PDFファイルの自動読み込み（`public/pdfs`フォルダ内のPDFを自動検出）

### 表示制御
- スライド切り替え間隔: 10秒
- 再生/一時停止機能
- 前後のスライドへの手動切り替え
- プログレスバーによる進行状況の表示
- スライド番号の表示

### 時計機能
- 現在時刻の表示（24時間表示）
- 日付表示（MM/DD (曜)）
- 時計表示のオン/オフ切り替え

### テーマ設定
- ライト/ダークモードの切り替え
- 時間帯による自動テーマ切り替え
  - 18:00-04:59: ダークモード
  - 05:00-17:59: ライトモード
- 手動での一時的なテーマ変更
- 18:00と05:00に自動でテーマをリセット

## 必要要件

- Node.js 16.0.0以上
- npm 7.0.0以上

## インストール方法

```bash
# リポジトリのクローン
git clone [repository-url]
cd DigitalSignage

# 依存パッケージのインストール
npm install
```

## 実行方法

### Windows

```bash
# 開発モード
npm run electron:dev

# ビルド
npm run build
npm run electron:build:win

# 実行ファイル
./dist/win-unpacked/DigitalSignage.exe
```

### macOS

```bash
# 開発モード
npm run electron:dev

# ビルド
npm run build
npm run electron:build:mac

# 実行ファイル
./dist/mac/DigitalSignage.app
```

### Raspberry Pi (Linux)

```bash
# 必要なパッケージのインストール
sudo apt-get update
sudo apt-get install -y nodejs npm

# 開発モード
npm run electron:dev

# ビルド
npm run build
npm run electron:build:linux

# 実行ファイル
./dist/linux-unpacked/DigitalSignage
```

## PDFファイルの配置

1. `public/pdfs`フォルダにPDFファイルを配置
2. アプリケーションが自動的にファイルを検出
3. ファイル名のアルファベット順で表示

## キーボードショートカット

- `ESC`: アプリケーションの終了
- `Space`: スライドショーの一時停止/再開
- `→`: 次のスライド
- `←`: 前のスライド

## 設定のカスタマイズ

### スライド切り替え間隔の変更
`src/App.tsx`の`slideDuration`を変更（デフォルト: 10秒）

```typescript
const slideDuration = 10; // 秒単位で設定
```

### 自動テーマ切り替え時刻の変更
`src/components/Slideshow.tsx`の時間設定を変更

```typescript
const shouldBeDark = hour >= 18 || hour < 5; // 時間の範囲を変更
```

## トラブルシューティング

1. PDFが表示されない場合
   - `public/pdfs`フォルダの存在を確認
   - PDFファイルの権限を確認
   - アプリケーションの再起動を試行

2. 画面サイズが正しく調整されない場合
   - フルスクリーンモードの切り替えを試行（F11）
   - アプリケーションの再起動を試行

3. テーマが自動切り替えされない場合
   - システム時刻の確認
   - 自動テーマモードが有効になっているか確認

## ライセンス

[License Type] - 詳細は[LICENSE](./LICENSE)ファイルを参照してください。 