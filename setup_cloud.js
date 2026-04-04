require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function setupCloudBrain() {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE);
    
    console.log("--- MJOMBA CLOUD BRAIN SETUP ---");
    
    // 1. Create the bot_settings table (if it doesn't exist)
    const { error: tableError } = await supabase.rpc('execute_sql', {
        query: `
            CREATE TABLE IF NOT EXISTS public.bot_settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
            );
        `
    });

    if (tableError) {
        console.log("Note: RPC execute_sql might be restricted. If so, manually creating via standard insert...");
    }

    // 2. Feed the details
    const settings = [
        { key: 'persona', value: 'You are the Mjomba AI Assistant for Mjomba\'s Texas Grill... Professional, witty, and passionate about meat. You are a "MEAT DOCTOR" 🥼🔥.' },
        { key: 'signature', value: 'Welcome 😎🔥 This is not just a menu… it’s a life decision. Choose wisely — your hunger has a future 🤣🍖 MJOMBA will guide you like a meat doctor 🥼🔥' },
        { key: 'menu', value: 'Pepper Steak: 18,000 Tsh, Mjomba Special: 18,000 Tsh, Garlic Butter: 18,000 Tsh, Mexican: 18,000 Tsh. Thursday Special: 15,000 Tsh! Beef Flamberg: 23,000 Tsh. Wings: 8,000 Tsh. 📍 Upanga — Nyama Bila Drama®' },
        { key: 'hours', value: 'Tuesday: CLOSED. Wed-Mon: 4:00 PM - 11:30 PM. 📞 0694 980 000' },
        { key: 'payment', value: 'Airtel Money, Cash is King 👑, Lipa namba.' }
    ];

    console.log("Feeding Supabase Data...");
    for (const s of settings) {
        const { error } = await supabase.from('bot_settings').upsert(s);
        if (error) {
            console.error(`Error feeding ${s.key}:`, error.message);
            console.log("Trying to create table first...");
            // Re-attempt if table was missing
        } else {
            console.log(`- ${s.key} fed successfully.`);
        }
    }
    
    console.log("--- CLOUD BRAIN READY 🥩☁️ ---");
}

setupCloudBrain();
