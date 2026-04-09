import { motion, AnimatePresence } from 'framer-motion';
import { useCall } from '../../context/CallContext';
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, RefreshCcw, X } from 'lucide-react';
const easeOutExpo = [0.32, 0.72, 0, 1] as const;

export const DynamicIslandDialer = () => {
  const { 
    status, 
    client, 
    duration, 
    isMuted, 
    isSpeakerOn, 
    endCall, 
    toggleMute, 
    toggleSpeaker, 
    retryCall, 
    resetCall 
  } = useCall();

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
        transition={{ duration: 0.6, ease: easeOutExpo }}
        className="pointer-events-auto"
      >
        <div className="bg-white/90 backdrop-blur-xl border border-border shadow-premium rounded-[24px] px-4 py-2 flex items-center gap-4 min-w-[320px]">
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
                  <p className="text-[12px] text-gray-500 animate-pulse">Calling...</p>
                </div>
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
                  <p className="text-[12px] font-mono text-gray-500">{formatDuration(duration)}</p>
                </div>
                
                <div className="flex items-center gap-2">
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
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
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
