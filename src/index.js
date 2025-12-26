import fetch from "node-fetch";

class StackVerify {
  constructor({ apiKey, baseUrl = "https://stackverify.site/api/v1" }) {
    if (!apiKey) throw new Error("API key is required");
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/+$/, "");
  }

  async _request(path, options = {}) {
    const res = await fetch(`${this.baseUrl}${path}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      ...options,
    });

    const text = await res.text().catch(() => null);

    if (!res.ok) throw new Error(`StackVerify SDK Error: ${text || res.status}`);
    try { return JSON.parse(text); } catch { return text; }
  }

  async sendSMS({ recipients, body, sender_id }) {
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0)
      throw new Error("recipients must be a non-empty array");
    if (!body) throw new Error("body is required");
    if (!sender_id) throw new Error("sender_id is required");

    return this._request("/sms/send", {
      method: "POST",
      body: JSON.stringify({ recipients, body, sender_id }),
    });
  }

  async getSMSStatus(messageId) {
    if (!messageId) throw new Error("messageId is required");
    return this._request(`/sms/status/${encodeURIComponent(messageId)}`);
  }
}

export default StackVerify;
