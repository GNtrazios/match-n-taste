import type { CocktailMap } from '@/types'

export const cocktails: CocktailMap = {
  mojito: {
    id: 'mojito',
    name: 'Mojito',
    glass: '🍃',
    subtitle: { en: 'Fresh & Timeless', gr: 'Φρέσκο & Διαχρονικό' },
    description: {
      en: 'Crisp white rum with fresh mint and lime — a classic that never fails. Bright, refreshing, and effortlessly elegant.',
      gr: 'Λευκό ρούμι με φρέσκια μέντα και λάιμ — ένα κλασικό που δεν αποτυγχάνει ποτέ. Φωτεινό, δροσιστικό και κομψό.',
    },
    ingredients: ['White Rum', 'Fresh Mint', 'Lime Juice', 'Sugar', 'Soda Water'],
  },
  aperolSpritz: {
    id: 'aperolSpritz',
    name: 'Aperol Spritz',
    glass: '🍊',
    subtitle: { en: 'Light & Sociable', gr: 'Ελαφρύ & Κοινωνικό' },
    description: {
      en: 'Vibrant orange Aperol with prosecco and a splash of soda. Perfect for golden-hour conversations and easy evenings.',
      gr: 'Ζωντανό πορτοκαλί Aperol με prosecco και σόδα. Ιδανικό για χαλαρές συζητήσεις και βραδιές.',
    },
    ingredients: ['Aperol', 'Prosecco', 'Soda Water', 'Orange Slice'],
  },
  negroni: {
    id: 'negroni',
    name: 'Negroni',
    glass: '🍸',
    subtitle: { en: 'Bold & Sophisticated', gr: 'Έντονο & Εκλεπτυσμένο' },
    description: {
      en: 'A perfectly balanced trio of gin, Campari, and sweet vermouth. Complex, bitter, and undeniably refined.',
      gr: 'Gin, Campari και γλυκό vermouth σε τέλεια ισορροπία. Σύνθετο, πικρό, αναμφισβήτητα εκλεπτυσμένο.',
    },
    ingredients: ['Gin', 'Campari', 'Sweet Vermouth', 'Orange Peel'],
  },
  oldFashioned: {
    id: 'oldFashioned',
    name: 'Old Fashioned',
    glass: '🥃',
    subtitle: { en: 'Classic & Deep', gr: 'Κλασικό & Βαθύ' },
    description: {
      en: 'Aged whiskey softened with a sugar cube and aromatic bitters. A timeless ritual in a glass — slow, deep, unforgettable.',
      gr: 'Aged whiskey με κύβο ζάχαρης και aromatic bitters. Ένα άχρονο τελετουργικό σε ποτήρι — αργό, βαθύ, αξέχαστο.',
    },
    ingredients: ['Bourbon Whiskey', 'Sugar Cube', 'Angostura Bitters', 'Orange Peel'],
  },
  daiquiri: {
    id: 'daiquiri',
    name: 'Daiquiri',
    glass: '🍋',
    subtitle: { en: 'Sharp & Citrusy', gr: 'Κοφτό & Εσπεριδοειδές' },
    description: {
      en: 'Rum, fresh lime juice and sugar — deceptively simple yet brilliantly sharp. Three ingredients, perfectly balanced.',
      gr: 'Ρούμι, φρέσκος χυμός λάιμ και ζάχαρη — απλό αλλά εντυπωσιακά ισορροπημένο. Τρία υλικά, τέλεια εκτέλεση.',
    },
    ingredients: ['White Rum', 'Fresh Lime Juice', 'Sugar Syrup'],
  },
  cosmopolitan: {
    id: 'cosmopolitan',
    name: 'Cosmopolitan',
    glass: '🍸',
    subtitle: { en: 'Chic & Fruity', gr: 'Σικ & Φρουτένιο' },
    description: {
      en: 'Vodka, triple sec, cranberry and lime — the definition of effortless cool. As stylish as the night ahead.',
      gr: 'Βότκα, triple sec, cranberry και λάιμ — ορισμός της απίθανης κομψότητας. Τόσο σικ όσο και η βραδιά.',
    },
    ingredients: ['Vodka', 'Triple Sec', 'Cranberry Juice', 'Lime Juice'],
  },
  ginTonic: {
    id: 'ginTonic',
    name: 'Gin & Tonic',
    glass: '🥒',
    subtitle: { en: 'Crisp & Botanical', gr: 'Δροσερό & Βοτανικό' },
    description: {
      en: 'Premium gin elevated by tonic and botanicals — endlessly customisable, always satisfying. The thinking person\'s drink.',
      gr: 'Premium gin με tonic και botanicals — άπειρα παραλλάξιμο, πάντα ικανοποιητικό. Το ρόφημα των στοχαστών.',
    },
    ingredients: ['Premium Gin', 'Tonic Water', 'Cucumber', 'Juniper & Botanicals'],
  },
  palomaRose: {
    id: 'palomaRose',
    name: 'Paloma Rosé',
    glass: '🌸',
    subtitle: { en: 'Floral & Light', gr: 'Ανθικό & Ελαφρύ' },
    description: {
      en: 'Tequila with grapefruit soda and a whisper of rose — unexpectedly elegant and completely refreshing.',
      gr: 'Tequila με grapefruit soda και μια νύξη ροζ — απροσδόκητα κομψό και τελείως δροσιστικό.',
    },
    ingredients: ['Blanco Tequila', 'Grapefruit Soda', 'Rose Syrup', 'Lime'],
  },
  espressoMartini: {
    id: 'espressoMartini',
    name: 'Espresso Martini',
    glass: '☕',
    subtitle: { en: 'Dark & Electric', gr: 'Σκούρο & Ηλεκτρικό' },
    description: {
      en: 'Freshly pulled espresso shaken with vodka and coffee liqueur. Smooth, dark, electric — the night is just getting started.',
      gr: 'Espresso με βότκα και coffee liqueur. Απαλό, σκούρο, ηλεκτρικό — η νύχτα μόλις ξεκίνησε.',
    },
    ingredients: ['Vodka', 'Fresh Espresso', 'Coffee Liqueur', 'Sugar Syrup'],
  },
  margarita: {
    id: 'margarita',
    name: 'Margarita',
    glass: '🍹',
    subtitle: { en: 'Tangy & Festive', gr: 'Ξινό & Γιορτινό' },
    description: {
      en: 'Tequila, triple sec and fresh lime with a salted rim. Vibrant, festive, always a crowd-pleaser — impossible to drink just one.',
      gr: 'Tequila, triple sec και λάιμ με αλατισμένο χείλος. Ζωντανό, γιορτινό — αδύνατο να πιεις μόνο ένα.',
    },
    ingredients: ['Tequila', 'Triple Sec', 'Fresh Lime Juice', 'Salt Rim'],
  },
}
