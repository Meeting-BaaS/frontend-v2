import { type MeetingPlatform, meetingPlatformSchema } from "./schemas/bots";

export const PLATFORMS = meetingPlatformSchema.options.map((platform) => ({
  value: platform,
  label: platform.charAt(0).toUpperCase() + platform.slice(1),
}));

export const ALL_PLATFORMS = meetingPlatformSchema.options;

// Platform color mapping using CSS variables from globals.css
export const getPlatformColor = (platform: MeetingPlatform): string => {
  switch (platform) {
    case "zoom":
      return "text-zoom-blue fill-zoom-blue";
    case "teams":
      return "text-teams-purple fill-teams-purple";
    case "meet":
      return "text-google-meet-green fill-google-meet-green";
    default:
      return "text-muted-foreground fill-muted-foreground";
  }
};
