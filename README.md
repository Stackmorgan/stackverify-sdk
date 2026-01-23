## StackVerify SDK
StackVerify is a JavaScript library that helps you send SMS messages and Email campaigns using the StackVerify platform.
It works in Node.js, browsers, and modern runtimes and is designed to be simple—even if you are new to APIs.

**🧠 What Can This Library Do?***
With StackVerify SDK, you can:
- ✅ Send SMS messages
- ✅ Check SMS delivery status
- ✅ Send email campaigns (newsletters, announcements, alerts)
- ✅ Use one API key for everything
You do not need to understand servers or protocols to use it.
- 📦 Installation (Step by Step)
- 1️⃣ Install using npm
Copy code
Bash
```
npm install stackverify
```
- 2️⃣ (Optional) Node.js 16 users only
If you are using Node.js 16, install this once:
Copy code
Bash
```
npm install node-fetch
```
Node.js 18+, browsers, Bun, Deno, and edge runtimes work automatically.
🔑 Get Your API Key
**Before using the library, you need an API key.**
- Visit 👉 https://stackverify.site
- Create an account
- Copy your API key (it looks like sk_live_... or sk_test_...)
## 🚀 Your First Example (Very Simple)
Copy code
Js
```
import StackVerify from "stackverify";

// Create a StackVerify client
const stack = new StackVerify({
  apiKey: "YOUR_API_KEY"
});
```
That’s it.
Now you can send SMS or email.
## 📩 Sending an SMS (Beginner Friendly)
Example: Send a text message
Copy code
Js
```
async function sendMessage() {
  try {
    const result = await stack.sendSMS({
      recipients: ["+1234567890"], // Phone numbers
      body: "Hello! This is my first SMS 🚀",
      sender_id: "SMS"
    });

    console.log("SMS sent successfully:", result);
  } catch (error) {
    console.error("Something went wrong:", error.message);
  }
}

sendMessage();
```
## 📌 What these mean
recipients → List of phone numbers
body → Message text
sender_id → Name shown as sender
📡 Checking SMS Status
Copy code
Js
```
const status = await stack.getSMSStatus("MESSAGE_ID");
console.log(status);
```
You get MESSAGE_ID from sendSMS().
## 📧 Sending Emails (Step by Step)
Sending emails uses campaigns.
Think of a campaign as one email sent to many people.
Step 1️⃣ Check Your Email Domain
Before sending emails, your domain must be verified.
Copy code
Js
```
const domain = await stack.getDomainStatus("DOMAIN_ID");

if (domain.ready_for_sending) {
  console.log("Domain is ready to send emails!");
}
```
## Step 2️⃣ Create an Email Campaign
Copy code
Js
```
const campaign = await stack.createEmailCampaign({
  name: "Welcome Campaign",
  subject: "Welcome to StackVerify 🎉",
  html_body: "<h1>Hello!</h1><p>Thanks for joining us.</p>",
  text_body: "Hello! Thanks for joining us.",
  contact_list_id: "CONTACT_LIST_ID",
  sending_domain_id: "DOMAIN_ID",
  status: "draft"
});

console.log("Campaign created:", campaign);
```
## Step 3️⃣ Start the Campaign (Send Emails)
Copy code
Js
```
await stack.startCampaign(campaign.id);
console.log("Emails are being sent!");
```
## 📘 Library API (Simple Explanation)
Create Client
Copy code
Js
```
new StackVerify({ apiKey, baseUrl })
apiKey → Your StackVerify API key (required)
baseUrl → API URL (optional, advanced users only)
SMS Methods
sendSMS(options)
Send a text message.
Required:
recipients (array)
sender_id
body or templateId
getSMSStatus(messageId)
Check delivery status of a sent SMS.
Email Methods
getDomainStatus(domainId)
Check if email domain is verified.
createEmailCampaign(options)
Create an email campaign.
Required:
name
subject
contact_list_id
sending_domain_id
startCampaign(campaignId)
Send the email campaign.
```
## ❗ Error Handling (Important)
If something goes wrong, the library throws an error:
Copy code
Js
```
try {
  // API call
} catch (error) {
  console.error(error.message);
}
```
**Common reasons:**
- Invalid API key
- Missing required fields
- Domain not verified
- Network issues
## 🌍 Where Does This Work?
Environment
**Supported**
- Browser
✅
- Node.js 16+
✅
- Node.js 18+
✅
- Bun
✅
- Deno
✅
- Cloudflare Workers
---
## 📜 License
This project is licensed under the MIT License.
