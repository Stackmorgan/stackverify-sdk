/* --------------------------------------------------
 * StackVerify Universal SDK
 * Works in Browser, Node, Bun, Deno, Workers
 * -------------------------------------------------- */

let _fetch;

/**
 * Resolve fetch in any environment
 */
async function getFetch() {
  if (_fetch) return _fetch;

  // Native fetch (Browser, Node 18+, Bun, Deno, Workers)
  if (typeof globalThis.fetch === "function") {
    _fetch = globalThis.fetch.bind(globalThis);
    return _fetch;
  }

  // Node <18 fallback
  try {
    const mod = await import("node-fetch");
    _fetch = mod.default;
    return _fetch;
  } catch {
    throw new Error(
      "Fetch API is not available. Please install 'node-fetch' or upgrade Node.js."
    );
  }
}

/* -------------------------------------------------- */

class StackVerify {
  constructor({ apiKey, baseUrl = "https://api.stackverify.site/api" } = {}) {
    if (!apiKey) {
      throw new Error("StackVerify: apiKey is required");
    }

    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/+$/, "");
    this.mode = apiKey.startsWith("sk_test_") ? "test" : "live";
  }

  /* ---------------- Internal Request ---------------- */

  async _request(path, options = {}) {
    const fetch = await getFetch();

    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      ...options,
    });

    let data = null;
    try {
      data = await res.json();
    } catch {
      /* non-json response */
    }

    if (!res.ok) {
      const err = new Error(
        data?.message || `StackVerify API error (${res.status})`
      );
      err.status = res.status;
      err.code = data?.error || null;
      err.retry_after = data?.retry_after || null;
      err.response = data;
      throw err;
    }

    return data;
  }

  /* ===================== SMS ===================== */

  /**
   * Send SMS
   * Permission: sms:send
   */
  async sendSMS({
    recipients,
    body,
    sender_id,
    templateId,
    scheduleAt,
  } = {}) {
    if (!Array.isArray(recipients) || recipients.length === 0) {
      throw new Error("sendSMS: recipients must be a non-empty array");
    }

    if (!body && !templateId) {
      throw new Error("sendSMS: body or templateId is required");
    }

    if (!sender_id) {
      throw new Error("sendSMS: sender_id is required");
    }

    return this._request("/v1/sms/send", {
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
   * Get SMS status
   * Permission: sms:read
   */
  async getSMSStatus(messageId) {
    if (!messageId) {
      throw new Error("getSMSStatus: messageId is required");
    }

    return this._request(
      `/v1/sms/status/${encodeURIComponent(messageId)}`
    );
  }

  /* ===================== EMAIL ===================== */

  /**
   * Check if sending domain is ready
   */
  async getDomainStatus(domainId) {
    if (!domainId) {
      throw new Error("getDomainStatus: domainId is required");
    }

    return this._request(`/domains/${encodeURIComponent(domainId)}`);
  }

  /**
   * Create an email campaign
   */
  async createEmailCampaign({
    name,
    subject,
    html_body,
    text_body,
    contact_list_id,
    sending_domain_id,
    status = "draft",
    scheduled_at = null,
  } = {}) {
    if (!name) throw new Error("createEmailCampaign: name is required");
    if (!subject)
      throw new Error("createEmailCampaign: subject is required");
    if (!contact_list_id)
      throw new Error("createEmailCampaign: contact_list_id is required");
    if (!sending_domain_id)
      throw new Error("createEmailCampaign: sending_domain_id is required");

    return this._request("/campaigns", {
      method: "POST",
      body: JSON.stringify({
        name,
        channel: "email",
        subject,
        html_body,
        text_body,
        contact_list_id,
        sending_domain_id,
        status,
        scheduled_at,
      }),
    });
  }

  /**
   * Start an email campaign
   */
  async startCampaign(campaignId) {
    if (!campaignId) {
      throw new Error("startCampaign: campaignId is required");
    }

    return this._request(
      `/campaigns/${encodeURIComponent(campaignId)}/start`,
      { method: "POST" }
    );
  }
}

/* -------------------------------------------------- */

export default StackVerify;
