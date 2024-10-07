// // Function to extract the district name from the page
// function getDistrictName() {
//     const districtNameElement = document.querySelector('.district-header #district-name');
    
//     if (districtNameElement) {
//         const districtName = districtNameElement.textContent.trim();
//         console.log("District name found:", districtName); // Debugging log
//         return districtName;
//     } else {
//         console.error("District name element not found."); // Debugging log
//         return null;
//     }
// }

// Function to extract SFTP information from the sync settings page
function getSFTPInfo() {
    const syncURL = document.getElementById('syncURL')?.value;
    console.log(document.querySelector('#syncURL').value);
    const syncUsername = document.getElementById('syncUsername')?.value;
    const syncPassword = document.getElementById('password')?.value;

    if (syncURL && syncUsername && syncPassword) {
        console.log(syncURL + syncUsername + syncPassword)
        return {
            url: syncURL,
            username: syncUsername,
            password: syncPassword
        };
    } else {
        console.error("Failed to retrieve SFTP information.");
        return null;
    }
}

// Function to download the schools.csv file
function downloadSchoolsCSV() {
    const downloadLinkElement = document.querySelector('a[href*="schools.csv"]');
    if (downloadLinkElement) {
        const csvURL = downloadLinkElement.href;
        fetch(csvURL)
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = 'schools.csv';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch(error => console.error('Error downloading schools.csv:', error));
    } else {
        console.error('No download link found for schools.csv.');
    }
}

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received message in content.js:", request.action); // Debugging log
    if (request.action === 'getDistrictName') {
        console.log("Content script received getDistrictName action.");
        
        const districtNameElement = document.querySelector('.district-header #district-name');
        if (districtNameElement) {
            const districtName = districtNameElement.textContent.trim();
            console.log("District name found:", districtName);
            sendResponse({ districtName });
        } else {
            console.error("District name element not found.");
            sendResponse({ districtName: null });
        }
    } else if (request.action === 'getSFTPInfo') {
        const sftpInfo = getSFTPInfo();
        sendResponse({ sftpInfo });
    } else if (request.action === 'downloadFiles') {
        downloadSchoolsCSV();
        sendResponse({ status: 'download started' });
    }
});
