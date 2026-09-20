// Centralised SVG icon set — strokeWidth 1.75, 18×18 by default
type IconProps = { size?: number; className?: string; stroke?: string };
const S = ({ size = 18, className = "", stroke = "currentColor", children }: IconProps & { children: React.ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {children}
  </svg>
);

export const IcHome = (p: IconProps) => <S {...p}><path d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H15.75a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H3.75A.75.75 0 013 21V9.75z" /></S>;
export const IcSearch = (p: IconProps) => <S {...p}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></S>;
export const IcFile = (p: IconProps) => <S {...p}><path d="M14.25 2.25H6.75a1.5 1.5 0 00-1.5 1.5v16.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V8.25L14.25 2.25z" /><path d="M14.25 2.25V8.25h6" /><path d="M9 13h6M9 16.5h4.5" /></S>;
export const IcFolder = (p: IconProps) => <S {...p}><path d="M2.25 12.75V7.5A2.25 2.25 0 014.5 5.25h4.19l2.06-2.25H19.5A2.25 2.25 0 0121.75 5.25v7.5A2.25 2.25 0 0119.5 15H4.5A2.25 2.25 0 012.25 12.75zM2.25 12.75V17.25A2.25 2.25 0 004.5 19.5h15a2.25 2.25 0 002.25-2.25V12.75" /></S>;
export const IcShield = (p: IconProps) => <S {...p}><path d="M12 2.25l8.25 3v5.625C20.25 16.088 16.725 20.7 12 21.75 7.275 20.7 3.75 16.088 3.75 10.875V5.25L12 2.25z" /><path d="M8.25 12l2.25 2.25 4.5-4.5" /></S>;
export const IcBell = (p: IconProps) => <S {...p}><path d="M15 17.25A3 3 0 019 17.25m9.75-2.25H5.25c.75-1.5 1.5-3 1.5-5.25A5.25 5.25 0 0112 4.5a5.25 5.25 0 015.25 5.25c0 2.25.75 3.75 1.5 5.25z" /></S>;
export const IcHelp = (p: IconProps) => <S {...p}><circle cx="12" cy="12" r="9.75" /><path d="M9.75 9.75a2.25 2.25 0 014.38.75c0 1.5-2.25 2.25-2.25 2.25M12 16.5h.008" /></S>;
export const IcSettings = (p: IconProps) => <S {...p}><path d="M10.325 4.317a1.724 1.724 0 002.35 0l.518-.518a1.724 1.724 0 012.828.672l.224.806a1.724 1.724 0 001.663 1.224h.838a1.724 1.724 0 011.224 2.828l-.518.518a1.724 1.724 0 000 2.35l.518.518a1.724 1.724 0 01-.672 2.828l-.806.224a1.724 1.724 0 00-1.224 1.663v.838a1.724 1.724 0 01-2.828 1.224l-.518-.518a1.724 1.724 0 00-2.35 0l-.518.518a1.724 1.724 0 01-2.828-.672l-.224-.806A1.724 1.724 0 004.2 17.1h-.838A1.724 1.724 0 012.138 14.27l.518-.518a1.724 1.724 0 000-2.35l-.518-.518A1.724 1.724 0 012.81 7.956l.806-.224A1.724 1.724 0 004.84 6.069V5.23a1.724 1.724 0 012.828-1.224l.518.518z" /><circle cx="12" cy="12" r="2.25" /></S>;
export const IcUser = (p: IconProps) => <S {...p}><circle cx="12" cy="8.25" r="3.75" /><path d="M3.75 20.25a8.25 8.25 0 0116.5 0" /></S>;
export const IcLogout = (p: IconProps) => <S {...p}><path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></S>;
export const IcGrid = (p: IconProps) => <S {...p}><rect x="3" y="3" width="7.5" height="7.5" rx="1" /><rect x="13.5" y="3" width="7.5" height="7.5" rx="1" /><rect x="3" y="13.5" width="7.5" height="7.5" rx="1" /><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1" /></S>;
export const IcGlobe = (p: IconProps) => <S {...p}><circle cx="12" cy="12" r="9.75" /><path d="M2.25 12h19.5M12 2.25c-2.7 3-4.5 6.15-4.5 9.75s1.8 6.75 4.5 9.75M12 2.25c2.7 3 4.5 6.15 4.5 9.75s-1.8 6.75-4.5 9.75" /></S>;
export const IcChevronRight = (p: IconProps) => <S {...p}><path d="M8.25 4.5l7.5 7.5-7.5 7.5" /></S>;
export const IcChevronDown = (p: IconProps) => <S {...p}><path d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></S>;
export const IcArrowRight = (p: IconProps) => <S {...p}><path d="M4.5 12h15M13.5 6l6 6-6 6" /></S>;
export const IcCheck = (p: IconProps) => <S {...p}><path d="M4.5 12.75l6 6 9-13.5" /></S>;
export const IcMenu = (p: IconProps) => <S {...p}><path d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" /></S>;
export const IcX = (p: IconProps) => <S {...p}><path d="M6 18L18 6M6 6l12 12" /></S>;
export const IcStar = (p: IconProps) => <S {...p}><path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></S>;
export const IcSparkle = (p: IconProps) => <S {...p}><path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" /></S>;
export const IcExternalLink = (p: IconProps) => <S {...p}><path d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5M13.5 6l7.5-3M13.5 6l3 7.5" /><path d="M21 3l-7.5 3M21 3v5.25M21 3h-5.25" /></S>;
export const IcFilter = (p: IconProps) => <S {...p}><path d="M3 4.5h18M6 9h12M9.75 13.5h4.5M11.25 18h1.5" /></S>;
export const IcClock = (p: IconProps) => <S {...p}><circle cx="12" cy="12" r="9.75" /><path d="M12 7.5V12l3 2.25" /></S>;
export const IcInfo = (p: IconProps) => <S {...p}><circle cx="12" cy="12" r="9.75" /><path d="M12 8.25v.008M12 11.25v4.5" /></S>;
export const IcPlus = (p: IconProps) => <S {...p}><path d="M12 4.5v15M4.5 12h15" /></S>;
export const IcMic = (p: IconProps) => <S {...p}><path d="M12 2.25a3.75 3.75 0 013.75 3.75v4.5a3.75 3.75 0 01-7.5 0V6A3.75 3.75 0 0112 2.25z" /><path d="M19.5 10.5a7.5 7.5 0 01-15 0M12 18v3.75M9.75 21.75h4.5" /></S>;
export const IcDownload = (p: IconProps) => <S {...p}><path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12M12 16.5V3" /></S>;
export const IcEye = (p: IconProps) => <S {...p}><path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><circle cx="12" cy="12" r="3" /></S>;
export const IcLock = (p: IconProps) => <S {...p}><path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></S>;
export const IcActivity = (p: IconProps) => <S {...p}><path d="M3 12h3.75l2.25-6.75 4.5 13.5 2.25-6.75H21" /></S>;
