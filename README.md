# Digital Signage PDF Slideshow

PDFファイルをスライドショー形式で表示するデジタルサイネージアプリケーションです。

## 機能

- PDFファイルの自動スライドショー表示
- スムーズなスライド切り替えアニメーション
- ライト/ダークモード切り替え
- 手動でのスライド切り替え
- 自動再生の一時停止/再開

## システム要件

- Node.js 16.0.0以上
- npm 7.0.0以上
- 各OSの基本的な開発環境

## インストール手順

### 共通の準備

1. リポジトリをクローン
```bash
git clone [リポジトリURL]
cd digitalsignage
```

2. 依存関係のインストール
```bash
npm install
```

### MacOSでの実行

1. 必要なツールのインストール
```bash
# Homebrewがインストールされていない場合
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Node.jsのインストール
brew install node
```

2. アプリケーションの起動
```bash
npm run dev
```

### Windowsでの実行

1. 必要なツールのインストール
- [Node.js公式サイト](https://nodejs.org/)からLTS版をダウンロードしてインストール
- インストール時に「Add to PATH」オプションを選択

2. アプリケーションの起動
```bash
npm run dev
```

### Linuxでの実行

1. 必要なツールのインストール
```bash
# Ubuntu/Debianの場合
sudo apt update
sudo apt install nodejs npm

# Fedoraの場合
sudo dnf install nodejs npm

# Arch Linuxの場合
sudo pacman -S nodejs npm
```

2. アプリケーションの起動
```bash
npm run dev
```

### Raspberry Piでの実行

1. 必要なツールのインストール
```bash
# Raspberry Pi OSの場合
sudo apt update
sudo apt install nodejs npm

# Node.jsのバージョンが古い場合は、nvmを使用して最新版をインストール
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install --lts
```

2. アプリケーションの起動
```bash
npm run dev
```

## 使用方法

1. `public/pdfs`ディレクトリに表示したいPDFファイルを配置
2. アプリケーションを起動
3. ブラウザで`http://localhost:5173`にアクセス

## カスタマイズ

### PDFファイルの追加/変更

1. `public/pdfs`ディレクトリにPDFファイルを配置
2. `src/App.tsx`の`pdfs`配列を更新

### スライド表示時間の変更

`src/components/Slideshow.tsx`の`slideDuration`プロパティを変更（デフォルト: 10秒）

## トラブルシューティング

### 一般的な問題

- **PDFが表示されない場合**
  - PDFファイルが正しいディレクトリに配置されているか確認
  - PDFファイル名が正しく指定されているか確認

- **アプリケーションが起動しない場合**
  - Node.jsとnpmが正しくインストールされているか確認
  - 依存関係が正しくインストールされているか確認

### OS固有の問題

- **MacOS**
  - ポート5173が使用中の場合は、別のポートを指定
  ```bash
  npm run dev -- --port 3000
  ```

- **Windows**
  - ファイアウォールの設定を確認
  - 管理者権限でコマンドプロンプトを実行

- **Linux/Raspberry Pi**
  - 必要な権限が付与されているか確認
  ```bash
  sudo chown -R $USER:$USER .
  ```

## ライセンス

MIT License

## 作者

[作者名] 