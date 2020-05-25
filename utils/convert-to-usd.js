export default function convertToUSD(cents) {
  // returns dollar representation of cents entered
  let dollars = cents / 100;
  return dollars.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });
}
