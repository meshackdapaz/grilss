const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const unzipper = require('unzipper');

class AuthBackup {
    constructor(supabase, bucketName = 'bot-auth') {
        this.supabase = supabase;
        this.bucketName = bucketName;
        this.tempZip = path.join(process.cwd(), 'session_temp.zip');
    }

    async uploadSession(folderPath) {
        if (!fs.existsSync(folderPath)) return;
        const files = fs.readdirSync(folderPath);
        if (files.length === 0) return;

        return new Promise((resolve) => {
            try {
                const output = fs.createWriteStream(this.tempZip);
                const archive = archiver('zip', { zlib: { level: 5 } }); // Faster compression level

                output.on('close', async () => {
                    try {
                        if (!fs.existsSync(this.tempZip)) return resolve();
                        const fileBuffer = fs.readFileSync(this.tempZip);
                        const { error } = await this.supabase.storage
                            .from(this.bucketName)
                            .upload('session.zip', fileBuffer, {
                                contentType: 'application/zip',
                                upsert: true
                            });
                        
                        if (error) console.error('[AUTH-BACKUP] Upload error:', error.message);
                        else console.log('[AUTH-BACKUP] Slim Cloud Backup Success.');
                        
                        if (fs.existsSync(this.tempZip)) fs.unlinkSync(this.tempZip);
                    } catch (e) {
                        console.error('[AUTH-BACKUP] Storage error:', e.message);
                    }
                    resolve();
                });

                archive.on('error', (err) => {
                    console.error('[AUTH-BACKUP] Zip error:', err.message);
                    resolve();
                });

                archive.pipe(output);
                
                // SLIM SYNC LOGIC: Only include essential credentials
                // This skips hundreds of message history files
                files.forEach(file => {
                    const isEssential = file === 'creds.json' || 
                                      file.startsWith('app-state-sync-key') || 
                                      file.startsWith('session-');
                    if (isEssential) {
                        archive.file(path.join(folderPath, file), { name: file });
                    }
                });

                archive.finalize();
            } catch (e) {
                console.error('[AUTH-BACKUP] Backup process failed:', e.message);
                resolve();
            }
        });
    }

    async downloadSession(targetPath) {
        const timeout = 5000; // 5 Seconds Failsafe
        let downloadFinished = false;

        return new Promise((resolve) => {
            const timer = setTimeout(() => {
                if (!downloadFinished) {
                    console.error('[AUTH-BACKUP] Download timed out. Starting fresh for speed.');
                    resolve(false);
                }
            }, timeout);

            this.supabase.storage.from(this.bucketName).download('session.zip').then(async ({ data, error }) => {
                downloadFinished = true;
                clearTimeout(timer);
                
                if (error || !data) {
                    console.log('[AUTH-BACKUP] No cloud session yet.');
                    return resolve(false);
                }

                try {
                    const buffer = Buffer.from(await data.arrayBuffer());
                    if (buffer.length < 22) return resolve(false);
                    
                    fs.writeFileSync(this.tempZip, buffer);
                    if (!fs.existsSync(targetPath)) fs.mkdirSync(targetPath, { recursive: true });

                    const stream = fs.createReadStream(this.tempZip);
                    const extract = unzipper.Extract({ path: targetPath });
                    stream.pipe(extract);
                    
                    extract.on('close', () => {
                        console.log('[AUTH-BACKUP] Session Restored.');
                        if (fs.existsSync(this.tempZip)) fs.unlinkSync(this.tempZip);
                        resolve(true);
                    });
                    extract.on('error', () => resolve(false));
                } catch (e) { resolve(false); }
            }).catch(() => resolve(false));
        });
    }
}

module.exports = AuthBackup;
