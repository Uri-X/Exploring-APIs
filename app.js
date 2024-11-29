document.getElementById('convert-btn').addEventListener('click', async () => {
    const amount = parseFloat(document.getElementById('amount').value);
    const currency = document.getElementById('currency').value;
    const feePercentage = parseFloat(document.getElementById('fee').value);

    // Validate inputs
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount greater than zero.');
        return;
    }

    if (isNaN(feePercentage) || feePercentage < 0) {
        alert('Please enter a valid fee percentage.');
        return;
    }

    // Fetch Bitcoin price from API
    const apiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=${currency.toLowerCase()}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const exchangeRate = data?.bitcoin?.[currency.toLowerCase()];

        if (!exchangeRate) {
            alert('Error fetching Bitcoin price. Please try again.');
            return;
        }

        // Perform calculations
        const transactionFee = (amount * feePercentage) / 100;
        const amountAfterFee = amount - transactionFee;
        const btcAmount = amountAfterFee / exchangeRate;
        const satsAmount = btcAmount * 1e8;

        // Display results
        document.getElementById('result').innerHTML = `
            <p><strong>Converted BTC:</strong> ${btcAmount.toFixed(8)} BTC</p>
            <p><strong>Converted Sats:</strong> ${Math.floor(satsAmount)} sats</p>
        `;
        document.getElementById('fee-info').innerHTML = `
            <p><strong>Transaction Fee:</strong> ${transactionFee.toFixed(2)} ${currency} (${feePercentage}%)</p>
        `;
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('An error occurred while fetching data. Please try again later.');
    }
});

