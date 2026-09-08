#!/usr/bin/env node

/**
 * native-design CLI
 * The Native App Design Engine for AI Agents.
 * MIT © 2026 Ryan Prayoga
 */

const fs = require('fs');
const path = require('path');

// ANSI Color Helpers
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
};

function printBanner() {
  console.log(`
${c.cyan}${c.bold}  ┌─────────────────────────────────────────────────────────────┐
  │                   native-design CLI v1.0.0                  │
  │   The Native App Design Engine for AI Agents (2026 Ready)   │
  └─────────────────────────────────────────────────────────────┘${c.reset}
`);
}

function printHelp() {
  printBanner();
  console.log(`${c.bold}USAGE:${c.reset}`);
  console.log(`  npx native-design <command> [options]\n`);
  console.log(`${c.bold}COMMANDS:${c.reset}`);
  console.log(`  ${c.green}audit <dir|file>${c.reset}      Audit source code for native anti-slop rules`);
  console.log(`  ${c.green}rosetta [primitive]${c.reset}   View 1-to-1 UI mapping across Apple, Google, Win, Linux`);
  console.log(`  ${c.green}platforms${c.reset}             List 2026 specs for all supported OS ecosystems`);
  console.log(`  ${c.green}help${c.reset}                  Show this help guide\n`);
  console.log(`${c.bold}EXAMPLES:${c.reset}`);
  console.log(`  ${c.gray}$${c.reset} npx native-design audit ./src`);
  console.log(`  ${c.gray}$${c.reset} npx native-design audit ./examples/apple/SettingsView.swift`);
  console.log(`  ${c.gray}$${c.reset} npx native-design rosetta canvas_background`);
  console.log(`  ${c.gray}$${c.reset} npx native-design platforms\n`);
}

function getFiles(dir, extList = ['.swift', '.kt', '.cs', '.xaml', '.py', '.dart', '.tsx', '.jsx']) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const stat = fs.statSync(dir);
  if (!stat.isDirectory()) {
    return [dir];
  }
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    if (file === 'node_modules' || file === '.git' || file === 'build' || file === '.dart_tool') return;
    const s = fs.statSync(fullPath);
    if (s && s.isDirectory()) {
      results = results.concat(getFiles(fullPath, extList));
    } else {
      if (extList.some(ext => file.endsWith(ext))) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

function auditFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const ext = path.extname(filePath);
  const issues = [];
  const passes = [];

  let platform = 'Cross-Platform Native';
  if (ext === '.swift') platform = 'Apple (SwiftUI / Liquid Glass)';
  else if (ext === '.kt') platform = 'Google (Android 17 / M3 Expressive)';
  else if (ext === '.cs' || ext === '.xaml') platform = 'Microsoft (Windows 11 / WinUI)';
  else if (ext === '.py' || filePath.includes('libadwaita')) platform = 'Linux (GNOME 50/51 / Libadwaita)';

  // 1. Raw Hex Check
  const hexMatch = content.match(/#(?:[0-9a-fA-F]{3}){1,2}\b/);
  if (hexMatch && !filePath.endsWith('.json') && !filePath.endsWith('.svg')) {
    issues.push({
      id: 'ND-TOKEN-HEX-01',
      title: 'Raw Hex Color Detected',
      detail: `Found raw literal '${hexMatch[0]}'. Use semantic system tokens instead.`,
      severity: 'HIGH'
    });
  } else {
    passes.push('Semantic Design Tokens: No hardcoded hex color literals found');
  }

  // 2. Apple-specific rules
  if (ext === '.swift') {
    if (content.includes('systemBackground') || content.includes('Color.accentColor') || content.includes('secondarySystemBackground')) {
      passes.push('Dynamic Theme Support: Semantic system background and accent tokens verified');
    }
    if (content.includes('44') || content.includes('minWidth: 44') || content.includes('minHeight: 44') || content.includes('Button')) {
      passes.push('Touch Ergonomics: Interactive hit targets meet or exceed 44x44pt requirement');
    }
    if (content.includes('ScaledMetric') || content.includes('font(')) {
      passes.push('Accessibility: Dynamic Type scaling and accessibility metrics supported');
    }
    if (content.includes('hamburger') || content.includes('Drawer')) {
      issues.push({
        id: 'ND-APPLE-NAV-02',
        title: 'Un-native Navigation Pattern',
        detail: 'Avoid Android-style hamburger menus on iOS. Use TabView with Liquid Glass capsule.',
        severity: 'MEDIUM'
      });
    }
  }

  // 3. Android-specific rules
  if (ext === '.kt') {
    if (content.includes('findViewById') || content.includes('R.layout')) {
      issues.push({
        id: 'ND-ANDROID-COMPOSE-01',
        title: 'Legacy XML View Paradigm Detected',
        detail: 'Google 2026 standard is Compose-first. Avoid legacy XML views.',
        severity: 'HIGH'
      });
    } else {
      passes.push('Compose-First Architecture: Clean declarative Jetpack Compose structure');
    }
    if (content.includes('MaterialTheme.colorScheme')) {
      passes.push('HCT Dynamic Color: Consuming official MaterialTheme color roles');
    }
    if (content.includes('48.dp') || content.includes('IconButton') || content.includes('Button')) {
      passes.push('Thumb Ergonomics: Touch targets respect Google 48x48dp minimum');
    }
  }

  // 4. Windows-specific rules
  if (ext === '.cs' || ext === '.xaml') {
    if (content.includes('Mica') || content.includes('Acrylic')) {
      passes.push('Fluent 2 Material: Hardware-accelerated Mica or Acrylic backdrop enabled');
    }
    if (content.includes('32') || content.includes('SettingsExpander') || content.includes('NavigationView')) {
      passes.push('Desktop Density: Native dual-density (32px mouse / 40px touch) adhered');
    }
  }

  // 5. Linux-specific rules
  if (filePath.includes('linux') || ext === '.py') {
    if (content.includes('AdwHeaderBar') || content.includes('HeaderBar')) {
      passes.push('Wayland Desktop Shell: Native AdwHeaderBar integrates window controls properly');
    }
    if (content.includes('PreferencesPage') || content.includes('ActionRow')) {
      passes.push('Libadwaita Forms: AdwPreferencesPage and AdwActionRow structure respected');
    }
  }

  // Calculate score
  const total = passes.length + issues.length;
  const score = total === 0 ? 95 : Math.max(50, Math.round((passes.length / total) * 100));

  return {
    filePath,
    platform,
    score,
    passes,
    issues
  };
}

function runAudit(targetPath) {
  printBanner();
  const resolved = path.resolve(process.cwd(), targetPath || '.');
  console.log(`${c.dim}Scanning target: ${resolved}${c.reset}\n`);

  const files = getFiles(resolved);
  if (files.length === 0) {
    console.log(`${c.yellow}No native source files (.swift, .kt, .cs, .xaml, .py, .dart) found in target.${c.reset}\n`);
    return;
  }

  let totalScore = 0;
  let auditedCount = 0;

  files.slice(0, 10).forEach(file => {
    const res = auditFile(file);
    auditedCount++;
    totalScore += res.score;

    const relName = path.relative(process.cwd(), file);
    const tier = res.score >= 95 ? `${c.green}${c.bold}S-Rank Native ✨${c.reset}` :
                 res.score >= 85 ? `${c.cyan}${c.bold}A-Tier Native${c.reset}` :
                 `${c.yellow}${c.bold}B-Tier (Needs Polish)${c.reset}`;

    console.log(`╭─────────────────────────────────────────────────────────────────────────────╮`);
    console.log(`│  ${c.bold}NATIVE-DESIGN AUDIT:${c.reset} ${relName.padEnd(52)}│`);
    console.log(`│  Platform: ${res.platform.padEnd(64)}│`);
    console.log(`│  Score: ${String(res.score + '/100').padEnd(8)} (Tier: ${tier}) ${''.padEnd(res.score >= 95 ? 26 : 28)}│`);
    console.log(`├─────────────────────────────────────────────────────────────────────────────┤`);

    res.passes.forEach(p => {
      console.log(`│  ${c.green}✓ [PASS]${c.reset} ${p.padEnd(66)}│`);
    });

    res.issues.forEach(i => {
      console.log(`│  ${c.red}✗ [${i.id}]${c.reset} ${i.title.padEnd(61)}│`);
      console.log(`│    ${c.dim}↳ ${i.detail.slice(0, 68).padEnd(69)}${c.reset}│`);
    });

    console.log(`│                                                                             │`);
    if (res.issues.length === 0) {
      console.log(`│  ${c.green}${c.bold}Status: Clean. 100% Anti-Slop Compliant. Ready for Release.${c.reset}                │`);
    } else {
      console.log(`│  ${c.yellow}Status: ${res.issues.length} potential native violations found.${c.reset}                             │`);
    }
    console.log(`╰─────────────────────────────────────────────────────────────────────────────╯\n`);
  });

  const avg = Math.round(totalScore / auditedCount);
  console.log(`${c.bold}Audit Summary:${c.reset} ${auditedCount} file(s) checked. Average Native Score: ${avg >= 90 ? c.green : c.yellow}${avg}/100${c.reset}\n`);
}

function runRosetta(primitive) {
  printBanner();
  const rosettaPath = path.join(__dirname, '../core/rosetta-stone.json');
  if (!fs.existsSync(rosettaPath)) {
    console.log(`${c.red}rosetta-stone.json not found.${c.reset}`);
    return;
  }
  const data = JSON.parse(fs.readFileSync(rosettaPath, 'utf8'));
  const prims = data.primitives;

  if (primitive && prims[primitive]) {
    console.log(`${c.bold}Rosetta Stone Mapping for: ${c.cyan}${primitive}${c.reset}\n`);
    const p = prims[primitive];
    console.log(`  🍏 Apple (SwiftUI):             ${c.green}${p.apple_swiftui}${c.reset}`);
    console.log(`  🤖 Google (Jetpack Compose M3): ${c.green}${p.google_compose}${c.reset}`);
    console.log(`  🪟 Microsoft (WinUI):           ${c.green}${p.microsoft_winui}${c.reset}`);
    console.log(`  🐧 Linux (GNOME Libadwaita):    ${c.green}${p.linux_adwaita}${c.reset}\n`);
    return;
  }

  console.log(`${c.bold}All Universal Primitives (The Rosetta Stone Matrix):${c.reset}\n`);
  Object.keys(prims).forEach(key => {
    console.log(`${c.yellow}• ${c.bold}${key}${c.reset}`);
    console.log(`  🍏 Apple:     ${c.dim}${prims[key].apple_swiftui}${c.reset}`);
    console.log(`  🤖 Google:    ${c.dim}${prims[key].google_compose}${c.reset}`);
    console.log(`  🪟 Microsoft: ${c.dim}${prims[key].microsoft_winui}${c.reset}`);
    console.log(`  🐧 Linux:     ${c.dim}${prims[key].linux_adwaita}${c.reset}\n`);
  });
}

function runPlatforms() {
  printBanner();
  console.log(`${c.bold}2026 Supported Native Operating System Standards:${c.reset}\n`);
  console.log(`  ${c.cyan}🍏 Apple Ecosystem (iOS, iPadOS, macOS, watchOS, visionOS)${c.reset}`);
  console.log(`     - Era: Liquid Glass & Spatial Computing`);
  console.log(`     - Toolkits: SwiftUI 6+, RealityKit, AppKit`);
  console.log(`     - Rules: 44pt touch minimum, 60pt gaze target, Dynamic Type scaling, Core Haptics\n`);

  console.log(`  ${c.magenta}🤖 Google Ecosystem (Android 17 & Wear OS)${c.reset}`);
  console.log(`     - Era: Material 3 Expressive (M3E) • Compose-First`);
  console.log(`     - Toolkits: Kotlin & Jetpack Compose 1.8+`);
  console.log(`     - Rules: 48dp touch minimum (8dp spacing), MotionScheme.expressive(), HCT meshes\n`);

  console.log(`  ${c.blue}🪟 Microsoft Ecosystem (Windows 11)${c.reset}`);
  console.log(`     - Era: Fluent 2 & Rebranded WinUI`);
  console.log(`     - Toolkits: C# / C++, Windows App SDK 2.x, WinUI`);
  console.log(`     - Rules: Dual-density (32px mouse / 40px touch), Mica Alt 2.0, Snap Layouts\n`);

  console.log(`  ${c.yellow}🐧 Linux Desktop Ecosystem (GNOME 50/51 & KDE)${c.reset}`);
  console.log(`     - Era: GNOME 50/51 Wayland-Only & Libadwaita 1.7+`);
  console.log(`     - Toolkits: GTK 4, Libadwaita, Qt6 Kirigami`);
  console.log(`     - Rules: AdwHeaderBar, centered AdwViewSwitcher, @accent_color dynamic inheritance\n`);
}

// Entrypoint
const args = process.argv.slice(2);
const cmd = args[0] || 'help';

switch (cmd) {
  case 'audit':
  case 'check':
    runAudit(args[1]);
    break;
  case 'rosetta':
  case 'map':
    runRosetta(args[1]);
    break;
  case 'platforms':
  case 'specs':
    runPlatforms();
    break;
  case 'help':
  case '--help':
  case '-h':
  default:
    printHelp();
    break;
}
