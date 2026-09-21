import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  ArrowRight,
  ChevronRight,
  CircleHelp,
  Expand,
  Headphones,
  Menu,
  Pause,
  Play,
  Radio,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();
const PROMO_KEY = 'banglarDarpanPromoDismissed';

type Channel = {
  number: string;
  label: string;
  id: string;
};

const channels: Channel[] = [
  { number: 'LIVE 01', label: 'Banglar Darpan News Stream 1', id: 'gYXaPTDatis' },
  { number: 'LIVE 02', label: 'Banglar Darpan News Stream 2', id: 'TbPVHEx_EM4' },
  { number: 'LIVE 03', label: 'Banglar Darpan News Stream 3', id: 'pHuwAwJdsdY' },
  { number: 'LIVE 04', label: 'Banglar Darpan News Stream 4', id: 'j9SqI_JZ8qI' },
  { number: 'LIVE 05', label: 'Banglar Darpan News Stream 5', id: 'WuyDaw5colo' },
  { number: 'LIVE 06', label: 'Banglar Darpan News Stream 6', id: 'jdjRIbYAA3g' },
];

function LogoMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3" data-testid="brand-logo">
      <svg
        className="bd-brand-mark h-10 w-10 shrink-0"
        viewBox="0 0 48 48"
        aria-label="Banglar Darpan mark"
        role="img"
      >
        <path d="M24 3 42 9.5v12.8c0 11.4-7.3 18.3-18 22.7C13.3 40.6 6 33.7 6 22.3V9.5L24 3Z" fill="#d9a957" />
        <path d="M24 8.4 36.5 13v9.2c0 7.8-4.5 13-12.5 16.8-8-3.8-12.5-9-12.5-16.8V13L24 8.4Z" fill="#111923" />
        <path d="M14.2 22.8h19.6M17.6 18.2h12.8M17.6 27.4h12.8" stroke="#d9a957" strokeWidth="1.6" strokeLinecap="round" />
        <path d="m24 13.8 2.1 5.1 5.4.4-4.1 3.5 1.3 5.2-4.7-2.8-4.7 2.8 1.3-5.2-4.1-3.5 5.4-.4L24 13.8Z" fill="#d9a957" />
      </svg>
      {!compact && (
        <div className="leading-none">
          <div className="font-serif text-[17px] font-semibold tracking-[0.02em] text-[#efe5d0]">বাংলার দর্পণ</div>
          <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.25em] text-[#b7a780]">Banglar Darpan</div>
        </div>
      )}
    </div>
  );
}

function EmbedUrl({ id }: { id: string }) {
  return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;
}

function sendYoutubeCommand(frame: HTMLIFrameElement | null, command: 'playVideo' | 'pauseVideo' | 'mute' | 'unMute') {
  if (!frame?.contentWindow) return;
  frame.contentWindow.postMessage(JSON.stringify({ event: 'command', func: command, args: [] }), 'https://www.youtube.com');
}

function BroadcastHeader({ onOpenPromo }: { onOpenPromo: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="bd-header sticky top-0 z-30">
      <div className="bd-container flex min-h-[72px] items-center justify-between gap-4">
        <a href="#live" className="shrink-0" data-testid="link-home">
          <LogoMark />
        </a>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
          <a href="#live" className="bd-kicker text-[#ded7ca] transition-colors hover:text-[#d9a957]" data-testid="link-live">Live TV</a>
          <a href="#guide" className="bd-kicker text-[#8e9aaa] transition-colors hover:text-[#d9a957]" data-testid="link-guide">Channel guide</a>
          <button
            type="button"
            onClick={onOpenPromo}
            className="bd-kicker text-[#8e9aaa] transition-colors hover:text-[#d9a957]"
            data-testid="button-open-promo-header"
          >
            About the signal
          </button>
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            <span className="bd-live-dot" aria-hidden="true" />
            <span className="bd-kicker text-[#d9a957]" data-testid="status-network-live">Network live</span>
          </div>
          <button
            type="button"
            className="rounded-md border border-[#35404e] p-2 text-[#c8d0d9] transition hover:border-[#d9a957] hover:text-[#d9a957] md:hidden"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
            data-testid="button-toggle-navigation"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className="bd-container flex flex-col gap-4 border-t border-[#27313e] py-4 md:hidden" aria-label="Mobile navigation">
          <a href="#live" onClick={() => setMenuOpen(false)} className="bd-kicker text-[#ded7ca]" data-testid="link-mobile-live">Live TV</a>
          <a href="#guide" onClick={() => setMenuOpen(false)} className="bd-kicker text-[#ded7ca]" data-testid="link-mobile-guide">Channel guide</a>
          <button type="button" onClick={() => { setMenuOpen(false); onOpenPromo(); }} className="bd-kicker text-left text-[#ded7ca]" data-testid="button-mobile-promo">About the signal</button>
        </nav>
      )}
    </header>
  );
}

function Ticker() {
  const text = 'OFFICIAL LIVE SIGNAL   •   বাংলার দর্পণ LIVE   •   GLOBAL NEWS NETWORK   •   OFFICIAL LIVE SIGNAL   •   বাংলার দর্পণ LIVE   •   GLOBAL NEWS NETWORK';
  return (
    <div className="border-b border-[#28313e] bg-[#131b27]" aria-label="Breaking news ticker" data-testid="ticker">
      <div className="bd-container flex h-9 items-center overflow-hidden">
        <div className="z-10 flex h-full shrink-0 items-center gap-2 border-r border-[#35404e] bg-[#131b27] pr-4">
          <span className="bd-live-dot" aria-hidden="true" />
          <span className="bd-kicker text-[9px] font-semibold text-[#f0dfc2]">Breaking news</span>
        </div>
        <div className="overflow-hidden whitespace-nowrap pl-4 text-[10px] tracking-[0.08em] text-[#9da9b7]">
          <div className="bd-ticker-track inline-block min-w-max" data-testid="ticker-content">{text}</div>
        </div>
      </div>
    </div>
  );
}

function ChannelGuide({
  activeIndex,
  onSelect,
}: {
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <aside id="guide" className="bd-guide overflow-hidden" aria-label="Live channel guide">
      <div className="flex items-center justify-between border-b border-[#293342] px-4 py-4">
        <div>
          <div className="bd-kicker text-[9px] text-[#d9a957]">Channel guide</div>
          <div className="mt-1 text-sm font-semibold text-[#eee8dd]">Live network</div>
        </div>
        <Radio size={18} strokeWidth={1.5} className="text-[#d9a957]" aria-hidden="true" />
      </div>
      <div className="bd-guide-scroll divide-y divide-[#293342]">
        {channels.map((channel, index) => (
          <button
            type="button"
            key={channel.id}
            onClick={() => onSelect(index)}
            className="bd-channel w-full px-4 py-3 text-left"
            data-active={activeIndex === index}
            aria-current={activeIndex === index ? 'true' : undefined}
            data-testid={`button-channel-${index + 1}`}
          >
            <div className="flex items-start gap-3">
              <span className={`mt-0.5 font-mono text-[10px] font-semibold ${activeIndex === index ? 'text-[#d9a957]' : 'text-[#788596]'}`}>
                {channel.number}
              </span>
              <span className="min-w-0">
                <span className={`block text-[12px] leading-5 ${activeIndex === index ? 'font-semibold text-[#f1eadf]' : 'text-[#c2cad3]'}`}>
                  {channel.label}
                </span>
                <span className="mt-1 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.11em] text-[#748294]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#d95753]" aria-hidden="true" />
                  LIVE BROADCAST
                </span>
              </span>
              {activeIndex === index && <ChevronRight size={15} className="ml-auto mt-1 shrink-0 text-[#d9a957]" aria-hidden="true" />}
            </div>
          </button>
        ))}
      </div>
      <div className="border-t border-[#293342] bg-[#111a25] px-4 py-3">
        <div className="flex items-center gap-2 text-[10px] text-[#8d99a7]">
          <CircleHelp size={13} className="text-[#d9a957]" aria-hidden="true" />
          <span>Choose a channel to change the signal.</span>
        </div>
      </div>
    </aside>
  );
}

function ProgramRail() {
  return (
    <section className="mt-6 border-y border-[#293342] py-4" aria-label="Electronic program guide">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-0">
        {[
          { label: 'LIVE BROADCAST', detail: 'On air now', live: true },
          { label: 'Now Playing', detail: 'Banglar Darpan live signal', live: false },
          { label: 'Upcoming', detail: 'Check back on this channel', live: false },
        ].map((item, index) => (
          <div key={item.label} className={`flex items-center gap-3 px-0 sm:px-5 ${index > 0 ? 'sm:border-l sm:border-[#293342]' : ''}`} data-testid={`epg-${index}`}>
            <span className={`h-2 w-2 rounded-full ${item.live ? 'bg-[#d95753]' : 'bg-[#5b6878]'}`} aria-hidden="true" />
            <div>
              <div className={`bd-kicker text-[9px] ${item.live ? 'text-[#e5b5ae]' : 'text-[#8592a1]'}`}>{item.label}</div>
              <div className="mt-1 text-[11px] text-[#b6c0ca]">{item.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Player({
  channel,
  failed,
  suspended,
  onFailed,
  onSwitch,
}: {
  channel: Channel;
  failed: boolean;
  suspended: boolean;
  onFailed: () => void;
  onSwitch: () => void;
}) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    setMuted(true);
    setPlaying(true);
  }, [channel.id]);

  const handleMute = () => {
    sendYoutubeCommand(frameRef.current, muted ? 'unMute' : 'mute');
    setMuted((value) => !value);
  };

  const handlePlay = () => {
    sendYoutubeCommand(frameRef.current, playing ? 'pauseVideo' : 'playVideo');
    setPlaying((value) => !value);
  };

  const handleFullscreen = async () => {
    try {
      await frameRef.current?.requestFullscreen?.();
    } catch {
      // Fullscreen can be denied by the browser or an embedded document.
    }
  };

  return (
    <div className="bd-player-frame" data-testid="active-player">
      {!failed && !suspended ? (
        <iframe
          ref={frameRef}
          key={channel.id}
          src={EmbedUrl({ id: channel.id })}
          title={channel.label}
             allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          onError={onFailed}
          data-testid="iframe-live-player"
        />
      ) : suspended ? (
        <div className="flex h-full flex-col items-center justify-center bg-[#0a0e14] px-6 text-center">
          <div className="bd-kicker text-[9px] text-[#d9a957]">Welcome promo in focus</div>
          <div className="mt-3 font-serif text-lg text-[#ede4d4]">Your live signal is ready.</div>
          <p className="mt-2 text-xs leading-5 text-[#8f9aa8]">Continue to live TV when you are ready to enter the broadcast.</p>
        </div>
      ) : (
        <div className="flex h-full flex-col items-center justify-center bg-[#0a0e14] px-6 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#644141] text-[#d95753]">
            <Radio size={21} strokeWidth={1.5} />
          </div>
          <div className="font-serif text-lg text-[#ede4d4]">Signal unavailable</div>
          <p className="mt-2 max-w-sm text-xs leading-5 text-[#8f9aa8]">This broadcast is not responding in the player. Please choose another live channel.</p>
          <button type="button" onClick={onSwitch} className="mt-5 inline-flex items-center gap-2 rounded-md border border-[#d9a957] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[#d9a957] transition hover:bg-[#d9a957] hover:text-[#101721]" data-testid="button-switch-channel-error">
            Switch channel <ArrowRight size={13} />
          </button>
        </div>
      )}
      <div className="bd-player-shine" aria-hidden="true" />
      <div className="bd-player-watermark">বাংলার দর্পণ LIVE</div>
      {!failed && !suspended && (
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 rounded-md border border-white/10 bg-[#090d13]/75 p-1 backdrop-blur-sm">
          <button type="button" onClick={handlePlay} className="rounded p-1.5 text-[#ddd5c6] transition hover:bg-white/10 hover:text-[#d9a957]" aria-label={playing ? 'Pause live player' : 'Play live player'} data-testid="button-player-play">
            {playing ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button type="button" onClick={handleMute} className="rounded p-1.5 text-[#ddd5c6] transition hover:bg-white/10 hover:text-[#d9a957]" aria-label={muted ? 'Unmute live player' : 'Mute live player'} data-testid="button-player-mute">
            {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
          <button type="button" onClick={handleFullscreen} className="rounded p-1.5 text-[#ddd5c6] transition hover:bg-white/10 hover:text-[#d9a957]" aria-label="Enter fullscreen" data-testid="button-player-fullscreen">
            <Expand size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

function PromoModal({ onContinue }: { onContinue: () => void }) {
  const promoRef = useRef<HTMLIFrameElement>(null);
  const [watching, setWatching] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onContinue();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onContinue]);

  const watchPromo = () => {
    setWatching(true);
    sendYoutubeCommand(promoRef.current, 'playVideo');
    promoRef.current?.focus();
  };

  return (
    <div className="bd-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="promo-title">
      <div className="bd-modal-card bd-reveal overflow-hidden rounded-xl">
        <div className="flex items-start justify-between gap-5 border-b border-[#293342] px-5 py-4 sm:px-7">
          <div>
            <div className="bd-kicker text-[9px] text-[#d9a957]">A message from the network</div>
            <h2 id="promo-title" className="mt-2 font-serif text-xl text-[#f1eadf] sm:text-2xl">Welcome to Banglar Darpan LIVE</h2>
          </div>
          <button type="button" onClick={onContinue} className="rounded-md p-1.5 text-[#9ca8b6] transition hover:bg-white/10 hover:text-[#eee8dd]" aria-label="Close welcome message" data-testid="button-close-promo">
            <X size={19} />
          </button>
        </div>
        <div className="bd-promo-frame">
          <iframe
            ref={promoRef}
            src={EmbedUrl({ id: 'vf5Z8GT0AH0' })}
            title="Banglar Darpan LIVE welcome promo"
             allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            data-testid="iframe-promo"
          />
        </div>
        <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <p className="max-w-md text-xs leading-5 text-[#9ca8b6]">Six official live channels. One place to stay close to the Bengali world, wherever you are.</p>
          <div className="flex shrink-0 gap-2">
            <button type="button" onClick={watchPromo} className="inline-flex items-center justify-center gap-2 rounded-md border border-[#526073] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.11em] text-[#d6dde4] transition hover:border-[#d9a957] hover:text-[#d9a957]" data-testid="button-watch-promo">
              {watching ? <Pause size={13} /> : <Play size={13} />}
              {watching ? 'Promo playing' : 'Watch promo'}
            </button>
            <button type="button" onClick={onContinue} className="inline-flex items-center justify-center gap-2 rounded-md bg-[#d9a957] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.11em] text-[#111923] transition hover:bg-[#ecd18f]" data-testid="button-continue-live">
              Continue to live TV <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [playerFailed, setPlayerFailed] = useState(false);
  const [showPromo, setShowPromo] = useState(() => {
    try {
      return window.localStorage.getItem(PROMO_KEY) !== 'true';
    } catch {
      return true;
    }
  });
  const activeChannel = useMemo(() => channels[activeIndex], [activeIndex]);

  useEffect(() => {
    document.title = 'বাংলার দর্পণ LIVE | Banglar Darpan LIVE';
  }, []);

  const continueToLive = () => {
    try {
      window.localStorage.setItem(PROMO_KEY, 'true');
    } catch {
      // A private browsing context may deny localStorage; the session still continues.
    }
    setShowPromo(false);
  };

  const resetWelcome = () => {
    try {
      window.localStorage.removeItem(PROMO_KEY);
    } catch {
      // Ignore unavailable storage.
    }
    setShowPromo(true);
  };

  const selectChannel = (index: number) => {
    setPlayerFailed(false);
    setActiveIndex(index);
    document.getElementById('live')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bd-shell text-[#eee8dd]">
      <BroadcastHeader onOpenPromo={() => setShowPromo(true)} />
      <Ticker />
      <main id="live" className="bd-container pb-14 pt-8 sm:pt-12">
        <section className="bd-reveal mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end" aria-labelledby="live-heading">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="bd-live-dot" aria-hidden="true" />
              <span className="bd-kicker text-[10px] text-[#d9a957]">Live television / 24 hour signal</span>
            </div>
            <h1 id="live-heading" className="max-w-3xl font-serif text-[clamp(2.2rem,5vw,4.8rem)] leading-[1.02] tracking-[-0.045em] text-[#f3eee4]">
              The signal is live.
              <span className="block text-[#b5bfca]">Stay with Bengal.</span>
            </h1>
          </div>
          <div className="max-w-[260px] border-l border-[#d9a957]/50 pl-4 text-xs leading-5 text-[#8995a3]">
            <span className="font-serif text-sm text-[#d9a957]">বাংলার দর্পণ</span><br />
            A Bengali broadcast network for a world in motion.
          </div>
        </section>

        <div className="bd-main-grid bd-reveal" style={{ animationDelay: '80ms' }}>
          <section aria-label="Active live television player">
            <Player
              channel={activeChannel}
              failed={playerFailed}
              suspended={showPromo}
              onFailed={() => setPlayerFailed(true)}
              onSwitch={() => selectChannel((activeIndex + 1) % channels.length)}
            />
            <div className="mt-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <div className="flex items-center gap-3">
                  <span className="bd-kicker text-[10px] text-[#d9a957]">{activeChannel.number}</span>
                  <span className="h-1 w-1 rounded-full bg-[#657081]" aria-hidden="true" />
                  <span className="bd-kicker text-[10px] text-[#8592a1]">Now Playing</span>
                </div>
                <h2 className="mt-2 text-lg font-medium text-[#f0e8da] sm:text-xl" data-testid="text-active-channel">{activeChannel.label}</h2>
              </div>
              <div className="flex items-center gap-2 text-right font-mono text-[9px] uppercase tracking-[0.1em] text-[#718092]">
                <Headphones size={14} className="text-[#d9a957]" aria-hidden="true" />
                Audio controls in player
              </div>
            </div>
            <ProgramRail />
          </section>
          <ChannelGuide activeIndex={activeIndex} onSelect={selectChannel} />
        </div>

        <section className="mt-14 grid gap-8 border-t border-[#293342] pt-7 md:grid-cols-[1fr_auto] md:items-end" aria-label="Network note">
          <div>
            <div className="bd-kicker text-[9px] text-[#d9a957]">The Darpan standard</div>
            <p className="mt-3 max-w-2xl font-serif text-2xl leading-snug text-[#e7dfd1] sm:text-3xl">One window. Six signals. A clear view of what matters to Bengali communities everywhere.</p>
          </div>
          <div className="flex items-center gap-3 md:justify-end">
            <div className="bd-signal-line w-20" aria-hidden="true" />
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#7c8998]">Broadcasting worldwide</span>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#293342] bg-[#0b1017]">
        <div className="bd-container flex flex-col justify-between gap-5 py-6 text-[10px] text-[#728091] sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <LogoMark compact />
            <span className="border-l border-[#34404d] pl-3">Official live television from Banglar Darpan</span>
          </div>
          <button type="button" onClick={resetWelcome} className="inline-flex items-center gap-2 self-start font-mono uppercase tracking-[0.1em] text-[#7d8b9a] transition hover:text-[#d9a957] sm:self-auto" data-testid="button-reset-welcome">
            <RotateCcw size={12} /> Reset welcome promo
          </button>
        </div>
      </footer>
      {showPromo && <PromoModal onContinue={continueToLive} />}
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={Home} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;