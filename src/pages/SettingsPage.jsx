import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [settings, setSettings] = useState(null);
  const [settingsId, setSettingsId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const defaults = {
    dark_mode: false,
    flip_speed: "normal",
    cards_per_session: 10,
    show_progress_bar: true,
    auto_advance: false,
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const existing = await base44.entities.UserSettings.list();
      if (existing.length > 0) {
        setSettings(existing[0]);
        setSettingsId(existing[0].id);
      } else {
        setSettings(defaults);
      }
    } catch (e) {
      setSettings(defaults);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (settingsId) {
        await base44.entities.UserSettings.update(settingsId, settings);
      } else {
        const created = await base44.entities.UserSettings.create(settings);
        setSettingsId(created.id);
      }
      toast({ title: "Settings saved!" });
    } catch (e) {
      toast({ title: "Failed to save settings", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => navigate("/")}>
            <ArrowLeft size={18} />
          </Button>
          <h1 className="font-bold text-lg flex-1">Settings</h1>
          <Button size="sm" className="rounded-xl" onClick={handleSave} disabled={saving}>
            <Save size={14} className="mr-1" /> {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Study Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border rounded-2xl p-5 space-y-5"
        >
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
            Study Preferences
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Card Flip Speed</Label>
              <p className="text-xs text-muted-foreground mt-0.5">How fast the card flips</p>
            </div>
            <Select
              value={settings.flip_speed}
              onValueChange={v => setSettings(s => ({ ...s, flip_speed: v }))}
            >
              <SelectTrigger className="w-28 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="slow">Slow</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="fast">Fast</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Cards Per Session</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Maximum cards in one study session</p>
              </div>
              <span className="text-sm font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
                {settings.cards_per_session}
              </span>
            </div>
            <Slider
              value={[settings.cards_per_session]}
              onValueChange={([v]) => setSettings(s => ({ ...s, cards_per_session: v }))}
              min={5}
              max={50}
              step={5}
              className="mt-2"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Auto-Advance</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Automatically go to next card</p>
            </div>
            <Switch
              checked={settings.auto_advance}
              onCheckedChange={v => setSettings(s => ({ ...s, auto_advance: v }))}
            />
          </div>
        </motion.div>

        {/* Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border rounded-2xl p-5 space-y-5"
        >
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
            Display
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Show Progress Bar</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Display progress on folder cards</p>
            </div>
            <Switch
              checked={settings.show_progress_bar}
              onCheckedChange={v => setSettings(s => ({ ...s, show_progress_bar: v }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Dark Mode</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Use dark color scheme</p>
            </div>
            <Switch
              checked={settings.dark_mode}
              onCheckedChange={v => setSettings(s => ({ ...s, dark_mode: v }))}
            />
          </div>
        </motion.div>

        {/* Account */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border rounded-2xl p-5 space-y-4"
        >
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
            Account
          </h3>
          <Button
            variant="destructive"
            className="w-full rounded-xl"
            onClick={() => base44.auth.logout("/")}
          >
            Sign Out
          </Button>
        </motion.div>
      </div>
    </div>
  );
}