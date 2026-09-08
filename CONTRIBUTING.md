# Contributing to native-design

Thank you for your interest in contributing to **`native-design`**!

Our mission is to eliminate generic "AI slop" and web-wrapper antipatterns from AI-generated native software, providing a unified, authentic standard for Apple, Google, Microsoft, and Linux desktop environments.

---

## The Native-First Philosophy

Every contribution must respect the native idioms of the target platform:

1. **Zero Web-Wrapper Bias:** Do not suggest CSS-like solutions, div-soup layouts, or generic cross-platform approximations where a platform provides a dedicated native widget.
2. **Authentic 2026 Standards:**
   - Apple: Liquid Glass, SwiftUI 6+, RealityKit, Camera Control.
   - Google: Android 17, Jetpack Compose, Material 3 Expressive.
   - Microsoft: Windows 11, WinUI, Mica Alt 2.0, dual-density spacing.
   - Linux: GNOME 50/51, Libadwaita 1.7+, Wayland-only conventions.
3. **Deterministic Rules:** Every rule must be testable with an explicit PASS/FAIL condition and verifiable rule ID.

---

## How to Contribute

### 1. Proposing a New Rule or Token
- Place platform-specific tokens in `platforms/<platform>/tokens.json`.
- Add deterministic rule definitions with clear IDs (e.g., `ND-APPLE-GLASS-01`, `ND-M3E-SPRING-02`).
- Include both an invalid snippet (the "AI Slop") and the verified native fix.

### 2. Adding Framework Adapters
- If you specialize in cross-platform native bridges (Flutter, React Native New Architecture, Compose Multiplatform), help us refine the `adapters/` directory to ensure each framework outputs genuine native widgets on each target OS.

---

## Pull Request Guidelines

1. Fork the repository and create your branch from `main`.
2. Ensure all documentation and code comments are written in clear, professional English.
3. Verify that code snippets compile against stable 2026 SDKs.
4. Submit your pull request with a descriptive title and context.

Thank you for upholding true native craftsmanship!
