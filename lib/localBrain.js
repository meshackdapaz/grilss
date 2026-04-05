class LocalBrainService {
    constructor() {
        this.signature = "Habari Boss wangu! 🙏 Karibu sana Mjomba's Texas Grill, sehemu pekee ambapo wateja wetu ni wafalme! 👑\n\nTuko hapa kuhakikisha unapata huduma ya VIP leo. Kutoka kwenye Steaks laini, Nundu tamu, mpaka Wings za moto... tumekusubiria wewe tu! 🥩🔥\n\n👇 Kuona misosi yetu yote, andika neno *Menu*\n\nTunakuthamini sana Boss.\n\n📞 Order: 0694 980 000\n📍 Upanga — Nyama Bila Drama®";
        
        this.menu = `🥩 *MJOMBA'S TEXAS GRILL - FULL MENU* 🥩

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
🍟 *SIDES*: Peri Peri Fries (3k), Lemon Fries (4k), Rice (4k), Mash (4k).`;
        
        this.hours = "🕒 *BUSINESS HOURS* 🕒\n\nTuesday: ❌ CLOSED\nMon - Sun: 4:00 PM - 11:30 PM";
        
        this.location = "📍 *LOCATION*\n\nMataka Road, Upanga! Tupigie simu 0694 980 000 tukuelekeze vizuri. Nyama Bila Drama! 🥩🔥";

        this.payment = "💳 *LIPA NAMBA (Mtandao wowote)*: 123456 (Mjomba's Grill)\n\nUkishalipa, **tuma screenshot ya muamala hapa**!";
    }

    async getResponseFromHistory(prompt, history = []) {
        const text = prompt.toLowerCase();
        
        // 1. AWARENESS LOGIC (Contextual Memory)
        const lastBotMessage = history.filter(h => h.role === 'model').pop()?.parts[0]?.text || "";
        const isConfirming = text.match(/^(ndio|sawa|yap|yes|okay|ok|haina shida|itafaa|fanya hivyo|haya|poa|tuma|yah|vipo)/);
        
        if (isConfirming && lastBotMessage.includes("menu")) {
            return this.menu + "\n\nTayari Boss! Hiyo hapo menu yetu. Ungependa kuanza na msosi gani leo? 🥩🔥";
        }

        // 2. GREETINGS (Street Swahili)
        if (text.match(/^(habari|mambo|hello|hi|hey|niaje|vipi|mzima|shikamoo|uhali|ooh|oyaa|mzeiya|boss|bos|pamoja|kwema|vipi|fresh|shwari|pouwa|poa|salama)/)) {
            return this.signature;
        }

        // 3. GRATITUDE / THANKS
        if (text.match(/(shukrani|asante|shukuru|ubarikiwe|thanks|thank you|good|vizuri|pamoja sana|asante sana)/)) {
            return "Pamoja sana Boss wangu! 🙏 Mjomba Texas Grill tuko kwa ajili yako. Kama unahitaji chochote kingine, usisite kuniambia. Karibu sana! 🥩🔥";
        }
        
        // 4. MENU / PRICES
        if (text.match(/(menu|bei|price|how much|ngapi|orodha|mnauza|vyakula|chakula|msosi|misosi|kula|nini|mna nini|kuna nini|mnanini|vipo|maajabu|mlo|mlo gani|msosi gani|kuna misosi gani|nitakula nini|mautundu|vitu|picha|tuma|nionyeshe|nina njaa|njaa)/)) {
            return this.menu + "\n\nUnakula nini leo, Boss wangu wa nguvu? 🥩 (Andika jina la msosi, mfano: *Tomahawk* au *Wings*) 🔥";
        }

        // 5. FLAVOR DETECTION (Multi-Step Ordering)
        const categories = {
            wings: ["Buffalo", "Peri Peri", "Mjomba Special", "Garlic", "Mexican", "Suicidal", "Mango Habenero"],
            chicken: ["Portugese", "Peri Peri", "Texando", "Sultan", "Mjomba Choma", "Crispy Chicken"],
            steak: ["Pepper", "Mjomba Special", "Garlic Butter", "Chilly Garlic", "Mexican", "Portugese", "Tempenyaki", "Schnitzel", "Suzette", "American", "Chilly Cheese", "Ausberg", "Beef Flamberg"],
            poutine: ["Chicken", "Beef", "Mjomba Special", "Fusion", "Extra Spicy"]
        };

        // Detect if the user is ALREADY choosing a specific flavor from a previous question
        for (const [cat, items] of Object.entries(categories)) {
            const hasChosenFlavor = items.some(f => text.includes(f.toLowerCase()));
            if (hasChosenFlavor) {
                const flavor = items.find(f => text.includes(f.toLowerCase()));
                return `*ORDER YAKO IMEKAMILIKA* 📝\n\nSawa kabisa Boss wangu, tume-receive order ya *${flavor} ${cat.charAt(0).toUpperCase() + cat.slice(1)}* 🥩🔥 Choice nzuri sana!\n\nKukamilisha order na kuanza kufanyiwa maandalizi sasa hivi, tafadhali fanya malipo hapa:\n${this.payment}\n\n_Ukimaliza, nitumie screenshot hapa nimwambie Mjomba awashe jiko fasta!_ ⚡🔥`;
            }
        }

        // Detect if user mentions a CATEGORY but no flavor
        if (text.match(/(wings|wingz)/)) {
            return `Sawa Boss! Unapenda *Wings* za aina gani? Tuna hizi hapa:\n✨ Buffalo\n✨ Peri Peri\n✨ Mjomba Special\n✨ Garlic\n✨ Mexican\n✨ Suicidal\n✨ Mango Habenero\n\n_Ungependa nikuwekee gani leo?_ 🥩`;
        }
        if (text.match(/(chicken|kuku)/)) {
            return `Sawa kabisa Boss! Ungependa *Kuku* gani mzeiya? Tunazo hizi:\n✨ Portugese\n✨ Peri Peri\n✨ Texando\n✨ Sultan\n✨ Mjomba Choma\n✨ Crispy Chicken\n\n_Ungependa ipi mkuu?_ 🍗`;
        }
        if (text.match(/(steak|steack)/)) {
            return `Ooh, *Steak*! Choice ya maulid Boss! Tuna hizi:\n✨ Pepper\n✨ Mjomba Special\n✨ Garlic Butter\n✨ Chilly Garlic\n✨ Mexican\n✨ Portugese\n✨ Tempenyaki\n✨ Schnitzel\n✨ Suzette\n✨ American\n✨ Chilly Cheese\n✨ Ausberg\n✨ Beef Flamberg\n\n_Unapenda ipi iingie jikoni?_ 🥩🔥`;
        }
        if (text.match(/poutine/)) {
            return `*Poutine* zimeingia! Unapenda aina gani Boss?\n✨ Chicken Poutine\n✨ Beef Poutine\n✨ Mjomba Special Poutine\n✨ Fusion Poutine\n\n_Niambie ipi nikuandalie sasa hivi?_ 🍟🥩`;
        }

        // 6. GENERAL ORDERING (Catch-all for other items)
        if (text.match(/(bone|ribeye|nundu|strips|tomahawk|sirloin|platter|ribs|choma|chips|nataka|naitaji|nahitaji|nipatie|nipe|nichukulie|letae|leta|order|lamba|taka|hiitaji)/)) {
            let item = "Msosi wako tamu 🥩";
            if (text.match(/t-?bone/)) item = "T-Bone Steak 🥩";
            else if (text.includes("tomahawk")) item = "Tomahawk (500g) 💎";
            else if (text.includes("sirloin")) item = "Sirloin (300g) 💎";
            else if (text.includes("ribeye")) item = "Ribeye Steak 🥩";
            else if (text.includes("nundu")) item = "Nundu Strips 🍢";
            else if (text.includes("strips")) item = "Beef Strips 🍢";
            else if (text.includes("platter")) item = "Platter 🍖";
            else if (text.includes("ribs")) item = "Ribs 1kg 🍖";
            else if (text.includes("choma")) item = "Nyama Choma 🔥";
            
            return `*ORDER YAKO IMEPOKELEWA KWA HESHIMA* 📝\n\nSawa kabisa Boss wangu, tume-receive order ya *${item}*.\n\nKukamilisha order na kuanza kufanyiwa maandalizi sasa hivi, tafadhali fanya malipo hapa:\n${this.payment}\n\n_Ukimaliza, nitumie screenshot hapa ni-confirm fasta nimwambie Mjomba awashe jiko!_ ⚡🔥`;
        }
        
        // 6. LOCATION
        if (text.match(/(wapi|location|mahali|place|mpo wapi|upanga|ramani|sehemu|njia|kuelekea|pande gani|ofisi|duka|restaurant|hoteli|hotel)/)) {
            return this.location;
        }

        // 7. HOURS / TIME
        if (text.match(/(saa ngapi|muda|open|closed|tuesday|jumanne|leo|mnafungua|mnafunga)/)) {
            return this.hours;
        }

        // 8. PAYMENT
        if (text.match(/(lipa|pay|pesa|cash|airtel|namba|malipo|ninalipaje|payment)/)) {
            return this.payment;
        }

        // DEFAULT FALLBACK 
        return "Karibu sana Mjomba's Texas Grill! 🙏\n\nSamahani Boss, sijakupata vizuri. Je, ungependa nikutumie *Menu* yetu utupie jicho sasa hivi? 🥩🔥\n\nTuko hapa kukuhudumia VIP!";
    }
}

module.exports = LocalBrainService;
