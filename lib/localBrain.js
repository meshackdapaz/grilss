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
        
        // 1. GREETINGS (Street Swahili)
        if (text.match(/^(habari|mambo|hello|hi|hey|niaje|vipi|mzima|shikamoo|uhali|ooh|oyaa|mzeiya|boss|bos|pamoja|kwema|vipi|fresh|shwari|pouwa|poa|salama)/)) {
            return this.signature;
        }

        // 2. GRATITUDE / THANKS
        if (text.match(/(shukrani|asante|shukuru|ubarikiwe|thanks|thank you|good|sawa|vizuri|pamoja sana|asante sana|poa)/)) {
            return "Pamoja sana Boss wangu! 🙏 Mjomba Texas Grill tuko kwa ajili yako. Kama unahitaji chochote kingine, usisite kuniambia. Karibu sana! 🥩🔥";
        }
        
        // 3. MENU / PRICES / "WHAT DO YOU SELL?" (Expanded Brilliance)
        if (text.match(/(menu|bei|price|how much|ngapi|orodha|mnauza|vyakula|chakula|msosi|misosi|kula|nini|mna nini|kuna nini|mnanini|vipo|maajabu|mlo|mlo gani|msosi gani|kuna misosi gani|nitakula nini|mautundu|vitu|picha|tuma|nionyeshe|nina njaa|njaa)/)) {
            return this.menu + "\n\nUnakula nini leo, Boss wangu wa nguvu? 🥩 (Andika jina la msosi, mfano: *Tomahawk* au *Wings*) 🔥";
        }

        // 4. ORDERING FOOD (Full Menu Logic - Expanded)
        if (text.match(/(steak|bone|ribeye|wings|nundu|poutine|chicken|strips|tomahawk|sirloin|platter|ribs|choma|kuku|chips|nataka|naitaji|nahitaji|nipatie|nipe|nichukulie|letae|leta|order|lamba|taka|hiitaji)/)) {
            let item = "Msosi wako tamu 🥩";
            if (text.match(/t-?bone/)) item = "T-Bone Steak 🥩";
            else if (text.includes("tomahawk")) item = "Tomahawk (500g) 💎";
            else if (text.includes("sirloin")) item = "Sirloin (300g) 💎";
            else if (text.includes("ribeye")) item = "Ribeye Steak 🥩";
            else if (text.includes("wings")) item = "BBQ Wings 🍗";
            else if (text.includes("nundu")) item = "Nundu Strips 🍢";
            else if (text.includes("poutine")) item = "Poutine Special 🍟";
            else if (text.includes("platter")) item = "Platter 🍖";
            else if (text.includes("ribs")) item = "Ribs 1kg 🍖";
            else if (text.includes("choma")) item = "Nyama Choma 🔥";
            else if (text.match(/chicken|kuku/)) item = "Mjomba Chicken 🍗";
            
            return `*ORDER YAKO IMEPOKELEWA KWA HESHIMA* 📝\n\nSawa kabisa Boss wangu, tume-receive order ya *${item}*.\n\nKukamilisha order na kuanza kufanyiwa maandalizi sasa hivi, tafadhali fanya malipo hapa:\n${this.payment}\n\n_Ukimaliza, nitumie screenshot hapa ni-confirm fasta!_ ⚡🔥`;
        }
        
        // 5. LOCATION (Expanded)
        if (text.match(/(wapi|location|mahali|place|mpo wapi|upanga|ramani|sehemu|njia|kuelekea|pande gani|ofisi|duka|restaurant|hoteli|hotel)/)) {
            return this.location;
        }

        // 6. HOURS / TIME
        if (text.match(/(saa ngapi|muda|open|closed|tuesday|jumanne|leo|mnafungua|mnafunga)/)) {
            return this.hours;
        }

        // 7. PAYMENT
        if (text.match(/(lipa|pay|pesa|cash|airtel|namba|malipo|ninalipaje|payment)/)) {
            return this.payment;
        }

        // DEFAULT FALLBACK (If keyword is not matched)
        return "Karibu sana Mjomba's Texas Grill! 🙏\n\nSamahani Boss, sijakupata vizuri. Je, ungependa nikutumie *Menu* yetu utupie jicho? Au unataka kujua *Mahali* tulipo Upanga? 🥩🔥\n\nTuko hapa kukuhudumia VIP!";
    }
}

module.exports = LocalBrainService;
