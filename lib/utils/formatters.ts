export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(num);
}

export function formatInteger(num: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatTemperature(celsius: number, unit: 'C' | 'F' = 'C'): string {
  if (unit === 'F') {
    const fahrenheit = (celsius * 9) / 5 + 32;
    return `${fahrenheit.toFixed(1)}°F`;
  }
  return `${celsius.toFixed(1)}°C`;
}

export function formatPercent(value: number): string {
  return `${(value > 0 ? '+' : '')}${value.toFixed(1)}%`;
}

export function formatEnergy(kWh: number): string {
  if (kWh >= 1000000) {
    return `${(kWh / 1000000).toFixed(2)} GWh`;
  }
  if (kWh >= 1000) {
    return `${(kWh / 1000).toFixed(1)} MWh`;
  }
  return `${kWh.toFixed(0)} kWh`;
}

export function formatCarbon(tons: number): string {
  return `${tons.toFixed(1)} t CO₂e`;
}
