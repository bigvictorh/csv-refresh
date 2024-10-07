const Client = require('ssh2-sftp-client');
const sftp = new Client();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { host, port, username, password, remotePath, fileContent } = req.body;

        try {
            await sftp.connect({ host, port, username, password });
            await sftp.put(Buffer.from(fileContent, 'base64'), remotePath);
            await sftp.end();
            res.status(200).json({ message: 'File uploaded successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to upload file', details: error.message });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
