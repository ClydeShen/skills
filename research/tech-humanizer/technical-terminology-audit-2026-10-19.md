# Research: Technical terminology coverage for tech-humanizer

Date: 2026-10-19. Subject: Whether `skills/tech-humanizer/references/technical-terms.json` has current, well-organized coverage of technical terms that a prose humanizer must not casually paraphrase. Context: The skill needs to remove AI-shaped prose without replacing accepted technical language with vague or incorrect wording. This note records the pre-change audit and the resulting implementation.

Confidence markers:
- **[official]**: the relevant part of official docs, a specification, or a project's own documentation was read.
- **[official · summary only]**: only an overview or summary was read, or the page does not cover the detail.
- **[secondhand]**: a third-party description; none is used as evidence in this note.
- **[inference]**: the author's judgment, with no direct evidence.
- **[measured]**: the result of a command run on 2026-10-19.

## Overview

| Question | Recommendation | Strength of evidence | Confidence |
|---|---|---|---|
| 1. Does the current file cover the important domains? | Keep its eight-domain base. It is broad, but the AI, observability, platform, web-protocol, software-supply-chain, and modern data layers need focused additions. | strong for the inventory; medium for prioritization | [measured], [official], [inference] |
| 2. Are entries obsolete or duplicated? | Do not delete exact terms. There are no exact case-insensitive duplicates. Treat acronym/expanded-name pairs as aliases, and tag legacy, deprecated, emerging, and vendor-specific terms instead of silently removing them. | strong | [measured], [official] |
| 3. Is the current organization suitable for safe rewriting? | Replace arrays of bare strings with records that distinguish canonical names, aliases, maturity, match policy, source, and verification date. Generic words must require technical context. | medium | [inference] |
| 4. What should be added first? | Add a small high-value set: current AI interfaces and evaluation terms; OpenTelemetry and OCI terminology; Gateway API and current transport names; WebAuthn and supply-chain security terms; modern table-format terminology; SemVer and JSON Schema. | strong for term existence; medium for scope | [official], [inference] |

## 1. Pre-change coverage

### Evidence

At the start of the audit, the file was valid JSON and contained 473 terms in eight categories. The counts were: infrastructure and operations 148; data 39; security 41; software engineering 69; AI and machine learning 111; business analysis 23; quality assurance 26; project management 16. A correctly sorted, case-insensitive grouping found no exact duplicate groups. The exact check was `jq -r '[to_entries[] | select(.value | type == "array") | .value[]] | sort_by(ascii_downcase) | group_by(ascii_downcase)[] | select(length > 1) | @json'`; it returned no output. Direct checks found one `stateless` entry and one `RAG` entry. [measured]

Coverage is strongest for conventional infrastructure, delivery, testing, and pre-agentic machine-learning language. The list already preserves important exact pairs such as `OAuth` / `OAuth 2.0`, `JWT` / `JSON Web Token`, `RAG` / `Retrieval-Augmented Generation`, and `MCP` / `Model Context Protocol`. These are not wasteful duplicates: both forms occur in source prose and must survive a rewrite. [measured], [inference]

The list mixes five different kinds of entry without saying which kind each is:

| Kind | Examples in the current file | Why the distinction matters |
|---|---|---|
| Canonical concept | `distributed tracing`, `eventual consistency` | Preserve the established phrase. |
| Alias or abbreviation | `k8s`, `OIDC`, `MoE` | Preserve the form the author chose; do not expand or normalize it unless asked. |
| Product or project name | `Kubernetes`, `Terraform`, `Kafka` | Preserve spelling and capitalization. |
| Technical verb or adjective | `provision`, `quantized`, `stateless` | Protect it only when used technically. |
| Generic word with a technical sense | `model`, `agent`, `token`, `vector`, `stack`, `branch`, `query`, `index`, `schema`, `dependency` | A global exact-match lock creates false positives in ordinary prose. |

### Recommendation for the project

Keep the current categories as migration inputs, not as the final schema. The list is a useful backstop but must not be treated as a complete dictionary or as permission to paraphrase an unknown technical term. [inference]

Add a rule beside the data: preserve recognized and unrecognized domain terminology when the surrounding prose uses it as a term of art. Use the catalog to protect spelling, aliases, and high-risk phrases, not to decide that all absent words are ordinary language. [inference]

### Relation to existing constraints

This supports the existing `SKILL.md` instruction to lock technical terms and the runtime guidance in `ai-markers.md`, `final-rubric.md`, and `rewrite-playbook.md`. It does not change those files.

## 2. High-value additions

The lists below are deliberately selective. They contain terms likely to be damaged by synonym substitution, expansion, de-capitalization, or over-explanation. They are not an attempt to build a technology encyclopedia. [inference]

### AI, agent, and model tooling

Add as current, canonical terms or alias groups:

- `reasoning model`, `reasoning effort`, `reasoning tokens`;
- `Structured Outputs`, `structured output`, `JSON Schema`;
- `prompt caching`, `cached input tokens`;
- `eval`, `evals`, `grader`, `model snapshot`, `pinned model version`;
- `adapter`, `QLoRA`, `GGUF`, `safetensors`, `tensor parallelism`;
- `MCP host`, `MCP client`, `MCP server`, `MCP resource`, `MCP prompt`, `MCP tool`, `elicitation`, `capability negotiation`, `Streamable HTTP`.

OpenAI's current API documentation uses `reasoning effort`, prompt caching, Structured Outputs backed by JSON Schema, pinned model versions, and evals as distinct interface or operating concepts. [official] Hugging Face's own documentation identifies adapters, QLoRA, tensor parallelism, GGUF, and safetensors as specific model-training or model-format terms. [official] MCP documentation distinguishes hosts, clients, servers, prompts, resources, tools, elicitation, and transports. [official]

Keep product/API names such as `Responses API`, `Agents SDK`, and `computer use` in a vendor-specific layer rather than the evergreen core. Product names change faster than protocol and research terminology. [official] for existence; [inference] for placement.

Do not add `roots` and `sampling` as unqualified current MCP recommendations. The official MCP Python SDK records both as deprecated by the 2026-07-28 protocol revision while retaining them temporarily. If present, mark them `deprecated` with the protocol revision. [official]

### Cloud-native, runtime, and observability

Add:

- `OpenTelemetry`, `OTel`, `OTLP`, `OpenTelemetry Collector`, `trace`, `span`, `baggage`, `context propagation`, `semantic conventions`, `log correlation`;
- `Gateway API`, `GatewayClass`, `Gateway`, `HTTPRoute`, `GRPCRoute`;
- `operator pattern`, `custom controller`, `control loop`, `reconciliation loop`, `desired state`, `current state`;
- `OCI`, `OCI image`, `OCI artifact`, `OCI Image Spec`, `OCI Runtime Spec`, `OCI Distribution Spec`, `image manifest`, `content descriptor`, `digest`, `content-addressable storage`, `CAS`;
- `eBPF`.

OpenTelemetry defines traces, metrics, logs, and baggage as signals, and separately defines context propagation, the Collector, OTLP, and semantic conventions. [official] Kubernetes Gateway API defines `GatewayClass`, `Gateway`, and Route resources rather than treating “gateway” as a generic synonym for ingress. [official] The Open Container Initiative maintains separate Image, Runtime, and Distribution specifications and gives `descriptor`, `digest`, manifest, and artifact specific meanings. [official] These are high-risk rewrite targets because ordinary synonyms such as “record,” “package,” or “identifier” are not interchangeable with the technical names. [inference]

### Web and application protocols

Add:

- `HTTP/2`, `HTTP/3`, `QUIC`, `QPACK`;
- `WebAuthn`, `passkey`, `platform authenticator`, `roaming authenticator`, `relying party`;
- `WebAssembly`, `Wasm`, `WebAssembly module`, `WASI`;
- `WebTransport`, `WebTransport session`, `datagram`, `unidirectional stream`, `bidirectional stream` with maturity `emerging`.

HTTP/3 is the IETF mapping of HTTP semantics over QUIC; the names are not stylistic variants of HTTP or TCP. [official] WebAuthn Level 3 uses `passkey`, `platform authenticator`, `roaming authenticator`, and `relying party` as defined terms. [official] WebAssembly documentation uses both `WebAssembly` and `Wasm`, and distinguishes the core format from WASI. [official] Emerging web-platform terms should still be preserved when they occur, but the catalog must not imply universal stability or availability. [inference]

### Security and software supply chain

Add:

- `PKCE`, `Proof Key for Code Exchange`, `code verifier`, `code challenge`;
- `DPoP`, `Demonstrating Proof of Possession`, `proof of possession`;
- `SBOM`, `software bill of materials`, `SPDX`, `CycloneDX`, `VEX`, `Vulnerability Exploitability eXchange`;
- `SLSA`, `build provenance`, `source provenance`, `attestation`, `verified properties`;
- `Sigstore`, `Cosign`, `Fulcio`, `Rekor`, `keyless signing`, `transparency log`;
- `software supply chain`, `software supply chain failure`, `SSRF`, `server-side request forgery`;
- `post-quantum cryptography`, `PQC`, `KEM`, `ML-KEM`, `ML-DSA`, `SLH-DSA`, `crypto agility`.

PKCE and DPoP are IETF standards-track terms with protocol-specific meanings. [official] SPDX defines a standard for communicating bill-of-materials information, while SLSA defines supply-chain levels and provenance requirements; these names should not be flattened to generic “inventory” or “metadata.” [official] OWASP Top 10:2025 explicitly names Software Supply Chain Failures and folds SSRF into Broken Access Control; this confirms that the current security list is missing current category language. [official]

Post-quantum names are a useful second priority because exact algorithm identifiers matter, but they should enter with a source and verification date rather than as a timeless acronym dump. [official] for the NIST names; [inference] for priority.

### Data and developer tooling

Add:

- `Apache Iceberg`, `Iceberg table`, `open table format`, `Apache Parquet`, `Avro`, `ORC`, `schema evolution`, `hidden partitioning`, `time travel`, `snapshot`, `row-level delete`;
- `Semantic Versioning`, `SemVer`;
- `Language Server Protocol`, `LSP`, `language server`, `JSON-RPC`;
- `dev container`, `development container`, `Dev Container Specification`, `devcontainer.json`;
- `reproducible build`, `deterministic build`, `hermetic build`, `hermeticity`, `remote cache`, `remote execution`, `SOURCE_DATE_EPOCH`.

Apache Iceberg defines an open table format and uses schema evolution, hidden partitioning, snapshots, time travel, and row-level deletes as specific capabilities; these are more current gaps than adding more database product names. [official] Semantic Versioning defines `SemVer` around a public API and `X.Y.Z` meaning, so a humanizer should preserve the name rather than replace it with “version numbering.” [official]

### Recommendation for the project

Add the first four groups before expanding business analysis, project management, or generic programming vocabulary. The file already covers those latter areas adequately for its purpose. [inference]

Add exact long and short forms as aliases of one record. Preserve the form used in the input. Do not automatically expand `OTel` to `OpenTelemetry`, `PKCE` to its long form, or `Wasm` to `WebAssembly`. [inference]

### Relation to existing constraints

The proposed additions protect meaning during humanization. They do not tell the skill to insert fashionable vocabulary into text that did not contain it.

## 3. Duplicate, obsolete, and ambiguous entries

### Evidence

No exact case-insensitive duplicates were found. [measured]

Conceptual repetition is intentional in many pairs: acronym and expansion (`RTO` and `recovery time objective` would be an appropriate future pair), product and generic concept (`Docker` and `container`), or noun and adjective (`quantization` and `quantized`). The current file cannot express those relationships. [inference]

No existing term is demonstrably obsolete enough to delete from a preservation catalog. A source document can legitimately contain a legacy term, and rewriting it to the modern term can change historical or compatibility meaning. [inference]

The clearest current lifecycle case is MCP `roots` and `sampling`: official SDK documentation marks them deprecated as of the 2026-07-28 specification, but says they remain functional for a transition period. That calls for a `deprecated` status, not deletion from term recognition. [official]

Several existing entries need review or context controls rather than removal:

| Entry or group | Problem | Recommendation |
|---|---|---|
| `SSL` | Often appears as a legacy or loose label beside current TLS terminology. | Keep for exact preservation; tag `legacy`; never silently rewrite to `TLS`. |
| `backlog grooming` | Older team vocabulary coexists with `backlog refinement`. | Keep as a source alias; prefer neither during preservation. |
| `closed-weight` | Less consistently standardized than `open-weight`. | Mark `review`; require a source before treating it as canonical. |
| `agentic workflow`, `guardrails`, `hallucination` | Broad terms whose meaning varies by vendor and context. | Keep, but tag `context_required`; do not use them as automatic replacements. |
| `model`, `agent`, `prompt`, `token`, `vector`, `interface`, `stack`, `branch`, `commit`, `query`, `index`, `schema`, `migration`, `dependency` | Common English or cross-domain words. | Protect only when a technical-context check succeeds. |
| Vendor/project names | They age at different rates from standards. | Move to a vendor-specific layer with an owner and review date. |

### Recommendation for the project

Do not perform a removal pass based only on age. First migrate to a schema that can retain recognition while distinguishing preferred, legacy, deprecated, emerging, and vendor-specific terms. After migration, remove only entries that are misspelled, unsupported, or outside the skill's rewriting scope. [inference]

### Relation to existing constraints

This follows the skill's source-integrity requirement: preservation is different from modernization. If a user separately asks for technical modernization, the agent may propose a change with sources; a humanization pass must not make that change implicitly.

## 4. Recommended organization and maintenance

### Evidence

The bare-array format records only spelling and category. It cannot express aliases, case sensitivity, maturity, ambiguity, provenance, or when a claim was checked. [measured]

The official sources show why lifecycle metadata matters. OpenTelemetry components have Draft, Experimental, Stable, Deprecated, and Removed stages. MCP features can be deprecated by a dated protocol revision. Iceberg has adopted and in-development format versions. Web specifications can be Recommendations or drafts. [official]

### Recommendation for the project

Use records with at least these fields:

```json
{
  "canonical": "OpenTelemetry",
  "aliases": ["OTel"],
  "category": "observability",
  "maturity": "stable",
  "match_policy": "exact_case_sensitive",
  "source_url": "https://opentelemetry.io/docs/concepts/signals/",
  "verified_on": "2026-10-19"
}
```

Recommended controlled fields:

- `maturity`: `stable`, `emerging`, `legacy`, `deprecated`, `vendor-specific`, `review`;
- `match_policy`: `exact_case_sensitive`, `exact_case_insensitive`, `phrase`, `context_required`;
- `aliases`: forms that map to the same concept but must remain unchanged in source-preservation mode;
- `source_url` and `verified_on`: evidence and freshness;
- optional `notes`: short disambiguation only, not a tutorial.

Split the data by maintenance cadence, not by arbitrary file size:

1. `standards-and-protocols.json`: slow-changing standards and formal terms;
2. `platforms-and-projects.json`: Kubernetes, OpenTelemetry, OCI, data formats, language tooling;
3. `ai-and-agent-systems.json`: fast-changing model, evaluation, inference, and agent terminology;
4. `vendor-terms.json`: product and API names;
5. `legacy-and-deprecated.json`: recognized terms that must be preserved but not introduced.

Keep a generated compatibility view if runtime code still expects category arrays. Do not hand-maintain both the structured source and the flat view. [inference]

Maintenance procedure:

1. Record an official source for every new entry.
2. Verify fast-changing AI and vendor layers on a scheduled cadence or before a release that changes them.
3. Recheck a term when its official source changes status; do not equate an old verification date with automatic invalidity.
4. Test alias uniqueness, canonical uniqueness, required fields, valid status values, and URL presence.
5. Test high-risk negative examples so generic words such as `model`, `branch`, and `token` do not lock ordinary prose.
6. Preserve input spelling by default. Normalize terminology only when the user requests technical editing or modernization.

### Relation to existing constraints

This structure separates two tasks that the current skill must not conflate: humanizing style while preserving meaning, and updating technical terminology against current sources.

## Implementation outcome

The task used the compatibility step instead of converting all existing terms into records. `technical-terms.json` now keeps every pre-change term and adds policy, lifecycle, verification-date, and official-source metadata. It adds focused categories for cloud-native and observability, software supply chain, and web and application protocols. It also expands the existing data, security, software engineering, and AI categories. [measured]

The implemented file contains 614 terms in 11 categories and no exact case-insensitive duplicate groups. Vendor-specific product names remain project-local unless they already existed in the imported baseline. Technical modernization remains outside ordinary humanization; the skill preserves the input term instead of silently replacing it with a newer one. [measured], [inference]

This outcome resolves the schema choice for the current release. A future release can migrate to per-term records when alias and lifecycle automation justify the additional runtime context and maintenance cost. [inference]

## Not verified

- Every one of the 473 existing entries against an individual official source. The audit sampled structure and checked the areas most likely to have changed.
- Whether `closed-weight` has a stable cross-vendor definition. It should remain under review rather than be declared obsolete.
- Browser support or production adoption for emerging web-platform features. The recommendation concerns term preservation, not implementation readiness.
- Product-specific AI names beyond the official documentation sampled here. They belong in a separately maintained vendor layer.
- Whether the released skill has code that parses the current arrays. The requested scope was the terminology file and research note, not a package implementation change.

## Decisions for the owner

- Whether a future release should replace the compatibility schema with per-term records after runtime cost and maintenance tooling are evaluated.

## Sources

- https://platform.openai.com/docs/api-reference/debugging-requests: pinned model versions, evals, API stability, and model-output variability; opened.
- https://platform.openai.com/docs/api-reference/responses-streaming/response/mcp_call/failed: Structured Outputs, JSON Schema, prompt caching, and reasoning configuration in the API reference; opened.
- https://developers.openai.com/api/docs/guides/reasoning: reasoning models and reasoning tokens; opened by the delegated research agent.
- https://developers.openai.com/api/docs/guides/evals: eval and grader terminology; opened by the delegated research agent.
- https://huggingface.co/docs/transformers/peft: adapters, QLoRA, and tensor parallelism; opened.
- https://huggingface.co/docs/hub/gguf: GGUF and safetensors; opened.
- https://modelcontextprotocol.io/specification/2025-11-25: MCP architecture, primitives, capabilities, and transports; opened by the delegated research agent.
- https://py.sdk.modelcontextprotocol.io/v2/handlers/sampling-and-roots/: dated deprecation status of MCP sampling and roots; opened.
- https://opentelemetry.io/docs/concepts/signals/: OpenTelemetry signals; opened.
- https://opentelemetry.io/docs/specs/status/: OpenTelemetry components and lifecycle labels; opened.
- https://gateway-api.sigs.k8s.io/docs/concepts/api-overview/: Gateway API resource model and exact resource names; opened.
- https://opencontainers.org/: OCI's Image, Runtime, and Distribution specifications; opened.
- https://specs.opencontainers.org/image-spec/descriptor/?v=v1.1.1: descriptors, digests, manifests, and artifacts; opened.
- https://docs.ebpf.io/: official community eBPF documentation; opened.
- https://www.rfc-editor.org/rfc/rfc9114.html: HTTP/3 over QUIC; opened.
- https://www.w3.org/TR/webauthn-3/: WebAuthn Level 3 defined terms, including passkeys and authenticator types; opened.
- https://webassembly.org/specs/: WebAssembly, Wasm, and WASI specification map; opened.
- https://www.rfc-editor.org/rfc/rfc7636.html: PKCE, code verifier, and code challenge; opened.
- https://www.rfc-editor.org/rfc/rfc9449.html: DPoP; opened.
- https://spdx.github.io/spdx-spec/v3.0.1/: SPDX specification; opened.
- https://slsa.dev/spec/v1.2/: SLSA specification and provenance model; opened.
- https://top10.owasp.org/2025/0x00_2025-Introduction/: OWASP Top 10:2025 category names and changes; opened.
- https://csrc.nist.gov/Projects/Post-Quantum-Cryptography: NIST post-quantum cryptography project and selected algorithms; opened by the delegated research agent.
- https://iceberg.apache.org/spec/: Apache Iceberg table-format terminology and version status; opened.
- https://iceberg.apache.org/docs/latest/: Apache Iceberg capabilities and exact feature names; opened.
- https://semver.org/: Semantic Versioning 2.0.0; opened.
- https://json-schema.org/specification: JSON Schema specification and dialect version; opened.
- https://microsoft.github.io/language-server-protocol/: Language Server Protocol and JSON-RPC; opened by the delegated research agent.
- https://containers.dev/implementors/spec/: Dev Container Specification; opened by the delegated research agent.
- https://reproducible-builds.org/docs/definition/: reproducible-build terminology; opened by the delegated research agent.
- https://bazel.build/basics/hermeticity: hermetic-build terminology; opened by the delegated research agent.
