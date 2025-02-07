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
