/**
 * Auto-categorizes a transaction based on merchant name, description, and type.
 * Evaluates keyword mappings against merchant and description strings.
 */
const CATEGORY_KEYWORDS = {
  food: [
    "swiggy", "zomato", "starbucks", "mcdonald", "kfc", "dominos", "pizza",
    "burger", "restaurant", "cafe", "food", "dining", "diner", "bakery",
    "subway", "dunkin", "grocery", "supermarket", "blinkit", "zepto", "instamart"
  ],
  shopping: [
    "amazon", "flipkart", "myntra", "walmart", "target", "ebay", "mall",
    "apparel", "clothing", "nike", "adidas", "zara", "h&m", "retail", "store"
  ],
  travel: [
    "uber", "ola", "lyft", "rapido", "flight", "indigo", "airasia", "emirates",
    "irctc", "train", "bus", "redbus", "airline", "hotel", "airbnb", "booking",
    "taxi", "cab", "petrol", "shell", "fuel", "gas"
  ],
  bills: [
    "electricity", "water", "gas", "wifi", "broadband", "airtel", "jio", "vodafone",
    "utility", "bill", "recharge", "rent", "maintenance", "insurance", "lic"
  ],
  entertainment: [
    "netflix", "spotify", "prime", "youtube", "hulu", "disney", "cinema",
    "pvrs", "bookmyshow", "steam", "playstation", "xbox", "game", "movie"
  ],
  health: [
    "hospital", "pharmacy", "doctor", "clinic", "apollo", "medplus", "1mg",
    "pharmeasy", "gym", "fitness", "health", "medical", "dental", "lab"
  ],
  education: [
    "udemy", "coursera", "school", "college", "university", "tuition", "books",
    "course", "education", "skillshare", "edx"
  ],
  salary: [
    "salary", "payroll", "stipend", "paycheck", "wages", "employer", "bonus"
  ],
  investment: [
    "zerodha", "groww", "upstox", "coinbase", "binance", "mutual fund",
    "stocks", "crypto", "dividend", "shares", "sip"
  ]
};

export const autoCategorize = (merchant = "", description = "", currentCategory = "") => {
  const normalizedCategory = String(currentCategory || "").trim().toLowerCase();
  
  // If a specific valid category is provided and isn't a fallback default, respect it
  if (
    normalizedCategory &&
    !["other", "general", "uncategorized", ""].includes(normalizedCategory)
  ) {
    return normalizedCategory;
  }

  const searchText = `${merchant} ${description}`.toLowerCase();

  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const kw of keywords) {
      // Use word boundary matching for short words (<=3 chars) to avoid false substring matches like "vi" in "movie"
      if (kw.length <= 3) {
        const regex = new RegExp(`\\b${kw}\\b`, "i");
        if (regex.test(searchText)) {
          return cat;
        }
      } else if (searchText.includes(kw)) {
        return cat;
      }
    }
  }

  return normalizedCategory || "other";
};

export default autoCategorize;
