import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { ChevronRight, Delete, Phone, PhoneCall, Search, X } from 'lucide-react';
import { useCall } from '../../context/CallContext';
import { popupSystem } from '../ui/popupSystem';

const easeOutExpo = [0.32, 0.72, 0, 1] as const;
const sidebarAside = 'w-56 border-r border-gray-100 bg-gray-50/20 p-4 flex flex-col shrink-0';
const navItem = 'relative flex w-full items-center justify-between rounded-lg px-3 h-9 text-[11px] font-bold transition-all';
const navActive = 'bg-white text-radius-blue shadow-sm border border-radius-blue';

const formatUSNumber = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export const CallLauncherDialog = () => {
  const { dialerRequest, closeDialer, startCall } = useCall();
  const [activeGroupId, setActiveGroupId] = useState('clients');
  const [activeMemberId, setActiveMemberId] = useState('');
  const [activeNumber, setActiveNumber] = useState('');
  const [showDialPad, setShowDialPad] = useState(false);
  const [search, setSearch] = useState('');
  const [manualNumber, setManualNumber] = useState('');
  const [selectedFromNumber, setSelectedFromNumber] = useState('');

  const groups = dialerRequest?.groups ?? [];
  const activeGroup = useMemo(
    () => groups.find((group) => group.id === activeGroupId) ?? groups[0] ?? null,
    [activeGroupId, groups]
  );
  const fallbackMembers = useMemo(
    () =>
      groups.length === 0
        ? dialerRequest?.clients.map((client) => ({
            id: client.id,
            name: client.name,
            role: undefined,
            numbers: client.numbers,
            group: 'client' as const,
          })) ?? []
        : [],
    [dialerRequest?.clients, groups.length]
  );
  const members = useMemo(() => {
    const list = activeGroup?.members ?? fallbackMembers;
    const query = search.trim().toLowerCase();
    if (!query) return list;
    return list.filter((member) => {
      const byName = member.name.toLowerCase().includes(query);
      const byRole = member.role?.toLowerCase().includes(query);
      const byNumber = member.numbers.some((number) => number.includes(query.replace(/\D/g, '')));
      return byName || byRole || byNumber;
    });
  }, [activeGroup, fallbackMembers, search]);

  const activeMember = useMemo(
    () => members.find((member) => member.id === activeMemberId) ?? members[0] ?? null,
    [activeMemberId, members]
  );

  useEffect(() => {
    if (!dialerRequest) return;
    const defaultGroupId = dialerRequest.initialGroupId ?? groups[0]?.id ?? '';
    setActiveGroupId(defaultGroupId);
    setSearch('');
    setShowDialPad(false);
    setManualNumber('');
    const fallbackFrom = dialerRequest.defaultFromNumber ?? dialerRequest.agentNumbers?.[0] ?? '';
    setSelectedFromNumber(fallbackFrom);
  }, [dialerRequest, groups]);

  useEffect(() => {
    const firstMember = members[0];
    setActiveMemberId(firstMember?.id ?? '');
    setActiveNumber(firstMember?.numbers[0] ?? '');
  }, [members]);

  if (!dialerRequest) return null;

  const isLibraryFlow = groups.length > 1;
  const isSingleClientFlow = groups.length === 0;
  const handleCall = () => {
    const number = activeNumber || activeMember?.numbers[0] || manualNumber.trim();
    if (!number) return;
    const name = activeMember?.name ?? 'Manual number';
    startCall({ name, number, fromNumber: selectedFromNumber || undefined });
    closeDialer();
  };

  return (
    <Dialog.Root open onOpenChange={(open) => !open && closeDialer()}>
      <AnimatePresence>
        <Dialog.Portal forceMount>
          <Dialog.Overlay asChild>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={popupSystem.overlay.strong}
            />
          </Dialog.Overlay>
          <Dialog.Content asChild>
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 18 }}
              transition={{ duration: 0.24, ease: easeOutExpo }}
              className={`${popupSystem.frame.base} ${
                isLibraryFlow ? popupSystem.frame.library : popupSystem.frame.profile
              }`}
            >
              <div className={popupSystem.header.base}>
                <div className="flex items-center gap-4">
                  <div className={popupSystem.header.iconWrap}>
                    <PhoneCall className="h-5 w-5" />
                  </div>
                  <div>
                    <div className={popupSystem.header.title}>
                      {dialerRequest.title}
                    </div>
                    {dialerRequest.description && (
                      <Dialog.Description className={popupSystem.header.subtitle}>
                        <span className="h-2.5 w-2.5 rounded-full bg-radius-blue/70" />
                        {dialerRequest.description}
                      </Dialog.Description>
                    )}
                  </div>
                </div>
                <Dialog.Title className="sr-only">{dialerRequest.title}</Dialog.Title>
                <Dialog.Close asChild>
                  <button className={popupSystem.header.close}>
                    <X className="h-6 w-6" />
                  </button>
                </Dialog.Close>
              </div>

              <div className="flex min-h-0 max-h-[calc(88vh-128px)] overflow-auto">
                {isLibraryFlow && (
                  <aside className={sidebarAside}>
                    <div className="mb-3 text-[9px] font-black uppercase tracking-widest text-gray-400">Library</div>
                    <div className="space-y-2">
                      {groups.map((group) => {
                        const active = group.id === activeGroupId;
                        return (
                          <button
                            key={group.id}
                            onClick={() => setActiveGroupId(group.id)}
                            className={`${navItem} ${active ? navActive : 'border border-transparent text-[#66708B] hover:bg-white'}`}
                          >
                            <span>{group.label}</span>
                            <ChevronRight className={`h-4 w-4 ${active ? 'text-radius-blue' : 'text-[#B3BACD]'}`} />
                          </button>
                        );
                      })}
                    </div>
                  </aside>
                )}

                <div className="min-w-0 flex-1 bg-[#FCFCFE] px-5 py-5">
                  <div className="flex flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        {!isSingleClientFlow && (
                          <>
                            <div className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                              {activeGroup?.label ?? 'Directory'}
                            </div>
                            <div className="mt-2 text-[13px] font-bold tracking-tight text-[#2C334B]">Search and select</div>
                          </>
                        )}
                      </div>
                      {!isSingleClientFlow && (
                        <button
                          onClick={() => setShowDialPad((value) => !value)}
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border bg-white shadow-[0_8px_24px_-18px_rgba(15,23,42,0.32)] transition-colors ${
                            showDialPad ? 'border-radius-blue text-radius-blue' : 'border-[#E3E8F5] text-[#6F7892] hover:text-[#232943]'
                          }`}
                          aria-label="Open dial pad"
                        >
                          <DialpadGlyph />
                        </button>
                      )}
                    </div>

                    {!isSingleClientFlow && (
                      <div className="mt-4 flex items-center gap-3">
                        <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-[#EEF1F7] bg-white px-4 py-2.5">
                          <Search className="h-4 w-4 text-[#A3ABC2]" />
                          <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={dialerRequest.searchPlaceholder ?? 'Search'}
                            className="w-full bg-transparent text-[13px] font-bold tracking-tight text-[#2C334B] outline-none placeholder:text-[#A3ABC2]"
                          />
                        </div>
                      </div>
                    )}

                    <div className={`mt-4 min-h-0 flex-1 ${isLibraryFlow ? 'overflow-hidden' : ''}`}>
                      {isSingleClientFlow ? (
                        <div className="space-y-2.5">
                          {(activeMember?.numbers ?? []).map((number) => {
                            const active = activeNumber === number;
                            return (
                              <button
                                key={number}
                                onClick={() => setActiveNumber(number)}
                                className={`flex w-full items-center justify-between rounded-[16px] border px-5 py-3.5 text-left transition-colors ${
                                  active
                                    ? 'border-radius-blue bg-[#F7F8FF] text-[#232943]'
                                    : 'border-[#E6EAF3] bg-white text-[#4A546E] hover:border-[#D5DBEA]'
                                }`}
                              >
                                <span className="text-[13px] font-bold tracking-tight">{number}</span>
                                {active && <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-radius-blue">Active</span>}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="grid h-full min-h-0 gap-3 lg:grid-cols-[minmax(0,1.34fr)_minmax(230px,0.74fr)]">
                          <div className="min-h-0 overflow-auto rounded-[16px] border border-[#EEF1F7] bg-white">
                            {members.map((member) => {
                              const active = member.id === activeMemberId;
                              return (
                                <button
                                  key={member.id}
                                  onClick={() => {
                                    setActiveMemberId(member.id);
                                    setActiveNumber(member.numbers[0] ?? '');
                                  }}
                                  className={`flex w-full items-center justify-between border-b border-[#F2F4FA] px-5 py-2.5 text-left transition-colors last:border-b-0 ${
                                    active ? 'bg-[#F7F8FF]' : 'bg-white hover:bg-[#FAFBFE]'
                                  }`}
                                >
                                  <div>
                                    <div className="text-[13px] font-bold tracking-tight text-[#2C334B]">{member.name}</div>
                                    <div className="mt-0.5 text-[11px] font-medium text-[#8D96AE]">{member.role ?? member.numbers[0]}</div>
                                  </div>
                                  <ChevronRight className={`h-4 w-4 ${active ? 'text-radius-blue' : 'text-[#C2C8D8]'}`} />
                                </button>
                              );
                            })}
                          </div>
                          {showDialPad ? (
                            <div className="rounded-[16px] border border-[#E6EAF3] bg-white p-4">
                              <div className="flex items-center justify-between">
                                <p className="text-[13px] font-semibold text-[#232943]">Dial pad</p>
                                <button
                                  onClick={() => setManualNumber('')}
                                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8D96AE] hover:text-[#232943]"
                                >
                                  <Delete className="h-3.5 w-3.5" />
                                  Clear
                                </button>
                              </div>

                              <label className="mt-3 block">
                                <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#A3ABC2]">
                                  Enter number
                                </span>
                                <div className="flex items-center gap-2 rounded-[14px] border border-[#E6EAF3] bg-[#FCFCFE] px-4 py-2.5">
                                  <Phone className="h-4 w-4 text-[#A3ABC2]" />
                                  <input
                                    value={manualNumber}
                                    onChange={(e) => setManualNumber(formatUSNumber(e.target.value))}
                                    placeholder="(555) 123-4567"
                                    className="w-full bg-transparent text-[13px] font-semibold text-[#232943] outline-none placeholder:text-[#A3ABC2]"
                                  />
                                </div>
                              </label>

                              <div className="mt-3 grid grid-cols-3 gap-2">
                                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
                                  <button
                                    key={digit}
                                    onClick={() => setManualNumber((prev) => formatUSNumber(`${prev}${digit}`))}
                                    className="flex h-10 items-center justify-center rounded-[14px] bg-[#FAFBFE] text-[15px] font-semibold text-[#232943] ring-1 ring-[#E6EAF3] transition-transform active:scale-95 hover:bg-[#F4F6FB]"
                                  >
                                    {digit}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="rounded-[16px] border border-[#EEF1F7] bg-white p-4">
                              <div className="text-[9px] font-black uppercase tracking-widest text-gray-400">Numbers</div>
                              <div className="mt-2 text-[13px] font-bold tracking-tight text-[#232943]">{activeMember?.name ?? 'Select a contact'}</div>
                              {activeMember?.role && <div className="mt-0.5 text-[12px] text-[#8D96AE]">{activeMember.role}</div>}
                              <div className="mt-4 space-y-2.5">
                                {(activeMember?.numbers ?? []).map((number) => {
                                  const active = activeNumber === number;
                                  return (
                                    <button
                                      key={number}
                                      onClick={() => setActiveNumber(number)}
                                      className={`flex w-full items-center justify-between rounded-[14px] border px-4 py-2.5 text-left transition-colors ${
                                        active
                                          ? 'border-radius-blue bg-[#F7F8FF] text-[#232943]'
                                          : 'border-[#E6EAF3] bg-white text-[#4A546E] hover:border-[#D5DBEA]'
                                      }`}
                                    >
                                      <span className="text-[13px] font-bold tracking-tight">{number}</span>
                                      {active && <span className="h-2.5 w-2.5 rounded-full bg-radius-blue" />}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className={popupSystem.footer.base}>
                <button
                  onClick={closeDialer}
                  className={popupSystem.footer.secondary}
                >
                  Close
                </button>
                <div className="flex items-center gap-4">
                  {!!dialerRequest.agentNumbers?.length && (
                    <label className="flex items-center gap-2 rounded-xl border border-[#E6EAF3] bg-white px-3 py-2">
                      <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#A3ABC2]">From</span>
                      <select
                        value={selectedFromNumber}
                        onChange={(e) => setSelectedFromNumber(e.target.value)}
                        className="bg-transparent text-[12px] font-bold tracking-tight text-[#2C334B] outline-none"
                      >
                        {dialerRequest.agentNumbers.map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                  <button
                    onClick={handleCall}
                    disabled={!activeMember && !manualNumber.trim()}
                    className={popupSystem.footer.primary}
                  >
                    {dialerRequest.primaryActionLabel}
                    <ChevronRight className="h-[18px] w-[18px]" />
                  </button>
                </div>
              </div>
            </motion.div>
          </Dialog.Content>
        </Dialog.Portal>
      </AnimatePresence>
    </Dialog.Root>
  );
};

const DialpadGlyph = () => (
  <span className="grid h-4 w-4 grid-cols-3 grid-rows-3 gap-[2px]">
    {Array.from({ length: 9 }).map((_, index) => (
      <span key={index} className="h-1 w-1 rounded-full bg-current" />
    ))}
  </span>
);
