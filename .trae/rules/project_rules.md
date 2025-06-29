1. When answering questions or generating code, always prioritize information
   found in the `README.md` file located at the project root. This file should
   be the primary source of truth for project context and guidelines.
2. Project use Biome for code formatting and linting.
3. Every api endpoint should be covered with integration tests.
4. For code comments: Do not add comments for obvious or self-explanatory code.
   ✘ Avoid repeating what the code already clearly expresses. ✅ Only add
   comments when the logic is non-obvious, subtle, or error-prone. Use English
   only. Keep comments short (1–2 lines max) and only when truly helpful. If
   unsure whether a comment is needed — omit it. Less is more. 5. Prefer
   functional programming principles: use pure functions, immutability, and
   composition where possible.

- Avoid using classes unless they provide clear and significant benefits (e.g.,
  managing complex state or leveraging inheritance).
- Stick to simple, composable functions as the default approach.
