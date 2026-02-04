import { GoogleMeetLogo } from "@/components/icons/google-meet";
import { MicrosoftTeamsLogo } from "@/components/icons/microsoft-teams";
import { ZoomLogo } from "@/components/icons/zoom";

export const platformLinks = [
  {
    name: "Zoom",
    url: "https://zoom.us/meeting",
    icon: ZoomLogo,
    color: "hover:bg-zoom-blue/10",
  },
  {
    name: "Google Meet",
    url: "https://meet.google.com/new",
    icon: GoogleMeetLogo,
    color: "hover:bg-google-meet-green/10",
  },
  {
    name: "Microsoft Teams",
    url: "https://teams.microsoft.com",
    icon: MicrosoftTeamsLogo,
    color: "hover:bg-teams-purple/10",
  },
];
