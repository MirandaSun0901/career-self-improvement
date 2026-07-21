# meeting-manager 快捷方式生成脚本
# 运行后，在桌面生成指向用户专属「会议管理看板」的快捷方式

$configPath = "$env:USERPROFILE\AppData\Roaming\FanDo\openclaw\workspace\cache\meeting_manager_config.json"

if (-not (Test-Path $configPath)) {
    Write-Host "❌ 尚未初始化会议管理看板，请先运行 meeting-manager Skill 自动建表。" -ForegroundColor Red
    exit 1
}

$config = Get-Content $configPath | ConvertFrom-Json
$appToken = $config.app_token
$tableUrl = "https://jqx28l0j4lx.feishu.cn/base/$appToken"

$shortcutPath = "$env:USERPROFILE\Desktop\会议管理看板.url"

$content = @"
[InternetShortcut]
URL=$tableUrl
IconIndex=0
"@

Set-Content -Path $shortcutPath -Value $content -Encoding UTF8
Write-Host "✅ 快捷方式已创建: $shortcutPath" -ForegroundColor Green
Write-Host "   指向: $tableUrl"
