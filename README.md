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
NODE_ENV=development npm run electron:dev

# 実行ファイル
./dist/mac/DigitalSignage.app
```

### Raspberry Pi (Linux)

#### 1. 基本セットアップ
```bash
# システムの更新
sudo apt-get update
sudo apt-get upgrade -y

# Node.jsとnpmのインストール
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Node.jsのバージョン確認
node -v
npm -v
```

#### 2. アプリケーションのセットアップ
```bash
# アプリケーションディレクトリの作成
mkdir -p /home/pi/DigitalSignage
cd /home/pi/DigitalSignage

# リポジトリのクローン
git clone https://github.com/Rintaras/Digital-Signage .

# 依存パッケージのインストール
npm install

# アプリケーションのビルド
npm run build
npm run electron:build:linux
```

#### 3. 自動起動の設定

1. systemdサービスの作成:
```bash
sudo nano /etc/systemd/system/digitalsignage.service
```

以下の内容を記述:
```ini
[Unit]
Description=Digital Signage Application
After=network.target

[Service]
Type=simple
User=pi
Environment=DISPLAY=:0
Environment=XAUTHORITY=/home/pi/.Xauthority
WorkingDirectory=/home/pi/DigitalSignage
ExecStart=/home/pi/DigitalSignage/dist/linux-unpacked/DigitalSignage
Restart=always
RestartSec=5

[Install]
WantedBy=graphical.target
```

2. サービスの有効化と起動:
```bash
# サービスの登録
sudo systemctl daemon-reload

# サービスの有効化（起動時に自動実行）
sudo systemctl enable digitalsignage

# サービスの開始
sudo systemctl start digitalsignage

# ステータス確認
sudo systemctl status digitalsignage
```

#### 4. ディスプレイ設定

1. スクリーンセーバーの無効化:
```bash
sudo nano /etc/xdg/lxsession/LXDE-pi/autostart
```

以下の内容を追加:
```bash
@xset s off
@xset -dpms
@xset s noblank
```

2. ディスプレイの回転（必要な場合）:
```bash
sudo nano /boot/config.txt
```

以下の行を追加（例：180度回転の場合）:
```bash
display_rotate=2
```

#### 5. トラブルシューティング

1. 画面が表示されない場合:
```bash
# ログの確認
sudo journalctl -u digitalsignage -f

# Xサーバーの権限確認
xhost +local:
```

2. アプリケーションが起動しない場合:
```bash
# サービスの再起動
sudo systemctl restart digitalsignage

# 依存関係の再インストール
cd /home/pi/DigitalSignage
npm install
npm run build
```

3. システム起動時の自動ログイン設定:
```bash
sudo raspi-config
```
- 「System Options」→「Boot / Auto Login」を選択
- 「Desktop Autologin」を選択

#### 6. メンテナンス

1. PDFファイルの更新:
```bash
# PDFファイルの配置
cd /home/pi/DigitalSignage/public/pdfs
# ここにPDFファイルをコピー

# アプリケーションの再起動
sudo systemctl restart digitalsignage
```

2. システムの定期更新:
```bash
# 定期的なシステム更新のcron設定
sudo crontab -e
```

以下の行を追加（毎週日曜日の午前3時に更新）:
```bash
0 3 * * 0 apt-get update && apt-get upgrade -y
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