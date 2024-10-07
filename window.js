// Function to navigate the active tab to a specified URL
function navigateActiveTab(url) {
    chrome.runtime.sendMessage({ action: 'navigateActiveTab', url }, (response) => {
        if (chrome.runtime.lastError) {
            console.error("Navigation error:", chrome.runtime.lastError);
        } else {
            console.log(`Navigating to ${url} in active tab`);
        }
    });
}

// Function to retrieve and display the district name
function updateDistrictName() {
    console.log("Sending message to content.js to get district name..."); // Debugging log

    chrome.runtime.sendMessage({ action: 'getDistrictName' }, (response) => {
        if (chrome.runtime.lastError) {
            console.error("Error in sendMessage:", chrome.runtime.lastError.message); // Error log
            return;
        }

        if (response && response.districtName) {
            console.log(`Retrieved district name: ${response.districtName}`);
            document.getElementById('districtNameDisplay').textContent = response.districtName;
        } else {
            console.log("Failed to retrieve district name or district name not found.");
        }
    });
}

// Function to populate SFTP information fields
function populateSFTPFields(sftpInfo) {
    document.getElementById('sftpUrl').value = sftpInfo.url || 'Not found';
    document.getElementById('sftpUsername').value = sftpInfo.username || 'Not found';
    document.getElementById('sftpPassword').value = sftpInfo.password || 'Not found';
}

// Function to update the district ID based on the current tab's URL
function updateDistrictId() {
    chrome.runtime.sendMessage({ action: 'getActiveTabUrl' }, (response) => {
        if (response && response.url) {
            console.log(`Full active tab URL: ${response.url}`);

            const districtIdMatch = response.url.match(/\/districts\/([a-z0-9]{24})(\/|$)/);
            if (districtIdMatch) {
                const districtId = districtIdMatch[1];
                console.log(`Pre-populating district ID: ${districtId}`);
                document.getElementById('districtId').value = districtId;
                updateButtonState(); // Trigger the button state update after setting the value

                // Now update the district name
                updateDistrictName();
            } else {
                console.log("No district ID found in the URL. Pattern mismatch or URL format issue.");
            }
        } else {
            console.error("Failed to get the active tab URL.");
        }
    });
}

// Enable or disable buttons based on the input field value
function updateButtonState() {
    const districtId = document.getElementById('districtId').value.trim();
    const buttons = [
        document.getElementById('navigateToPage'),
        document.getElementById('navigateToInfo'),
        document.getElementById('refreshSFTP')
    ];

    if (districtId) {
        buttons.forEach(button => button.disabled = false);
        document.getElementById('refreshSFTP').style.display = 'block';
    } else {
        buttons.forEach(button => button.disabled = true);
        document.getElementById('refreshSFTP').style.display = 'none';
    }
}

// Function to close the window
function closeWindow() {
    window.close();
}

// Initialize the window and set up event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initially update the district ID and district name
    updateDistrictId();

    // Set up event listeners
    document.getElementById('districtId').addEventListener('input', updateButtonState);

    document.getElementById('navigateToPage').addEventListener('click', () => {
        const districtId = document.getElementById('districtId').value.trim();
        if (districtId) {
            const url = `https://hall-monitor.int.clever.com/districts/${districtId}/sftpfiles`;
            navigateActiveTab(url);
        }
    });

    document.getElementById('navigateToInfo').addEventListener('click', () => {
        const districtId = document.getElementById('districtId').value.trim();
        if (districtId) {
            const url = `https://hall-monitor.int.clever.com/districts/${districtId}/info`;
            navigateActiveTab(url);
        }
    });

    // Handle the "Refresh SFTP" button click
    document.getElementById('refreshSFTP').addEventListener('click', () => {
        const districtId = document.getElementById('districtId').value.trim();
        if (districtId) {
            const syncSettingsUrl = `https://hall-monitor.int.clever.com/districts/${districtId}/syncSettings`;
            navigateActiveTab(syncSettingsUrl);
            
            // Inject content script to extract SFTP information
            chrome.runtime.sendMessage({ action: 'injectContentScript' }, () => {
                console.log("Injected content script to extract SFTP information.");
            });

            // After extracting SFTP information, populate the fields
            chrome.runtime.sendMessage({ action: 'getSFTPInfo' }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error("Error retrieving SFTP information:", chrome.runtime.lastError.message);
                    return;
                }

                if (response && response.sftpInfo) {
                    populateSFTPFields(response.sftpInfo);
                    console.log("SFTP information retrieved:", response.sftpInfo);
                } else {
                    console.log("Failed to retrieve SFTP information.");
                }
            });
        }
    });

    // Close button functionality
    document.getElementById('closeWindow').addEventListener('click', closeWindow);
});
