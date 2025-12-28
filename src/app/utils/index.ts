export function getCurrentHostname() {
  return process.env.DOMAIN ?? window.location.hostname;
}

export function convertToNumberFormat(value: number | undefined): string {
  if (value === undefined || isNaN(value)) {
    return '-'; // Trả về giá trị mặc định nếu đầu vào không hợp lệ
  }

  return new Intl.NumberFormat('en-US', {
    useGrouping: true,
  }).format(value);
}

// Convert JPY to USD (approximate exchange rate: 1 USD = 150 JPY)
export function convertJPYToUSD(jpyValue: number | undefined): number {
  if (jpyValue === undefined || isNaN(jpyValue)) {
    return 0;
  }
  const exchangeRate = 150; // 1 USD = 150 JPY
  return jpyValue / exchangeRate;
}
