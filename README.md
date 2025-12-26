# StackVerify SDK

A simple Node.js SDK to interact with the StackVerify API for sending SMS and checking message status.

## Installation

```bash
npm install stackverify
```
# Usage
```
import StackVerify from "stackverify";

// Initialize the SDK
const stack = new StackVerify({ apiKey: "YOUR_API_KEY" });

// Send an SMS and check status
async function main() {
  try {
    const response = await stack.sendSMS({
      recipients: ["+1234567890"], // array of phone numbers
      body: "Hello! This is a test message.",
      sender_id: "SMS"
    });
    console.log("SMS sent:", response);

    const status = await stack.getSMSStatus(response.message_id);
    console.log("SMS status:", status);

  } catch (err) {
    console.error("Error:", err.message);
  }
}

main();

```
# Api

new StackVerify({ apiKey, baseUrl })

apiKey (string) — Your StackVerify API key (required)

baseUrl (string) — API base URL (default: https://stackverify.site/api/v1)

sendSMS({ recipients, body, sender_id })

Send an SMS.

recipients — array of phone numbers (required)

body — SMS message text (required)

sender_id — your sender ID (required)

getSMSStatus(messageId)

Get the status of a sent message.

messageId — ID returned by sendSMS (required)
## Badges


[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)
[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)


## Authors

- [@morgan miller](https://www.github.com/Frost-bit-star)

- [@samwuel simiyu](https://github.com/Trojan-254)

## 🔗 Links
[![website](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://stackverify.site/)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/)
[![twitter](https://img.shields.io/badge/twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/)

