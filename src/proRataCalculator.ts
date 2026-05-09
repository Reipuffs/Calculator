/**
 * Pro rata subscription calculator utility
 * Handles both monthly and annual subscription calculations
 */

export enum BillingPeriod {
  MONTHLY = 'monthly',
  ANNUAL = 'annual',
  ANNUAL_EARLY_CANCELLATION = 'annual_early_cancellation',
}

export interface CalculationResult {
  dailyRate: number;
  proRataAmount: number;
  fullPeriodAmount: number;
  daysInPeriod: number;
  daysUsed: number;
  percentageUsed: number;
}

/**
 * Calculate the number of days in a given month
 */
function getDaysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

/**
 * Calculate the number of days in a year
 */
function getDaysInYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Calculate pro rata subscription amount based on usage period
 * @param subscriptionPrice - The full subscription price
 * @param startDate - The start date of the subscription
 * @param endDate - The end date of the subscription
 * @param billingPeriod - Whether this is a monthly or annual subscription
 * @returns Calculation details including pro rata amount
 */
export function calculateProRata(
  subscriptionPrice: number,
  startDate: Date,
  endDate: Date,
  billingPeriod: BillingPeriod
): CalculationResult {
  if (subscriptionPrice < 0) {
    throw new Error('Subscription price cannot be negative');
  }

  if (startDate > endDate) {
    throw new Error('Start date cannot be after end date');
  }

  const daysInPeriod = billingPeriod === BillingPeriod.MONTHLY 
    ? getDaysInMonth(startDate)
    : billingPeriod === BillingPeriod.ANNUAL_EARLY_CANCELLATION
    ? Math.round((getDaysInYear(startDate.getFullYear()) ? 366 : 365) * (10 / 12)) // 10 months for early cancellation
    : getDaysInYear(startDate.getFullYear()) ? 366 : 365;

  // Calculate the number of days used
  const daysUsed = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  ) + 1; // +1 to include the start day

  let dailyRate: number;
  let proRataAmount: number;

  if (billingPeriod === BillingPeriod.ANNUAL_EARLY_CANCELLATION) {
    // For annual early cancellation, calculate based on 10-month billing period
    dailyRate = subscriptionPrice / daysInPeriod;
    proRataAmount = dailyRate * daysUsed;
  } else {
    dailyRate = subscriptionPrice / daysInPeriod;
    proRataAmount = dailyRate * daysUsed;
  }

  const percentageUsed = (daysUsed / daysInPeriod) * 100;

  return {
    dailyRate: Number(dailyRate.toFixed(2)),
    proRataAmount: Number(proRataAmount.toFixed(2)),
    fullPeriodAmount: subscriptionPrice,
    daysInPeriod,
    daysUsed,
    percentageUsed: Number(percentageUsed.toFixed(2)),
  };
}

/**
 * Calculate pro rata amount for a specific number of days
 */
export function calculateProRataByDays(
  subscriptionPrice: number,
  daysUsed: number,
  billingPeriod: BillingPeriod
): CalculationResult {
  if (subscriptionPrice < 0) {
    throw new Error('Subscription price cannot be negative');
  }

  if (daysUsed < 0) {
    throw new Error('Days used cannot be negative');
  }

  const daysInPeriod = billingPeriod === BillingPeriod.MONTHLY 
    ? 30 // Standard month for easy calculation
    : billingPeriod === BillingPeriod.ANNUAL_EARLY_CANCELLATION
    ? 304 // Approximately 10 months for early cancellation
    : 365;

  if (daysUsed > daysInPeriod) {
    throw new Error(`Days used cannot exceed ${daysInPeriod} days for ${billingPeriod} period`);
  }

  let dailyRate: number;
  let proRataAmount: number;

  if (billingPeriod === BillingPeriod.ANNUAL_EARLY_CANCELLATION) {
    // For annual early cancellation, calculate based on 10-month billing period
    dailyRate = subscriptionPrice / daysInPeriod;
    proRataAmount = dailyRate * daysUsed;
  } else {
    dailyRate = subscriptionPrice / daysInPeriod;
    proRataAmount = dailyRate * daysUsed;
  }

  const percentageUsed = (daysUsed / daysInPeriod) * 100;

  return {
    dailyRate: Number(dailyRate.toFixed(2)),
    proRataAmount: Number(proRataAmount.toFixed(2)),
    fullPeriodAmount: subscriptionPrice,
    daysInPeriod,
    daysUsed,
    percentageUsed: Number(percentageUsed.toFixed(2)),
  };
}

/**
 * Convert monthly price to annual equivalent
 */
export function monthlyToAnnual(monthlyPrice: number): number {
  return Number((monthlyPrice * 12).toFixed(2));
}

/**
 * Convert annual price to monthly equivalent
 */
export function annualToMonthly(annualPrice: number): number {
  return Number((annualPrice / 12).toFixed(2));
}

/**
 * Calculate refund for early cancellation
 */
export function calculateRefund(
  subscriptionPrice: number,
  startDate: Date,
  cancellationDate: Date,
  billingPeriod: BillingPeriod
): number {
  if (billingPeriod === BillingPeriod.ANNUAL_EARLY_CANCELLATION) {
    // For annual early cancellation, refund = price - used_amount
    // where used_amount is calculated with the adjusted rate
    const result = calculateProRata(subscriptionPrice, startDate, cancellationDate, billingPeriod);
    return Number((subscriptionPrice - result.proRataAmount).toFixed(2));
  }

  // Standard refund calculation for monthly and regular annual
  const nextBillingDate = new Date(startDate);
  if (billingPeriod === BillingPeriod.MONTHLY) {
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
  } else {
    nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
  }

  const unusedDays = Math.ceil(
    (nextBillingDate.getTime() - cancellationDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (unusedDays <= 0) return 0; // No refund if cancellation is after billing period ends

  const daysInPeriod = billingPeriod === BillingPeriod.MONTHLY 
    ? getDaysInMonth(startDate)
    : getDaysInYear(startDate.getFullYear()) ? 366 : 365;

  const dailyRate = subscriptionPrice / daysInPeriod;
  const refundAmount = dailyRate * unusedDays;

  return Number(refundAmount.toFixed(2));
}
