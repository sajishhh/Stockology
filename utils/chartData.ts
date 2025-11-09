
export const generateDummyChartData = () => {
  const data = [];
  let price = Math.random() * 200 + 100; // Start price between 100 and 300
  const today = new Date();
  
  for (let i = 90; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Simulate price fluctuation
    const change = (Math.random() - 0.48) * (price * 0.05); // +/- up to 5% change
    price += change;
    price = Math.max(price, 10); // Ensure price doesn't go below 10

    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: parseFloat(price.toFixed(2)),
    });
  }
  
  return data;
};
