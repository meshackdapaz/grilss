class LocalBrainService {
    constructor() {
        this.signature = "Welcome 😎🔥 This is not just a menu… it’s a life decision.\n\nChoose wisely — your hunger has a future 🤣🍖\nFrom juicy steaks, nundu strips to wings with attitude… we got you.\n\n👇 Menu is right here (don’t rush, take your time)\n\nIf you can’t decide, relax…\nMJOMBA will guide you like a meat doctor 🥼🔥\n\n📞 Order: 0694 980 000\n📍 Upanga — Nyama Bila Drama®";
        
        this.menu = "🥩 *MJOMBA'S MENU* 🥩\n\n🥩 *STEAKS*\n- T-Bone Steak: 18,000/=\n- Ribeye Steak: 18,000/=\n\n🍗 *WINGS & MORE*\n- BBQ Wings: 12,000/=\n- Nundu Strips: 15,000/=\n\n🍟 *SIDES*\n- Poutine (Fries with cheese): 10,000/=\n\n🔥 *SPECIAL*: Thursday Steaks are 15,000/=";
        
        this.hours = "🕒 *BUSINESS HOURS* 🕒\n\nTuesday: ❌ CLOSED (Relax… hata grills zinahitaji day off 😂 Kesho tunarudi na violence ya steak!)\nWed - Mon: 4:00 PM - 11:00 PM";
        
        this.location = "📍 *LOCATION*\n\nTuko Upanga! Tupigie simu 0694 980 000 tukuelekeze vizuri. Nyama Bila Drama! 🥩🔥";

        this.payment = "💸 *MALIPO / PAYMENT*\n\nCash is king! 👑 Lakini pia tunapokea mitandao yote + Airtel Money. Lipa namba ipo dukani.";
    }

    async getResponseFromHistory(prompt, history = []) {
        const text = prompt.toLowerCase();
        
        // 1. GREETINGS
        if (text.match(/^(habari|mambo|hello|hi|hey|niaje|vipi|mzima|shikamoo|uhali)/)) {
            return this.signature;
        }
        
        // 2. MENU / PRICES / "WHAT DO YOU SELL?"
        if (text.match(/(menu|bei|price|how much|ngapi|orodha|mnauza|vyakula|chakula|msosi|misosi|kula|nini|mna nini|kuna nini|mnanini|vipo)/)) {
            return this.menu + "\n\nUnataka ku-order nini boss? (Andika jina la sekta yako kama 'T-Bone' au 'Wings') 🥩";
        }

        // 3. ORDERING FOOD (New Logic)
        if (text.match(/(t-bone|tbone|ribeye|wings|nundu|poutine|kuku|chips|nataka)/)) {
            let item = "Nyama yako 🥩";
            if (text.match(/t-?bone/)) item = "T-Bone Steak 🥩";
            else if (text.includes("ribeye")) item = "Ribeye Steak 🥩";
            else if (text.includes("wings") || text.includes("kuku")) item = "BBQ Wings 🍗";
            else if (text.includes("nundu")) item = "Nundu Strips 🍢";
            else if (text.includes("poutine") || text.includes("chips")) item = "Poutine (Fries & Cheese) 🍟";
            
            return `*ORDER YAKO IMEPOKELEWA* 📝\n\nSawa kabisa boss, tume-receive order ya *${item}*.\n\nKukamilisha order, tafadhali fanya malipo kwa Lipa Namba yetu:\n💳 *Lipa Namba (Mtandao wowote)*: 123456 (Mjomba's Grill)\n\nUkishalipa, **tuma screenshot ya muamala hapa** ili tuwasha grill mara moja! Nyama Bila Drama! 🔥👊`;
        }
        
        // 3. LOCATION
        if (text.match(/(wapi|location|mahali|place|mpo wapi|upanga)/)) {
            return this.location;
        }

        // 4. HOURS / TIME
        if (text.match(/(saa ngapi|muda|open|closed|tuesday|jumanne|leo)/)) {
            return this.hours;
        }

        // 5. PAYMENT
        if (text.match(/(lipa|pay|pesa|cash|airtel|namba|malipo)/)) {
            return this.payment;
        }

        // DEFAULT FALLBACK (If keyword is not matched)
        return "Mjomba Meat Doctor hapa! 🥼🔥\n\nNitumie neno kama *Menu*, *Bei*, *Location*, au *Muda* nikuhudumie chap!";
    }
}

module.exports = LocalBrainService;
