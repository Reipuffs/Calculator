import './styles.css';
import logoUrl from './assets/SSG-logotype.png';
import { SubscriptionCalculator } from './calculator';
import { BillingPeriod } from './proRataCalculator';

// Initialize calculator
const calculator = new SubscriptionCalculator();

const appLogo = document.getElementById('appLogo') as HTMLImageElement | null;
if (appLogo) {
  appLogo.src = logoUrl;
}


// DOM Elements
const billingPeriodBtns = document.querySelectorAll('.btn-period');
const calculationModeBtns = document.querySelectorAll('.btn-mode');
const subscriptionPriceInput = document.getElementById('subscriptionPrice') as HTMLInputElement;
const startDateInput = document.getElementById('startDate') as HTMLInputElement;
const endDateInput = document.getElementById('endDate') as HTMLInputElement;
const daysUsedInput = document.getElementById('daysUsed') as HTMLInputElement;
const calculateBtn = document.getElementById('calculateBtn') as HTMLButtonElement;
const clearBtn = document.getElementById('clearBtn') as HTMLButtonElement;
const byDateSection = document.getElementById('byDateSection') as HTMLElement;
const byDaysSection = document.getElementById('byDaysSection') as HTMLElement;
const resultsSection = document.getElementById('resultsSection') as HTMLElement;

// Set today as default start date
const today = new Date().toISOString().split('T')[0];
startDateInput.value = today;

// Billing Period Selection
billingPeriodBtns.forEach((btn) => {
  (btn as HTMLButtonElement).addEventListener('click', () => {
    billingPeriodBtns.forEach((b) => (b as HTMLButtonElement).classList.remove('active'));
    (btn as HTMLButtonElement).classList.add('active');
    const periodValue = (btn as HTMLButtonElement).dataset.period;
    let period: BillingPeriod;
    if (periodValue === 'monthly') {
      period = BillingPeriod.MONTHLY;
    } else if (periodValue === 'annual_early_cancellation') {
      period = BillingPeriod.ANNUAL_EARLY_CANCELLATION;
    } else {
      period = BillingPeriod.ANNUAL;
    }
    calculator.setBillingPeriod(period);
  });
});

// Calculation Mode Selection
calculationModeBtns.forEach((btn) => {
  (btn as HTMLButtonElement).addEventListener('click', () => {
    calculationModeBtns.forEach((b) => (b as HTMLButtonElement).classList.remove('active'));
    (btn as HTMLButtonElement).classList.add('active');
    const mode = ((btn as HTMLButtonElement).dataset.mode) as 'byDates' | 'byDays';
    calculator.setCalculationMode(mode);

    // Toggle sections
    if (mode === 'byDates') {
      byDateSection.classList.remove('hidden');
      byDaysSection.classList.add('hidden');
    } else {
      byDateSection.classList.add('hidden');
      byDaysSection.classList.remove('hidden');
    }

    // Clear results
    resultsSection.classList.add('hidden');
  });
});

// Calculate Button Click Handler
calculateBtn.addEventListener('click', () => {
  const price = parseFloat(subscriptionPriceInput.value);

  if (!price || price < 0) {
    alert('Please enter a valid subscription price');
    return;
  }

  try {
    const currentMode = document.querySelector('.btn-mode.active')?.getAttribute('data-mode');
    
    if (currentMode === 'byDates') {
      if (!startDateInput.value || !endDateInput.value) {
        alert('Please select both start and end dates');
        return;
      }

      const result = calculator.calculateByDateRange(
        price,
        startDateInput.value,
        endDateInput.value
      );

      displayResults(result, price);
    } else if (currentMode === 'byDays') {
      const days = parseInt(daysUsedInput.value);

      if (!days || days < 0) {
        alert('Please enter a valid number of days');
        return;
      }

      const result = calculator.calculateByDays(price, days);
      displayResults(result, price);
    }

    resultsSection.classList.remove('hidden');
    resultsSection.scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    alert(`Error: ${error instanceof Error ? error.message : 'An error occurred'}`);
  }
});

// Display Results
function displayResults(result: any, originalPrice: number): void {
  document.getElementById('resultDailyRate')!.textContent = 
    SubscriptionCalculator.formatCurrency(result.dailyRate);
  document.getElementById('resultDaysInPeriod')!.textContent = 
    result.daysInPeriod.toString();
  document.getElementById('resultDaysUsed')!.textContent = 
    result.daysUsed.toString();
  document.getElementById('resultPercentage')!.textContent = 
    SubscriptionCalculator.formatPercentage(result.percentageUsed);
  document.getElementById('resultFullAmount')!.textContent = 
    SubscriptionCalculator.formatCurrency(result.fullPeriodAmount);
  document.getElementById('resultProRata')!.textContent = 
    SubscriptionCalculator.formatCurrency(result.proRataAmount);

  // Calculate and display refund
  if (document.querySelector('.btn-mode.active')?.getAttribute('data-mode') === 'byDates') {
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;

    if (startDate && endDate) {
      try {
        const refund = calculator.calculateCancellationRefund(originalPrice, startDate, endDate);
        document.getElementById('resultRefund')!.textContent = 
          SubscriptionCalculator.formatCurrency(refund);
        document.getElementById('refundInfo')!.textContent = 
          'Refund if cancelled after the shown end date:';
      } catch (error) {
        document.getElementById('refundInfo')!.textContent = 'N/A - Cancellation is within billing period';
        document.getElementById('resultRefund')!.textContent = '$0.00';
      }
    }
  }
}

// Clear All Button
clearBtn.addEventListener('click', () => {
  subscriptionPriceInput.value = '';
  startDateInput.value = today;
  endDateInput.value = '';
  daysUsedInput.value = '';
  resultsSection.classList.add('hidden');
});

// Input Validation & Formatting
subscriptionPriceInput.addEventListener('input', () => {
  if (subscriptionPriceInput.value && parseFloat(subscriptionPriceInput.value) < 0) {
    subscriptionPriceInput.value = '0';
  }
});

daysUsedInput.addEventListener('input', () => {
  const value = parseInt(daysUsedInput.value);
  const maxDays = calculator.getBillingPeriod() === BillingPeriod.MONTHLY ? 31 : 366;
  if (value > maxDays) {
    daysUsedInput.value = maxDays.toString();
  }
});

// Enable/Disable calculate button based on inputs
function updateCalculateButtonState(): void {
  const price = subscriptionPriceInput.value.trim();
  const modeBtn = document.querySelector('.btn-mode.active') as HTMLElement;
  const mode = modeBtn?.getAttribute('data-mode');
  
  let isValid = !!price;
  
  if (mode === 'byDates') {
    isValid = isValid && !!startDateInput.value && !!endDateInput.value;
  } else if (mode === 'byDays') {
    isValid = isValid && !!daysUsedInput.value;
  }
  
  calculateBtn.disabled = !isValid;
}

subscriptionPriceInput.addEventListener('input', updateCalculateButtonState);
startDateInput.addEventListener('change', updateCalculateButtonState);
endDateInput.addEventListener('change', updateCalculateButtonState);
daysUsedInput.addEventListener('input', updateCalculateButtonState);

// Initialize button state
updateCalculateButtonState();

// Log app initialization
console.log('Pro Rata Subscription Calculator initialized');
console.log('Version: 1.0.0');
