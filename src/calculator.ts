import {
  calculateProRata,
  calculateProRataByDays,
  monthlyToAnnual,
  annualToMonthly,
  calculateRefund,
  BillingPeriod,
  CalculationResult,
} from './proRataCalculator';

export class SubscriptionCalculator {
  private calculationMode: 'byDates' | 'byDays' = 'byDates';
  private billingPeriod: BillingPeriod = BillingPeriod.MONTHLY;
  private lastResult: CalculationResult | null = null;

  /**
   * Set the calculation mode - either by date range or by number of days
   */
  setCalculationMode(mode: 'byDates' | 'byDays'): void {
    this.calculationMode = mode;
  }

  /**
   * Set the billing period (monthly or annual)
   */
  setBillingPeriod(period: BillingPeriod): void {
    this.billingPeriod = period;
  }

  /**
   * Get the current billing period
   */
  getBillingPeriod(): BillingPeriod {
    return this.billingPeriod;
  }

  /**
   * Calculate pro rata amount by date range
   */
  calculateByDateRange(
    price: number,
    startDate: string | Date,
    endDate: string | Date
  ): CalculationResult {
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

    this.lastResult = calculateProRata(price, start, end, this.billingPeriod);
    return this.lastResult;
  }

  /**
   * Calculate pro rata amount by number of days
   */
  calculateByDays(price: number, days: number): CalculationResult {
    this.lastResult = calculateProRataByDays(price, days, this.billingPeriod);
    return this.lastResult;
  }

  /**
   * Convert subscription prices between monthly and annual
   */
  convertPrice(price: number, fromPeriod: BillingPeriod, toPeriod: BillingPeriod): number {
    if (fromPeriod === toPeriod) return price;

    if (fromPeriod === BillingPeriod.MONTHLY && toPeriod === BillingPeriod.ANNUAL) {
      return monthlyToAnnual(price);
    } else {
      return annualToMonthly(price);
    }
  }

  /**
   * Calculate refund for early cancellation
   */
  calculateCancellationRefund(
    price: number,
    startDate: string | Date,
    cancellationDate: string | Date
  ): number {
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const cancellation = typeof cancellationDate === 'string' 
      ? new Date(cancellationDate) 
      : cancellationDate;

    return calculateRefund(price, start, cancellation, this.billingPeriod);
  }

  /**
   * Get the last calculation result
   */
  getLastResult(): CalculationResult | null {
    return this.lastResult;
  }

  /**
   * Format currency for display
   */
  static formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  /**
   * Format percentage with 2 decimal places
   */
  static formatPercentage(percentage: number): string {
    return `${percentage.toFixed(2)}%`;
  }
}
