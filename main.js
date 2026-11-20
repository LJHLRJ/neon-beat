'use strict';

const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');

// 默认关闭硬件加速：部分老显卡/远程桌面下 Canvas 与 Web Audio 更稳定。
// 如果你的机器性能充足且需要更高帧率，可注释掉下一行重新启用硬件加速。
app.disableHardwareAcceleration();

// 单实例，避免重复打开多个游戏窗口争抢音频设备
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
}

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 960,
    minHeight: 600,
    resizable: true,
    backgroundColor: '#050510',
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      backgroundThrottling: false
    }
  });

  // 不显示菜单栏，避免误触开发者工具或缩放快捷键（macOS 保留系统菜单以支持 Cmd+Q）
  if (process.platform !== 'darwin') {
    Menu.setApplicationMenu(null);
    mainWindow.setMenuBarVisibility(false);
  }

  // 禁止页面内 window.open / 外链跳转，统一交给系统浏览器
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/i.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('second-instance', () => {
  if (!mainWindow) return;
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.focus();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
