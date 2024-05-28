const fs = require('fs');

const comchat_vali_addr = "5D4o6H19z6ctWjS9HzxBpMxqhuzCCCsgXk49AqXGPUqZEpRt"
const https_provider_url = "https://commune-api-node-0.communeai.net/public-http"

const fetchStaking = async () => {
    // Check staking amount
    const payload = {
        "id": 1,
        "jsonrpc": "2.0",
        "method": "subspace_getModuleInfo",
        "params": [comchat_vali_addr, 0]
    }

    const response = await fetch(https_provider_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // This tells the API you're sending JSON
        },
        body: JSON.stringify(payload) // Converts your data object to JSON string
    });

    if (!response.ok) {
        return new NextResponse(`Unable to fetch staking info. Please relax a bit while.`, {
            status: 400,
        });
    }

    const responseData = await response.json();
    const stake_from = responseData["result"]["stats"]["stake_from"]

    const result = {}
    for (const index in stake_from) {

        const key = stake_from[index][0]
        const staking = stake_from[index][1]
        result[key] = staking
    }

    // Convert the result object to a JSON string
    const jsonString = JSON.stringify(result);

    // Write the JSON string to a file
    fs.writeFile('public/staking.json', jsonString, (err) => {
        if (err) {
            console.error('Error writing to file', err);
        } else {
            console.log('Successfully wrote to staking.json');
        }
    });
}

// Run fetchStaking every 1 minute (60000 milliseconds)
setInterval(fetchStaking, 60000);

// Initial call to fetchStaking to run it immediately
fetchStaking();