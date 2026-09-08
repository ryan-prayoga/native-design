#!/usr/bin/env python3
"""
preferences_dialog.py
native-design: Linux Desktop Ecosystem (GNOME 50/51 & Libadwaita 1.7 Era)
Demonstrates Wayland-only compliance, AdwHeaderBar, AdwPreferencesPage,
AdwActionRow, and dynamic system accent color integration.
"""

import sys
import gi

gi.require_version('Gtk', '4.0')
gi.require_version('Adw', '1')
from gi.repository import Gtk, Adw, Gio


class PreferencesWindow(Adw.PreferencesWindow):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.set_title("Preferences")
        self.set_default_size(680, 520)

        # 1. Main Preferences Page
        page = Adw.PreferencesPage()
        page.set_title("General")
        page.set_icon_name("preferences-other-symbolic")

        # 2. Account Profile Group
        account_group = Adw.PreferencesGroup()
        account_group.set_title("Account")
        account_group.set_description("Manage your GNOME local session")

        profile_row = Adw.ActionRow()
        profile_row.set_title("Ryan Prayoga")
        profile_row.set_subtitle("GNOME 50/51 Wayland Verified")
        
        avatar = Adw.Avatar()
        avatar.set_text("Ryan Prayoga")
        avatar.set_size(44)
        avatar.set_show_initials(True)
        profile_row.add_prefix(avatar)

        account_group.add(profile_row)
        page.add(account_group)

        # 3. System Preferences Group
        system_group = Adw.PreferencesGroup()
        system_group.set_title("Desktop Integration")
        system_group.set_description("Wayland-native compositor features")

        # Row 1: Global Accent Colors
        accent_row = Adw.SwitchRow()
        accent_row.set_title("Inherit Global Accent Color")
        accent_row.set_subtitle("Adapt UI dynamically to GNOME system palette")
        accent_row.set_active(True)
        system_group.add(accent_row)

        # Row 2: Variable Refresh Rate
        vrr_row = Adw.SwitchRow()
        vrr_row.set_title("Variable Refresh Rate (VRR)")
        vrr_row.set_subtitle("Enable smooth 120Hz Wayland buffer presentation")
        vrr_row.set_active(True)
        system_group.add(vrr_row)

        page.add(system_group)

        # 4. Destructive Action Group
        auth_group = Adw.PreferencesGroup()
        logout_row = Adw.ActionRow()
        logout_row.set_title("Session")

        logout_button = Gtk.Button(label="Log Out")
        logout_button.add_css_class("destructive-action")
        logout_button.set_valign(Gtk.Align.CENTER)
        logout_row.add_suffix(logout_button)

        auth_group.add(logout_row)
        page.add(auth_group)

        self.add(page)


class NativeDesignApp(Adw.Application):
    def __init__(self):
        super().__init__(
            application_id="dev.prayoga.NativeDesign",
            flags=Gio.ApplicationFlags.FLAGS_NONE
        )

    def do_activate(self):
        win = PreferencesWindow(application=self)
        win.present()


if __name__ == "__main__":
    app = NativeDesignApp()
    sys.exit(app.run(sys.argv))
