import fetch from "node-fetch";

class StackVerify {
  constructor({ apiKey, baseUrl = "https://stackverify.site/api/v1" }) {
    if (!apiKey) throw new Error("API key is required");

    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/+$/, "");
    this.mode = apiKey.startsWith("sk_test_") ? "test" : "live";
  }

  async _request(path, options = {}) {
    const res = await fetch(`${this.baseUrl}${path}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      ...options,
    });

    let data;
    try {
      data = await res.json();
    } catch {
      data = null;
    }

    if (!res.ok) {
      const error = new Error(data?.message || "StackVerify API Error");
      error.status = res.status;
      error.error = data?.error || null;
      error.retry_after = data?.retry_after || null;
      throw error;
    }

    return data;
  }

  /**
   * Send SMS
   * Required permission: sms:send
   */
  async sendSMS({
    recipients,
    body,
    sender_id,
    templateId,
    scheduleAt,
  }) {
    if (!Array.isArray(recipients) || recipients.length === 0)
      throw new Error("recipients must be a non-empty array");

    if (!body && !templateId)
      throw new Error("Either body or templateId is required");

    if (!sender_id)
      throw new Error("sender_id is required");

    return this._request("/sms/send", {
      method: "POST",
      body: JSON.stringify({
        recipients,
        body,
        sender_id,
        templateId,
        scheduleAt,
      }),
    });
  }

  /**
   * Get SMS Status
   * Required permission: sms:read
   */
  async getSMSStatus(messageId) {
    if (!messageId) throw new Error("messageId is required");

    return this._request(`/sms/status/${encodeURIComponent(messageId)}`);
  }
}

export default StackVerify;
