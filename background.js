let extensionWindowId = null;
let activeTabId = null;

// Listener for when the extension icon is clicked
chrome.action.onClicked.addListener(() => {
    // Find the currently active tab in the main browser window
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        if (tabs && tabs.length > 0) {
            activeTabId = tabs[0].id;
            console.log(`Active tab identified: ${activeTabId}`);

            if (extensionWindowId) {
                // If the window is already open, focus it and keep it on top
                chrome.windows.update(extensionWindowId, { focused: true, drawAttention: true });
            } else {
                // Create a new window for the extension UI
                chrome.windows.create({
                    url: "window.html",
                    type: "popup",
                    width: 400,
                    height: 800,
                    focused: true
                }, (window) => {
                    extensionWindowId = window.id;

                    // Immediately check the URL of the active tab after the window is created
                    checkAndRedirectActiveTab();
                });
            }
        } else {
            console.error("No active tab found.");
        }
    });
});

// Function to check the active tab URL and redirect if necessary
function checkAndRedirectActiveTab() {
    if (activeTabId) {
        chrome.tabs.get(activeTabId, (tab) => {
            if (tab.url && !tab.url.startsWith("https://hall-monitor.int.clever.com")) {
                console.log(`Redirecting active tab to hall-monitor: ${tab.url}`);
                chrome.tabs.update(activeTabId, { url: "https://hall-monitor.int.clever.com" });
            }
        });
    }
}

// Listener to reset extensionWindowId when the window is closed
chrome.windows.onRemoved.addListener((windowId) => {
    if (windowId === extensionWindowId) {
        extensionWindowId = null;
    }
});

// Handle messages from window.js for navigation, script injection, and Vercel integration
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received message in background script:", request.action);

    if (request.action === 'navigateActiveTab' && activeTabId) {
        console.log(`Navigating active tab: ${activeTabId} to URL: ${request.url}`);
        chrome.tabs.update(activeTabId, { url: request.url }, () => {
            console.log("Navigation completed.");
            sendResponse({ status: 'navigated' });
        });

    } else if (request.action === 'getActiveTabUrl' && activeTabId) {
        console.log(`Fetching URL for active tab: ${activeTabId}`);
        chrome.tabs.get(activeTabId, (tab) => {
            console.log(`Active tab URL: ${tab.url}`);
            sendResponse({ url: tab.url });
        });

    } else if (request.action === 'getDistrictName' && sender.tab) {
        console.log("Executing script to get district name...");

        chrome.scripting.executeScript({
            target: { tabId: sender.tab.id },
            function: () => {
                const districtNameElement = document.querySelector('.district-header #district-name');
                if (districtNameElement) {
                    console.log("District name element found:", districtNameElement);
                    const districtName = districtNameElement.textContent.trim();
                    console.log("District name text content:", districtName);
                    return districtName;
                } else {
                    console.log("District name element not found.");
                    return null;
                }
            }
        }, (results) => {
            if (results && results[0].result) {
                console.log("District name found:", results[0].result);
                sendResponse({ districtName: results[0].result });
            } else {
                console.log("District name not found.");
                sendResponse({ districtName: null });
            }
        });

        return true; // Required to keep the message channel open for sendResponse
    } else if (request.action === 'uploadFile') {
        console.log("Uploading file with details:", {
            host: request.host,
            port: request.port,
            username: request.username,
            remotePath: request.remotePath
        });
        fetch('https://csv-refresh.vercel.app/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                host: request.host,
                port: request.port,
                username: request.username,
                password: request.password,
                remotePath: request.remotePath,
                fileContent: request.fileContent // Base64 encoded file content
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log("File upload response:", data);
            sendResponse({ status: 'success', data });
        })
        .catch(error => {
            console.error('Error during file upload:', error);
            sendResponse({ status: 'error', error });
        });

    } else {
        console.error("Invalid action or no active tab found.");
        sendResponse({ status: 'error', message: 'No active tab or invalid action' });
    }

    return true;  // Keep the message channel open for sendResponse
});
