
const electron = require('electron');
const { app, BrowserWindow, Menu, ipcMain} = electron;

//set env
process.env.NODE_ENV = 'production';

let mainWindow;
let addWindow;
// main window
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })
    mainWindow.loadFile('index.html');
    mainWindow.on('closed', function () {
        app.quit();
    })

    // build menu form template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
    // insert menu
    Menu.setApplicationMenu(mainMenu);

}

// handle create add window
function createAddWindow() {
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add Shopping List Item',
        webPreferences: {
            nodeIntegration: true
        }
    })
    addWindow.loadFile('addWindow.html');
    addWindow.on('closed', () => {
        addWindow = null
    })


    // build menu form template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
    // insert menu
    Menu.setApplicationMenu(mainMenu);

}

// catch item:add
ipcMain.on('item:add', function(e,item){
    console.log(item);
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
});

// creat menu template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Add Items',
                click() {
                    createAddWindow();
                }
            },
            {
                label: 'Clear Items',
                click() {
                    mainWindow.webContents.send('item:clear');
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    },
    {
        label: 'Add Items',
        click() {
            createAddWindow();
        }
    }
];

// if mac add empty object to menu.
if (process.platform == 'darwin') {
    mainMenuTemplate.unshift({});
}

// add dev tools item if not in production
if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [{
            label: 'Toggle DevTools',
            accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
            click(item, focusedWindow) {
                focusedWindow.toggleDevTools();
            }
        }, 
        {
            role: 'reload'
        }
        ]
    });
}

app.on('ready', createWindow)












