import SwiftUI

/// SettingsView.swift
/// native-design: Apple Ecosystem (Liquid Glass & SwiftUI 6+ Era)
/// Demonstrates 44pt hit targets, semantic tokens, dynamic typography, and liquid glass capsules.

struct SettingsView: View {
    @State private var enableHaptics = true
    @State private var spatialAudio = true
    @ScaledMetric(relativeTo: .body) private var iconSize: CGFloat = 22
    
    var body: some View {
        NavigationStack {
            ZStack {
                // Semantic Canvas Background
                Color(uiColor: .systemGroupedBackground)
                    .ignoresSafeArea()
                
                ScrollView {
                    VStack(spacing: 24) {
                        // Profile Section with Liquid Glass Pill Card
                        VStack(spacing: 12) {
                            Image(systemName: "person.crop.circle.fill")
                                .resizable()
                                .aspectRatio(contentMode: .fit)
                                .frame(width: 72, height: 72)
                                .foregroundStyle(Color.accentColor)
                            
                            Text("Ryan Prayoga")
                                .font(.system(.title2, design: .default, weight: .bold))
                                .foregroundStyle(Color.primary)
                            
                            Text("ryan@prayoga.dev")
                                .font(.subheadline)
                                .foregroundStyle(Color.secondary)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 24)
                        .background {
                            RoundedRectangle(cornerRadius: 20, style: .continuous)
                                .fill(.ultraThinMaterial)
                                .overlay {
                                    // Specular edge highlight (Liquid Glass rim)
                                    RoundedRectangle(cornerRadius: 20, style: .continuous)
                                        .strokeBorder(Color.white.opacity(0.18), lineWidth: 1)
                                }
                        }
                        .padding(.horizontal, 16)
                        
                        // Settings Inset Grouped Section
                        VStack(spacing: 0) {
                            ToggleRow(
                                title: "Haptic Feedback",
                                subtitle: "Play tactile pulses on interactions",
                                icon: "waveform",
                                isOn: $enableHaptics
                            )
                            
                            Divider()
                                .padding(.leading, 56)
                            
                            ToggleRow(
                                title: "Spatial Audio",
                                subtitle: "Dynamic head-tracking soundscape",
                                icon: "headphones",
                                isOn: $spatialAudio
                            )
                        }
                        .background {
                            RoundedRectangle(cornerRadius: 16, style: .continuous)
                                .fill(Color(uiColor: .secondarySystemGroupedBackground))
                        }
                        .padding(.horizontal, 16)
                        
                        // Sign Out Button (Strict 44pt Minimum Hit Target)
                        Button(role: .destructive) {
                            triggerHaptic()
                        } label: {
                            Text("Sign Out")
                                .font(.system(.body, weight: .semibold))
                                .frame(maxWidth: .infinity)
                                .frame(minHeight: 44) // 44pt Touch Target Guarantee
                                .contentShape(Rectangle())
                        }
                        .buttonStyle(.borderedProminent)
                        .tint(Color.red)
                        .padding(.horizontal, 16)
                    }
                    .padding(.top, 16)
                }
            }
            .navigationTitle("Preferences")
            .navigationBarTitleDisplayMode(.large)
        }
    }
    
    private func triggerHaptic() {
        if enableHaptics {
            let generator = UIImpactFeedbackGenerator(style: .medium)
            generator.impactOccurred()
        }
    }
}

private struct ToggleRow: View {
    let title: String
    let subtitle: String
    let icon: String
    @Binding var isOn: Bool
    
    var body: some View {
        HStack(spacing: 16) {
            Image(systemName: icon)
                .font(.system(size: 18, weight: .medium))
                .foregroundStyle(Color.accentColor)
                .frame(width: 28, height: 28)
            
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.body)
                    .foregroundStyle(Color.primary)
                Text(subtitle)
                    .font(.caption)
                    .foregroundStyle(Color.secondary)
            }
            
            Spacer()
            
            Toggle("", isOn: $isOn)
                .labelsHidden()
        }
        .padding(.horizontal, 16)
        .frame(minHeight: 56) // Ergonomic thumb zone
    }
}
