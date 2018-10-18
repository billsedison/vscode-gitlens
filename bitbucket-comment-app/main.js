// ipcMain and ipcRenderer for Communication between electron main/renderer processes
// node-ipc for communication between electron and vscode extension host (they're independent processes)
// electron's ipc modules are not helpful to send (or receive) data to external apps
const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const ipc = require('node-ipc');

// connectionString is an unique identifier for each process spawned (or ExternalApp instance)
// we're passing it as an command line argument to the app
// so they (external app and VSCode) both know and can communicate each other
if (process.argv.length < 3) {
    app.quit();
}
let connectionString = process.argv[2];

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        maximizable: false,
        resizable: false,
        minimizable: false,
        fullscreenable: false,
        frame: false,
        skipTaskbar: true,
        width: 500,
        height: 450,
        opacity: 0.85
    });

    mainWindow.loadFile('index.html');

    // pressing Ctrl + Space will bring the app to the front
    const shortcut = globalShortcut.register('CommandOrControl+1', () => {
        mainWindow.focus();
    });

    // Open the DevTools.
    //mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        globalShortcut.unregister('CommandOrControl+1');
        mainWindow = null;
    });

    // node-ipc configurations
    ipc.config.id = connectionString;
    ipc.config.retry = 1500;
    ipc.config.maxConnections = 1;

    ipc.serve(function() {
        ipc.server.on('app.message', function(data, socket) {
            /**
             * Send a close message to VSCode
             * The VSCode will back with a 'hide' or 'exit' message according to keepOpen parameter.
             */
            function close() {
                ipc.server.emit(socket, 'app.message', {
                    id: ipc.config.id,
                    command: 'close'
                });
            }

            // Init the Markdown editor with the given payload (when editing)
            if (data.command === 'init.editor') {
                mainWindow.webContents.send('init.editor', data.payload);
            } else if (data.command === 'hide') {
                mainWindow.minimize();
            } else if (data.command === 'show') {
                mainWindow.show();
            } else if (data.command === 'exit') {
                app.quit();
            }

            ipcMain.on('save.comment', function(event, arg) {
                // send comment to the VSCode app
                ipc.server.emit(socket, 'app.message', {
                    id: ipc.config.id,
                    command: 'save.comment',
                    payload: arg
                });
                // once saved, close
                close();
            });
            // it's taking a bit time for the app to be ready
            // we have to wait for the app to be ready for some operations (like init.editor)
            ipcMain.once('ui.ready', function(event, arg) {
                ipc.server.emit(socket, 'app.message', {
                    id: ipc.config.id,
                    command: 'ui.ready'
                });
            });
            ipcMain.on('close', close);
        });
    });
    ipc.server.start();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});