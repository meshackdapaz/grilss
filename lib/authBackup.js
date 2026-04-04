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
                const archive = archiver('zip', { zlib: { level: 9 } });

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
                        else console.log('[AUTH-BACKUP] Cloud Backup Success.');
                        
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
                archive.directory(folderPath, false);
                archive.finalize();
            } catch (e) {
                console.error('[AUTH-BACKUP] Backup process failed:', e.message);
                resolve();
            }
        });
    }

    async downloadSession(targetPath) {
        try {
            const { data, error } = await this.supabase.storage
                .from(this.bucketName)
                .download('session.zip');

            if (error || !data) {
                console.log('[AUTH-BACKUP] No cloud session to restore.');
                return false;
            }

            const buffer = Buffer.from(await data.arrayBuffer());
            fs.writeFileSync(this.tempZip, buffer);

            if (!fs.existsSync(targetPath)) fs.mkdirSync(targetPath, { recursive: true });

            return new Promise((resolve) => {
                fs.createReadStream(this.tempZip)
                    .pipe(unzipper.Extract({ path: targetPath }))
                    .on('close', () => {
                        console.log('[AUTH-BACKUP] Success: Restored session from Cloud.');
                        if (fs.existsSync(this.tempZip)) fs.unlinkSync(this.tempZip);
                        resolve(true);
                    })
                    .on('error', (e) => {
                        console.error('[AUTH-BACKUP] Unzip error:', e.message);
                        resolve(false);
                    });
            });
        } catch (e) {
            console.error('[AUTH-BACKUP] Download failed:', e.message);
            return false;
        }
    }
}

module.exports = AuthBackup;
