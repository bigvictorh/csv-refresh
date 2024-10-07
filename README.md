# CSV SFTP Refresh Chrome Extension

This Chrome extension automates the process of refreshing CSV files by navigating a web interface, downloading the latest version of the file, and securely uploading it to an SFTP server.

## Features

- Automatically refreshes and downloads CSV files from a web interface.
- Uploads downloaded CSV files to a specified SFTP directory.
- Handles file renaming based on dynamic information from the web page (e.g., date or file identifier).
- Provides easy configuration of the SFTP connection within the extension.

## How It Works

1. **Active Tab Identification**: The extension identifies the correct active tab where the CSV file can be downloaded.
2. **CSV Download**: It automatically navigates the UI to find the correct download link for the CSV file.
3. **File Renaming**: Based on information from the web page, the file is renamed appropriately before being uploaded.
4. **SFTP Upload**: The renamed file is uploaded to the designated SFTP directory securely.
5. **Notification**: The extension provides a status notification when the process is complete or if any errors occur.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/csv-sftp-refresh-extension.git
   ```

2. Go to Chrome's extensions page (`chrome://extensions/`), enable **Developer mode**, and click **Load unpacked**. Select the cloned project directory.

3. Configure the extension with your SFTP credentials by clicking on the extension icon and entering the necessary information (SFTP server, username, password, etc.).

## Configuration

- Open the extension's popup and input the required fields:
  - **SFTP Host**: Your SFTP server hostname or IP.
  - **SFTP Username**: Your SFTP username.
  - **SFTP Password**: Your SFTP password.
  - **SFTP Directory**: The remote directory where the CSV will be uploaded.
  - **CSV Download URL**: The URL or element ID to find the CSV download link.
  
## Development

1. Clone this repository to your local machine.
2. Open the extension in Developer mode as described above.
3. Use `manifest.json` to configure permissions for file downloads and uploads.
4. Modify the `background.js` and `content.js` files for custom automation logic.
5. Test the extension by navigating to a test environment that matches your use case.

## Contributing

Feel free to submit a pull request or open an issue if you encounter any problems or have suggestions for improvements.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
