import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useCall } from '../../context/CallContext';
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, RefreshCcw, X } from 'lucide-react';
import { VoiceReactiveGradient } from './VoiceReactiveGradient';
const easeOutExpo = [0.32, 0.72, 0, 1] as const;
const easeInOutStrong = [0.77, 0, 0.175, 1] as const;

export const DynamicIslandDialer = () => {
  const { 
    status, 
    client, 
    duration, 
    isMuted, 
    isSpeakerOn, 
    dialedDigits,
    isKeypadOpen,
    endCall, 
    toggleMute, 
    toggleSpeaker, 
    retryCall, 
    resetCall,
    openKeypad,
    closeKeypad,
    pressKeypadDigit,
    deleteKeypadDigit,
    clearKeypad
  } = useCall();
  const shouldReduceMotion = useReducedMotion();

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (status === 'idle') return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
      <motion.div
        initial={{ y: -100, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -100, opacity: 0, scale: 0.9 }}
        transition={{ duration: shouldReduceMotion ? 0.2 : 0.45, ease: easeOutExpo }}
        className="pointer-events-auto"
      >
        <div className="bg-white/92 backdrop-blur-xl border border-border shadow-premium rounded-[24px] px-4 py-2 flex items-center gap-4 min-w-[440px]">
          {/* Status Specific UI */}
          <AnimatePresence mode="wait">
            {status === 'calling' && (
              <motion.div
                key="calling"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 w-full"
              >
                <div className="w-10 h-10 rounded-full bg-radius-blue/10 flex items-center justify-center relative">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute inset-0 bg-radius-blue/20 rounded-full"
                  />
                  <Phone className="w-5 h-5 text-radius-blue" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold">{client?.name}</h3>
                  <p className="text-[12px] text-gray-500">
                    Calling...
                    {client?.fromNumber ? ` • From ${client.fromNumber}` : ''}
                  </p>
                </div>
                <DialerButton onClick={openKeypad}>
                  <DialpadGlyph />
                </DialerButton>
                <DialerButton onClick={endCall} variant="danger">
                  <PhoneOff className="w-5 h-5" />
                </DialerButton>
              </motion.div>
            )}

            {status === 'connected' && (
              <motion.div
                key="connected"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 w-full"
              >
                <div className="flex-1">
                  <h3 className="text-sm font-semibold">{client?.name}</h3>
                  <p className="text-[12px] font-mono text-gray-500">
                    {formatDuration(duration)}
                    {client?.fromNumber ? ` • From ${client.fromNumber}` : ''}
                  </p>
                  {dialedDigits && (
                    <p className="mt-0.5 text-[11px] font-mono tracking-[0.2em] text-radius-blue">{dialedDigits}</p>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <DialerButton onClick={isKeypadOpen ? closeKeypad : openKeypad} active={isKeypadOpen}>
                    <DialpadGlyph />
                  </DialerButton>
                  <DialerButton onClick={toggleMute} active={isMuted}>
                    {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </DialerButton>
                  <DialerButton onClick={toggleSpeaker} active={isSpeakerOn}>
                    {isSpeakerOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </DialerButton>
                  <DialerButton onClick={endCall} variant="danger">
                    <PhoneOff className="w-5 h-5" />
                  </DialerButton>
                </div>
              </motion.div>
            )}

            {status === 'disconnected' && (
              <motion.div
                key="disconnected"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-between gap-3 w-full"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Call Ended</span>
                  <span className="text-[12px] text-gray-500">Duration: {formatDuration(duration)}</span>
                </div>
                <button 
                  onClick={resetCall}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 w-full"
              >
                <div className="bg-danger/10 p-2 rounded-full">
                  <RefreshCcw className="w-5 h-5 text-danger" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-danger">Connection Lost</h3>
                  <p className="text-[12px] text-gray-500">Would you like to retry?</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={retryCall}
                    className="px-3 py-1 bg-radius-blue text-white text-xs font-semibold rounded-full hover:shadow-lg active:scale-95 transition-all"
                  >
                    Retry
                  </button>
                  <button onClick={resetCall} className="p-1 hover:bg-gray-100 rounded-full">
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <AnimatePresence>
        {(status === 'calling' || status === 'connected') && (
          <motion.div
            key="voice-gradient"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: shouldReduceMotion ? 0.12 : 0.22, ease: easeOutExpo }}
          >
            <VoiceReactiveGradient
              active={status === 'connected' && !isMuted}
              intensity={status === 'calling' ? 0.45 : isMuted ? 0.2 : 1}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isKeypadOpen && status === 'connected' && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.97, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 10, scale: 0.97, filter: 'blur(4px)' }}
            transition={{ duration: shouldReduceMotion ? 0.15 : 0.22, ease: easeOutExpo }}
            className="pointer-events-auto absolute left-1/2 top-[calc(100%+12px)] w-[360px] -translate-x-1/2 rounded-[24px] border border-border bg-white/95 p-4 shadow-premium backdrop-blur-xl"
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">Keypad</p>
                <p className="text-[11px] text-gray-500">Use tones during the call.</p>
              </div>
              <button onClick={clearKeypad} className="text-[11px] font-bold text-radius-blue hover:underline">
                Clear
              </button>
            </div>
            <div className="mb-4 rounded-2xl bg-gray-50 px-4 py-3 text-center font-mono text-lg tracking-[0.22em] text-gray-900">
              {dialedDigits || '—'}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {['1','2','3','4','5','6','7','8','9','*','0','#'].map((digit) => (
                <motion.button
                  key={digit}
                  onClick={() => pressKeypadDigit(digit)}
                  whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 26 }}
                  className="h-12 rounded-2xl bg-white text-base font-semibold text-gray-900 shadow-sm ring-1 ring-gray-200 transition-transform active:scale-95 hover:bg-gray-50"
                >
                  {digit}
                </motion.button>
              ))}
              <motion.button
                onClick={deleteKeypadDigit}
                whileTap={{ scale: shouldReduceMotion ? 1 : 0.96 }}
                transition={{ duration: 0.16, ease: easeInOutStrong }}
                className="col-span-3 h-10 rounded-xl border border-radius-blue/20 bg-radius-blue/10 text-[10px] font-black uppercase tracking-[0.2em] text-radius-blue transition-all active:scale-95 hover:bg-radius-blue/15"
              >
                Clear last digit
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DialerButton = ({ 
  children, 
  onClick, 
  variant = 'default', 
  active = false 
}: { 
  children: React.ReactNode; 
  onClick: () => void; 
  variant?: 'default' | 'danger';
  active?: boolean;
}) => {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.button
      whileTap={{ scale: shouldReduceMotion ? 1 : 0.94 }}
      transition={{ type: "spring", stiffness: 420, damping: 26 }}
      onClick={onClick}
      className={`
        w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200
        ${variant === 'danger' ? 'bg-danger text-white hover:bg-danger/90' : 
          active ? 'bg-radius-blue text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
      `}
    >
      {children}
    </motion.button>
  );
};

const DialpadGlyph = () => (
  <span className="grid h-4 w-4 grid-cols-3 grid-rows-3 gap-[2px]">
    {Array.from({ length: 9 }).map((_, index) => (
      <span key={index} className="h-1 w-1 rounded-full bg-current" />
    ))}
  </span>
);
