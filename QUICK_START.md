# Quick Start Guide

## 🚀 Get Started in 3 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```

The app will automatically open at `http://localhost:3000`

### 3. Start Calculating!
- Select your billing period (Monthly or Annual)
- Choose calculation method (By dates or by days)
- Enter your subscription price
- Provide usage details
- Click "Calculate Pro Rata Amount"

---

## 📦 Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder - ready to deploy!

---

## 🐳 Deploy with Docker

```bash
# Build the Docker image
docker build -t pro-rata-calculator .

# Run the container
docker run -p 3000:3000 pro-rata-calculator
```

Or use Docker Compose:
```bash
docker-compose up
```

---

## 📚 Key Files

| File | Purpose |
|------|---------|
| `src/calculator.ts` | Main calculator API |
| `src/proRataCalculator.ts` | Calculation logic & utilities |
| `src/index.ts` | UI interactions & event handlers |
| `src/index.html` | HTML template |
| `src/styles.css` | Responsive styling |
| `webpack.config.js` | Build configuration |
| `tsconfig.json` | TypeScript configuration |

---

## 🔧 Available Commands

```bash
npm start              # Development server with hot reload
npm run build         # Production build (minified)
npm run build:dev     # Development build (not minified)
npm run type-check    # Check TypeScript types
npm run lint          # Same as type-check
```

---

## 💡 Example Usage (Programmatically)

```typescript
import { SubscriptionCalculator, BillingPeriod } from './src/calculator';

const calc = new SubscriptionCalculator();
calc.setBillingPeriod(BillingPeriod.MONTHLY);

// Calculate pro rata for partial month
const result = calc.calculateByDateRange(
  100,           // $100 monthly subscription
  '2024-01-01',  // Start date
  '2024-01-15'   // Cancellation date
);

console.log(`Refund amount: $${result.proRataAmount}`);
```

---

## 🌐 Deployment Options

1. **Vercel**: `vercel` (fastest)
2. **Netlify**: `netlify deploy --dir=dist`
3. **Docker**: Use the provided Dockerfile
4. **GitHub Pages**: Push `dist/` folder
5. **Any Static Host**: Upload `dist/` folder

---

## ❓ Need Help?

- Check [README.md](README.md) for full documentation
- Review code comments in source files
- See [API Reference](README.md#api-reference) section

---

Happy calculating! 🎉
