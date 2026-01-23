/* --------------------------------------------------
 * StackVerify Universal SDK
 * Works in Browser, Node 18+, Bun, Deno, Workers
 * -------------------------------------------------- */

function resolveFetch() {
  if (typeof globalThis.fetch === "function") {
    return globalThis.fetch.bind(globalThis);
  }

  throw new Error(
    "Fetch API not found. If you're using Node <18, please polyfill fetch (e.g. node-fetch)."
  );
}

/* -------------------------------------------------- */

class StackVerify {
  constructor({ apiKey, baseUrl = "https://api.stackverify.site/api" } = {}) {
    if (!apiKey) {
      throw new Error("StackVerify: apiKey is required");
    }

    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/+$/, "");
    this.fetch = resolveFetch();
    this.mode = apiKey.startsWith("sk_test_") ? "test" : "live";
  }

  /* ---------------- Internal Request ---------------- */

  async _request(path, options = {}) {
    const res = await this.fetch(`${this.baseUrl}${path}`, {
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
    } catch {}

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

  async getSMSStatus(messageId) {
    if (!messageId) {
      throw new Error("getSMSStatus: messageId is required");
    }
    return this._request(`/v1/sms/status/${encodeURIComponent(messageId)}`);
  }

  /* ===================== EMAIL ===================== */

  async getDomainStatus(domainId) {
    if (!domainId) {
      throw new Error("getDomainStatus: domainId is required");
    }
    return this._request(`/domains/${encodeURIComponent(domainId)}`);
  }

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
    if (!subject) throw new Error("createEmailCampaign: subject is required");
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

export default StackVerify;
