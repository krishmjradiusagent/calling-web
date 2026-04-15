import React, { createContext, useContext, useState, useEffect } from 'react';

export type CallStatus = 'idle' | 'calling' | 'connected' | 'disconnected' | 'error';
export type SummaryStatus = 'idle' | 'summarizing' | 'ready' | 'viewing';

interface Client {
  name: string;
  number: string;
  fromNumber?: string;
}

export interface CallTarget {
  name: string;
  number: string;
}

export interface CallLaunchClient {
  id: string;
  name: string;
  numbers: string[];
}

export interface CallLaunchMember {
  id: string;
  name: string;
  role?: string;
  numbers: string[];
  group: 'client' | 'agent';
}

export interface CallLaunchGroup {
  id: string;
  label: string;
  members: CallLaunchMember[];
}

export interface CallLaunchRequest {
  source: 'profile' | 'settings';
  clients: CallLaunchClient[];
  groups?: CallLaunchGroup[];
  agentNumbers?: string[];
  defaultFromNumber?: string;
  title: string;
  description: string;
  searchPlaceholder?: string;
  primaryActionLabel: string;
  initialGroupId?: string;
}

interface CallContextType {
  status: CallStatus;
  summaryStatus: SummaryStatus;
  client: Client | null;
  duration: number;
  isMuted: boolean;
  isSpeakerOn: boolean;
  dialedDigits: string;
  isKeypadOpen: boolean;
  startCall: (client: Client) => void;
  endCall: () => void;
  toggleMute: () => void;
  toggleSpeaker: () => void;
  retryCall: () => void;
  resetCall: () => void;
  generateSummary: () => void;
  viewSummary: () => void;
  closeSummary: () => void;
  dialerRequest: CallLaunchRequest | null;
  openDialer: (request: CallLaunchRequest) => void;
  closeDialer: () => void;
  openKeypad: () => void;
  closeKeypad: () => void;
  pressKeypadDigit: (digit: string) => void;
  deleteKeypadDigit: () => void;
  clearKeypad: () => void;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export const CallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<CallStatus>('idle');
  const [summaryStatus, setSummaryStatus] = useState<SummaryStatus>('idle');
  const [client, setClient] = useState<Client | null>(null);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [dialedDigits, setDialedDigits] = useState('');
  const [isKeypadOpen, setIsKeypadOpen] = useState(false);
  const [dialerRequest, setDialerRequest] = useState<CallLaunchRequest | null>(null);

  useEffect(() => {
    let interval: number | undefined;
    if (status === 'connected') {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [status]);

  const startCall = (client: Client) => {
    setClient(client);
    setStatus('calling');
    setDuration(0);
    setSummaryStatus('idle'); // Reset summary state on new call
    setDialedDigits('');
    setIsKeypadOpen(false);
    
    // Simulate connection after 2 seconds
    setTimeout(() => {
      setStatus('connected');
    }, 2000);
  };

  const endCall = () => {
    setStatus('disconnected');
    // Keep it in disconnected for 2s before resetting or showing summary
  };

  const toggleMute = () => setIsMuted(!isMuted);
  const toggleSpeaker = () => setIsSpeakerOn(!isSpeakerOn);

  const retryCall = () => {
    if (client) startCall(client);
  };

  const resetCall = () => {
    setStatus('idle');
    setClient(null);
    setDuration(0);
    setIsMuted(false);
    setIsSpeakerOn(false);
    setSummaryStatus('idle');
    setDialedDigits('');
    setIsKeypadOpen(false);
  };

  const openDialer = (request: CallLaunchRequest) => setDialerRequest(request);
  const closeDialer = () => setDialerRequest(null);
  const openKeypad = () => setIsKeypadOpen(true);
  const closeKeypad = () => setIsKeypadOpen(false);
  const pressKeypadDigit = (digit: string) => setDialedDigits((prev) => `${prev}${digit}`);
  const deleteKeypadDigit = () => setDialedDigits((prev) => prev.slice(0, -1));
  const clearKeypad = () => setDialedDigits('');

  const generateSummary = () => {
    setSummaryStatus('summarizing');
    // Simulate AI generation time
    setTimeout(() => {
      setSummaryStatus('ready');
    }, 3000);
  };

  const viewSummary = () => {
    setSummaryStatus('viewing');
  };

  const closeSummary = () => {
    setSummaryStatus('idle');
  };

  return (
    <CallContext.Provider
      value={{
        status,
        summaryStatus,
        client,
        duration,
        isMuted,
        isSpeakerOn,
        dialedDigits,
        isKeypadOpen,
        startCall,
        endCall,
        toggleMute,
        toggleSpeaker,
        retryCall,
        resetCall,
        generateSummary,
        viewSummary,
        closeSummary,
        dialerRequest,
        openDialer,
        closeDialer,
        openKeypad,
        closeKeypad,
        pressKeypadDigit,
        deleteKeypadDigit,
        clearKeypad
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => {
  const context = useContext(CallContext);
  if (context === undefined) {
    throw new Error('useCall must be used within a CallProvider');
  }
  return context;
};
