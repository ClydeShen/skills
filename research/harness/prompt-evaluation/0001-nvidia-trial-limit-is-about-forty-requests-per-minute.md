# The NVIDIA trial endpoint allows about 40 requests per minute and rejects bursts

Date: 2026-11-10. Status: implemented in the shared evaluation runner and its hooks; the figure is unofficial and unverified against an NVIDIA page.

## Finding

The hosted trial endpoint at `https://integrate.api.nvidia.com/v1` answers HTTP 429 above about 40 requests per minute for one account. It also answers 429 to a quick burst well below that average, and it recovers within seconds. A gap between request starts handles both. [measured; reported]

- [reported] Forum threads on developer.nvidia.com repeatedly give a default of 40 requests per minute and ask for 200. A reply in those threads says the limit varies by model, use case and overall traffic, and that the free tier has no way to raise it. These are user reports. NVIDIA publishes no universal figure that this research could read.
- [reported] Sources disagree on whether the older credit balance (1,000 credits, up to 5,000 on request) still applies. The runner does not depend on it.
- [measured, one account, `nvidia/nemotron-3.5-lightning-30b-a3b`, `max_tokens` 1, 2026-11-10]
  - A successful response carries no `x-ratelimit-*` or `Retry-After` header, so the limit cannot be read from the response. The only headers beyond standard ones are `nvcf-reqid`, `nvcf-status` and `x-request-id`.
  - Twenty requests sent in about 0.6 seconds: 15 succeeded, then 429 began. The next request after 7 seconds succeeded. The limit therefore also bounds a burst, not only the one-minute total.
  - One request every 1.5 seconds for 90 seconds (55 requests, about 37 per minute): none was limited.
  - A sustained 60 per minute was not run, so the limit between 37 and 60 per minute on this account is unmeasured.
- [owner-supplied summary, unattributed] The same 40 requests per minute, with exponential backoff, a queue that keeps outbound calls within 40 per rolling 60 seconds, and response caching as mitigations; a paid cloud-partner or self-hosted deployment as the route to higher limits.

## Rule

- Every request to the endpoint, from any skill, suite or process on the machine, takes its start time from one schedule file, at least `60000 / NVIDIA_RPM` milliseconds after the previous one. One gap serves as the average limit and the burst limit.
- `NVIDIA_RPM` defaults to 36, four below the reported limit because other sessions may share a key, and cannot exceed 40.
- On a 429, retry after the larger of `Retry-After` (when sent) and an exponential backoff of 2, 4 and 8 seconds. The measured recovery was within 7 seconds.
- Promptfoo calls and the image judge both take their place in the schedule before each request, retries included. A cached Promptfoo response takes a place too, because it cannot be told from a request before the call.
- A session may not call the endpoint directly. A `PreToolUse` hook and a repository check enforce it.
- Persistent 429s at 36 per minute mean the account's limit is lower. Lower `NVIDIA_RPM`; do not switch model or endpoint automatically.
- The schedule is a file on one machine. Separate cloud sessions have separate filesystems, so concurrent sessions on one key do not share it; the margin below 40 is the only protection between them.

## Not verified

docs.api.nvidia.com, build.nvidia.com and docs.nvidia.com were not reachable from the measuring environment, so no official page states the figure, its scope (account, key or model) or any retry guidance. Whether large or vision models have a lower limit was not measured.

## Sources

- [NVIDIA Developer Forums: rate limit increase requests (40 to 200 RPM)](https://forums.developer.nvidia.com/t/nvidia-nim-api-rate-limit-increase-request-40-200-rpm-multi-model-benchmark-agentic-workflow/371277), read as search results on 2026-11-10; a user report.
- [NVIDIA Developer Forums: credit and rate-limit increase request](https://forums.developer.nvidia.com/t/api-access-confirmation-credit-rate-limit-increase-request-1-000-5-000-credits-40-200-rpm/375201), same date; a user report.
- [NVIDIA API Trial Terms](https://assets.ngc.nvidia.com/products/api-catalog/legal/NVIDIA%20API%20Trial%20Terms%20of%20Service.pdf): restrictions on time, request counts or credits, as the [earlier provider note](./nvidia-hosted-provider-2026-10-25.md) records.
