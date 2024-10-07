// Save options to chrome.storage
function saveOptions(e) {
    e.preventDefault();

    let filenamePrefix = document.getElementById('filenamePrefix').value;
    let sftpServer = document.getElementById('sftpServer').value;
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    chrome.storage.sync.set({
        filenamePrefix: filenamePrefix,
        sftpServer: sftpServer,
        username: username,
        password: password
    }, () => {
        // Update status to let the user know options were saved
        let status = document.getElementById('status');
        status.textContent = 'Settings saved successfully.';
        setTimeout(() => {
            status.textContent = '';
        }, 3000);
    });
}

// Restore options from chrome.storage
function restoreOptions() {
    chrome.storage.sync.get(['filenamePrefix', 'sftpServer', 'username', 'password'], (data) => {
        document.getElementById('filenamePrefix').value = data.filenamePrefix || '';
        document.getElementById('sftpServer').value = data.sftpServer || '';
        document.getElementById('username').value = data.username || '';
        document.getElementById('password').value = data.password || '';
    });
}

document.getElementById('optionsForm').addEventListener('submit', saveOptions);
document.addEventListener('DOMContentLoaded', restoreOptions);
