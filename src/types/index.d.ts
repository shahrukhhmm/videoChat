/* eslint-disable @typescript-eslint/no-explicit-any */
declare interface Country {
  name: {
    common: string;
  };
  flags?: {
    png: string;
    svg: string;
  };
  languages?: {
    [key: string]: string;
  };
}
declare module "framer-motion";
declare module "axios";

declare interface Route {
  index?: boolean;
  path: string;
  element: React.ReactElement;
  name: string;
}

declare interface BottomBarProps {
  onToggleAudio: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onToggleVideo: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onScreenShare: () => void;
  onToggleChat: (e: any) => void;
  screenShare: boolean;
  shareVideo: boolean;
  shareAudio: boolean;
  roomId?: any;
  videoDevices: MediaDeviceInfo[];
  onVideoDeviceChange: (deviceId: string) => void;
}

// declare interface VideoCardProps {
//   src?: string;
//   type?: string;
//   key?: any;
//   peer?: any;
//   shareVideo?: boolean;
//   shareAudio?: boolean;
//   userName?: string;
//   videoRef?: RefObject<HTMLVideoElement>;
// }

declare interface Message {
  sender: string;
  msg: string;
}

declare interface AudioMessage {
  sender: string;
  audioUrl: string;
}
