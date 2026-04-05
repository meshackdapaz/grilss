class LocalBrainService {
    constructor() {
        this.langs = {
            sw: {
                signature: "Habari Boss wangu! 🙏 Karibu sana Mjomba's Texas Grill, sehemu pekee ambapo wateja wetu ni wafalme! 👑\n\nTuko hapa kuhakikisha unapata huduma ya VIP leo. Kutoka kwenye Steaks laini, Nundu tamu, mpaka Wings za moto... tumekusubiria wewe tu! 🥩🔥\n\n👇 Kuona misosi yetu yote, andika neno *Menu*\n\nTunakuthamini sana Boss.\n\n📞 Order: 0694 980 000\n📍 Upanga — Nyama Bila Drama®",
                menu: `🥩 *MJOMBA'S TEXAS GRILL - FULL MENU* 🥩

🔥 *STEAKS (18,000/=)*
Pepper, Mjomba Special, Garlic Butter, Chilly Garlic, Mexican, Portugese, Tempenyaki, Schnitzel, Suzette.
🥩 *PREMIUM STEAKS*
- American: 20k | Chilly Cheese: 20k
- Ausberg (Cheese): 20k | Beef Flamberg: 23k

🍢 *IMPORTED STRIPS*
- Beef Strips: 20k | Nundu Strips: 25k
- Beef & Nundu Mix: 30k

💎 *PREMIUM CUTS*
- Tomahawk (500g): 45k
- Sirloin (300g): 40k

🍗 *CHICKEN (10,000/=)*
Portugese, Peri Peri, Texando, Sultan, Mjomba Choma.
- Crispy Chicken (Rice/Fries): 18k

🔥 *WINGS (8 PCS - 8,000/=)*
Buffalo, Peri Peri, Mjomba Special, Garlic, Mexican, Suicidal.
- Mango Habenero: 10k

🍟 *POUTINE (20,000/=)*
Chicken, Beef, Mjomba Special, Fusion, Extra Spicy.

🍖 *PLATTERS*
- Wings (1kg): 25k | Chicken (1kg): 50k
- Lazy Lion: 50k | Ribs (1kg): 70k
- Kamanda: 70k | XXL Carnivore: 150k

🔥 *NYAMA CHOMA*
200g: 20k | 300g: 30k | 400g: 40k | 500g: 50k

🥗 *SALADS*: 6,000/=
🍟 *SIDES*: Peri Peri Fries (3k), Lemon Fries (4k), Rice (4k), Mash (4k).`,
                hours: "🕒 *BUSINESS HOURS* 🕒\n\nTuesday: ❌ CLOSED\nMon - Sun: 4:00 PM - 11:30 PM",
                location: "📍 *LOCATION*\n\nMataka Road, Upanga! Tupigie simu 0694 980 000 tukuelekeze vizuri. Nyama Bila Drama! 🥩🔥",
                payment: "💳 *LIPA NAMBA (Mtandao wowote)*: 123456 (Mjomba's Grill)\n\nUkishalipa, **tuma screenshot ya muamala hapa**!",
                fallback: "Karibu sana Mjomba's Texas Grill! 🙏\n\nSamahani Boss, sijakupata vizuri. Je, ungependa nikutumie *Menu* yetu utupie jicho sasa hivi? 🥩🔥\n\nTuko hapa kukuhudumia VIP!",
                thanks: "Pamoja sana Boss wangu! 🙏 Mjomba Texas Grill tuko kwa ajili yako. Kama unahitaji chochote kingine, usisite kuniambia. Karibu sana! 🥩🔥",
                askMenu: "\n\nTayari Boss! Hiyo hapo menu yetu. Ungependa kuanza na msosi gani leo? 🥩🔥",
                whichFlavor: (item) => `Sawa Boss! Unapenda *${item}* za aina gani? Tuna hizi hapa:`,
                chooseOne: "_Ungependa nikuwekee gani leo?_ 🥩",
                orderConf: (flavor, item) => `*ORDER YAKO IMEKAMILIKA* 📝\n\nSawa kabisa Boss wangu, tume-receive order ya *${flavor} ${item}* 🥩🔥 Choice nzuri sana!\n\nKukamilisha order na kuanza kufanyiwa maandalizi sasa hivi, tafadhali fanya malipo hapa:\n`,
                genOrder: (item) => `*ORDER YAKO IMEPOKELEWA KWA HESHIMA* 📝\n\nSawa kabisa Boss wangu, tume-receive order ya *${item}*.\n\nKukamilisha order na kuanza kufanyiwa maandalizi sasa hivi, tafadhali fanya malipo hapa:\n`
            },
            en: {
                signature: "Hello! 👋 Welcome to Mjomba's Texas Grill, where our customers are Kings! 👑\n\nWe are here to ensure you get a VIP experience today. From juicy Steaks to delicious Wings... we've been waiting for you! 🥩🔥\n\n👇 To see our full menu, type *Menu*\n\nWe value you, Boss.\n\n📞 Order: 0694 980 000\n📍 Upanga — Nyama Bila Drama®",
                menu: `🥩 *MJOMBA'S TEXAS GRILL - FULL MENU* 🥩

🔥 *STEAKS (18,000/=)*
Pepper, Mjomba Special, Garlic Butter, Chilly Garlic, Mexican, Portugese, Tempenyaki, Schnitzel, Suzette.
🥩 *PREMIUM STEAKS*
- American: 20k | Chilly Cheese: 20k
- Ausberg (Cheese): 20k | Beef Flamberg: 23k

🍢 *IMPORTED STRIPS*
- Beef Strips: 20k | Nundu Strips: 25k
- Beef & Nundu Mix: 30k

💎 *PREMIUM CUTS*
- Tomahawk (500g): 45k
- Sirloin (300g): 40k

🍗 *CHICKEN (10,000/=)*
Portugese, Peri Peri, Texando, Sultan, Mjomba Choma.
- Crispy Chicken (Rice/Fries): 18k

🔥 *WINGS (8 PCS - 8,000/=)*
Buffalo, Peri Peri, Mjomba Special, Garlic, Mexican, Suicidal.
- Mango Habenero: 10k

🍟 *POUTINE (20,000/=)*
Chicken, Beef, Mjomba Special, Fusion, Extra Spicy.

🍖 *PLATTERS*
- Wings (1kg): 25k | Chicken (1kg): 50k
- Lazy Lion: 50k | Ribs (1kg): 70k
- Kamanda: 70k | XXL Carnivore: 150k

🔥 *NYAMA CHOMA*
200g: 20k | 300g: 30k | 400g: 40k | 500g: 50k

🥗 *SALADS*: 6,000/=
🍟 *SIDES*: Peri Peri Fries (3k), Lemon Fries (4k), Rice (4k), Mash (4k).`,
                hours: "🕒 *BUSINESS HOURS* 🕒\n\nTuesday: ❌ CLOSED\nMon - Sun: 4:00 PM - 11:30 PM",
                location: "📍 *LOCATION*\n\nMataka Road, Upanga! Call us at 0694 980 000 for directions. Nyama Bila Drama! 🥩🔥",
                payment: "💳 *LIPA NAMBA (Any network)*: 123456 (Mjomba's Grill)\n\nOnce you pay, **send the transaction screenshot here**!",
                fallback: "Welcome to Mjomba's Texas Grill! 🙏\n\nSorry Boss, I didn't quite get that. Would you like me to send our *Menu* so you can take a look? 🥩🔥\n\nWe're here for you!",
                thanks: "You're welcome, Boss! 🙏 Mjomba Texas Grill is at your service. If you need anything else, just let me know. Welcome back! 🥩🔥",
                askMenu: "\n\nThere you go, Boss! That's our menu. What would you like to start with today? 🥩🔥",
                whichFlavor: (item) => `Great Boss! What kind of *${item}* do you like? We have these:`,
                chooseOne: "_Which one should I put on the fire for you?_ 🥩",
                orderConf: (flavor, item) => `*YOUR ORDER IS READY* 📝\n\nPerfect Boss, I've received your order for *${flavor} ${item}* 🥩🔥 Excellent choice!\n\nTo complete your order and start preparations right now, please make your payment here:\n`,
                genOrder: (item) => `*YOUR ORDER HAS BEEN RECEIVED* 📝\n\nGot it Boss, we've received your order for *${item}*.\n\nTo complete your order and start preparations right now, please make your payment here:\n`
            }
        };

        this.categories = {
            wings: ["Buffalo", "Peri Peri", "Mjomba Special", "Garlic", "Mexican", "Suicidal", "Mango Habenero"],
            chicken: ["Portugese", "Peri Peri", "Texando", "Sultan", "Mjomba Choma", "Crispy Chicken"],
            steak: ["Pepper", "Mjomba Special", "Garlic Butter", "Chilly Garlic", "Mexican", "Portugese", "Tempenyaki", "Schnitzel", "Suzette", "American", "Chilly Cheese", "Ausberg", "Beef Flamberg"],
            poutine: ["Chicken", "Beef", "Mjomba Special", "Fusion", "Extra Spicy"]
        };
    }

    getLang(text, history) {
        // Detect English
        if (text.match(/\b(hello|hi|hey|good|morning|evening|want|need|order|give|show|where|hours|how much|thanks|thank|price)\b/i)) {
            return 'en';
        }
        // Detect Swahili
        if (text.match(/\b(habari|mambo|niaje|vipi|mzima|shikamoo|uhali|asante|shukrani|wapi|saa|ngapi|nini|mna)\b/i)) {
            return 'sw';
        }
        // Fallback to history or default (sw)
        const lastLang = history.find(h => h.role === 'model' && h.parts[0].text.includes('Welcome')) ? 'en' : 'sw';
        return lastLang;
    }

    async getResponseFromHistory(prompt, history = []) {
        const text = prompt.toLowerCase();
        const lang = this.getLang(text, history);
        const l = this.langs[lang];
        
        // 1. AWARENESS LOGIC (Contextual Memory)
        const lastBotMessage = history.filter(h => h.role === 'model').pop()?.parts[0]?.text || "";
        const isConfirming = text.match(/^(ndio|sawa|yap|yes|okay|ok|haina shida|itafaa|fanya hivyo|haya|poa|tuma|yah|vipo|got it|sure)/);
        
        if (isConfirming && (lastBotMessage.includes("menu") || lastBotMessage.includes("misosi"))) {
            return l.menu + l.askMenu;
        }

        // 2. GREETINGS
        if (text.match(/^(habari|mambo|hello|hi|hey|niaje|vipi|mzima|shikamoo|uhali|ooh|oyaa|mzeiya|boss|bos|pamoja|kwema|vipi|fresh|shwari|pouwa|poa|salama|morning|evening|greet)/)) {
            return l.signature;
        }

        // 3. GRATITUDE / THANKS
        if (text.match(/(shukrani|asante|shukuru|ubarikiwe|thanks|thank you|good|vizuri|pamoja sana|asante sana|welcome|pamoja)/)) {
            return l.thanks;
        }
        
        // 4. MENU / PRICES
        if (text.match(/(menu|bei|price|how much|ngapi|orodha|mnauza|vyakula|chakula|msosi|misosi|kula|nini|mna nini|kuna nini|mnanini|vipo|maajabu|mlo|mlo gani|msosi gani|kuna misosi gani|nitakula nini|mautundu|vitu|picha|tuma|nionyeshe|nina njaa|njaa|food|sell|eat|list)/)) {
            return l.menu + (lang === 'en' ? "\n\nWhat are we eating today, Boss? 🥩 (Type the item name, e.g., *Tomahawk* or *Wings*) 🔥" : "\n\nUnakula nini leo, Boss wangu wa nguvu? 🥩 (Andika jina la msosi, mfano: *Tomahawk* au *Wings*) 🔥");
        }

        // 5. FLAVOR DETECTION (Multi-Step Ordering)
        for (const [cat, items] of Object.entries(this.categories)) {
            const hasChosenFlavor = items.some(f => text.includes(f.toLowerCase()));
            if (hasChosenFlavor) {
                const flavor = items.find(f => text.includes(f.toLowerCase()));
                return l.orderConf(flavor, cat.charAt(0).toUpperCase() + cat.slice(1)) + l.payment + (lang === 'en' ? "\n\n_Once you finish, send the screenshot here so I can tell Mjomba to fire up the grill fast!_ ⚡🔥" : "\n\n_Ukimaliza, nitumie screenshot hapa nimwambie Mjomba awashe jiko fasta!_ ⚡🔥");
            }
        }

        // Detect if user mentions a CATEGORY but no flavor
        if (text.match(/(wings|wingz)/)) {
            return l.whichFlavor("Wings") + "\n✨ Buffalo\n✨ Peri Peri\n✨ Mjomba Special\n✨ Garlic\n✨ Mexican\n✨ Suicidal\n✨ Mango Habenero\n\n" + l.chooseOne;
        }
        if (text.match(/(chicken|kuku)/)) {
            return l.whichFlavor(lang === 'en' ? "Chicken" : "Kuku") + "\n✨ Portugese\n✨ Peri Peri\n✨ Texando\n✨ Sultan\n✨ Mjomba Choma\n✨ Crispy Chicken\n\n" + (lang === 'en' ? "_Which one would you like, Boss?_ 🍗" : "_Ungependa ipi mkuu?_ 🍗");
        }
        if (text.match(/(steak|steack)/)) {
            return l.whichFlavor("Steak") + "\n✨ Pepper\n✨ Mjomba Special\n✨ Garlic Butter\n✨ Chilly Garlic\n✨ Mexican\n✨ Portugese\n✨ Tempenyaki\n✨ Schnitzel\n✨ Suzette\n✨ American\n✨ Chilly Cheese\n✨ Ausberg\n✨ Beef Flamberg\n\n" + (lang === 'en' ? "_Which one should I send to the kitchen?_ 🥩🔥" : "_Unapenda ipi iingie jikoni?_ 🥩🔥");
        }
        if (text.match(/poutine/)) {
            return l.whichFlavor("Poutine") + "\n✨ Chicken Poutine\n✨ Beef Poutine\n✨ Mjomba Special Poutine\n✨ Fusion Poutine\n\n" + (lang === 'en' ? "_Tell me which one I should prepare now?_ 🍟🥩" : "_Niambie ipi nikuandalie sasa hivi?_ 🍟🥩");
        }

        // 6. GENERAL ORDERING
        if (text.match(/(bone|ribeye|nundu|strips|tomahawk|sirloin|platter|ribs|choma|chips|nataka|naitaji|nahitaji|nipatie|nipe|nichukulie|letae|leta|order|lamba|taka|hiitaji|want|give|get|take|need)/)) {
            let item = lang === 'en' ? "Your delicious meal 🥩" : "Msosi wako tamu 🥩";
            if (text.match(/t-?bone/)) item = "T-Bone Steak 🥩";
            else if (text.includes("tomahawk")) item = "Tomahawk (500g) 💎";
            else if (text.includes("sirloin")) item = "Sirloin (300g) 💎";
            else if (text.includes("ribeye")) item = "Ribeye Steak 🥩";
            else if (text.includes("nundu")) item = "Nundu Strips 🍢";
            else if (text.includes("strips")) item = "Beef Strips 🍢";
            else if (text.includes("platter")) item = "Platter 🍖";
            else if (text.includes("ribs")) item = "Ribs 1kg 🍖";
            else if (text.includes("choma")) item = lang === 'en' ? "Grilled Meat 🔥" : "Nyama Choma 🔥";
            
            return l.genOrder(item) + l.payment + (lang === 'en' ? "\n\n_Once you finish, send the screenshot here so I can confirm and tell Mjomba to start!_ ⚡🔥" : "\n\n_Ukimaliza, nitumie screenshot hapa ni-confirm fasta nimwambie Mjomba awashe jiko!_ ⚡🔥");
        }
        
        // 6. LOCATION
        if (text.match(/(wapi|location|mahali|place|mpo wapi|upanga|ramani|sehemu|njia|kuelekea|pande gani|ofisi|duka|restaurant|hoteli|hotel|where|find)/)) {
            return l.location;
        }

        // 7. HOURS / TIME
        if (text.match(/(saa ngapi|muda|open|closed|tuesday|jumanne|leo|mnafungua|mnafunga|time|when|day)/)) {
            return l.hours;
        }

        // 8. PAYMENT
        if (text.match(/(lipa|pay|pesa|cash|airtel|namba|malipo|ninalipaje|payment|how to pay|number)/)) {
            return l.payment;
        }

        // DEFAULT FALLBACK 
        return l.fallback;
    }
}

module.exports = LocalBrainService;
