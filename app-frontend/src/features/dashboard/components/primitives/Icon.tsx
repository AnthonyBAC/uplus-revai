import {
  BarChart2, Star, TrendingUp, Eye, Home, Bell, Search, ChevronRight,
  ChevronDown, Plus, Check, X, ArrowRight, Flag, Clock, User, MessageCircle,
  Filter, Sparkles, Zap, Play, MoreHorizontal, Calendar, Settings, Pin,
  Download, RefreshCw, File,
} from 'lucide-react';

const ICON_MAP = {
  bar:         BarChart2,
  star:        Star,
  trend:       TrendingUp,
  eye:         Eye,
  home:        Home,
  bell:        Bell,
  search:      Search,
  chevron:     ChevronRight,
  chevronDown: ChevronDown,
  plus:        Plus,
  check:       Check,
  x:           X,
  arrow:       ArrowRight,
  flag:        Flag,
  clock:       Clock,
  user:        User,
  msg:         MessageCircle,
  filter:      Filter,
  sparkle:     Sparkles,
  spark:       Zap,
  play:        Play,
  dots:        MoreHorizontal,
  cal:         Calendar,
  settings:    Settings,
  pin:         Pin,
  download:    Download,
  refresh:     RefreshCw,
  file:        File,
} as const;

export type IconName = keyof typeof ICON_MAP;

interface IconProps {
  name: IconName;
  size?: number;
  stroke?: number;
  style?: React.CSSProperties;
  className?: string;
}

export default function Icon({ name, size = 18, stroke = 1.6, style, className }: IconProps) {
  const Component = ICON_MAP[name];
  if (!Component) return null;
  return <Component size={size} strokeWidth={stroke} style={style} className={className} />;
}
