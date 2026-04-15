import { motion } from 'framer-motion';
import { useCall } from '../context/CallContext';
import { 
  Phone, MessageCircle, ChevronDown, Plus, ArrowLeft, 
  ChevronRight, UserPlus, MoreHorizontal 
} from 'lucide-react';

const easeOutExpo = [0.19, 1, 0.22, 1] as const;

interface ClientProfileProps {
  onClose: () => void;
}

export const ClientProfile = ({ onClose }: ClientProfileProps) => {
  const { openDialer } = useCall();

  const client = {
    id: 'violet-cole',
    name: "Violet Cole",
    numbers: [
      "(555) 123-4567",
      "(555) 123-8910",
      "(555) 123-2298",
      "(555) 123-7741",
    ],
    email: "violet.cole@email.com",
    address: "123 missions street, 3543 bouleverad ave, 4th cross, Palo alto, California, 54323",
    addedDate: "JUN 3 2024",
    source: "Radius Marketplace"
  };

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ duration: 0.6, ease: easeOutExpo }}
      className="absolute top-0 right-0 h-screen w-[762px] bg-white shadow-2xl z-40 flex flex-col overflow-hidden"
    >
      {/* Header Section */}
      <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors text-blue-500">
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 shadow-sm">
            <img 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" 
              alt={client.name} 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <h2 className="text-xl font-bold text-gray-900 leading-tight tracking-tight">{client.name}</h2>
            <div className="flex gap-1.5">
              <span className="px-2.5 py-0.5 bg-[#E1F3FE] text-[#0066CC] text-[10px] font-black uppercase tracking-wider rounded-[4px]">BUYER</span>
              <span className="px-2.5 py-0.5 bg-[#D1FBF1] text-[#008F81] text-[10px] font-black uppercase tracking-wider rounded-[4px]">SELLER</span>
              <span className="px-2.5 py-0.5 bg-[#D9F9E2] text-[#2D7A4D] text-[10px] font-black uppercase tracking-wider rounded-[4px]">LANDLORD</span>
              <span className="px-2.5 py-0.5 bg-[#E9E4FF] text-[#6E56CF] text-[10px] font-black uppercase tracking-wider rounded-[4px] border-b-2 border-[#6E56CF]">TENANT</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 cursor-pointer group">
            <span className="text-radius-blue text-[11px] font-black uppercase tracking-widest group-hover:underline">SEND APP INVITE</span>
            <ChevronDown className="w-3 h-3 text-radius-blue" />
          </div>

          <button 
            onClick={() => openDialer({
              source: 'profile',
              clients: [client],
              title: 'Choose number to call',
              description: 'Pick one number to call.',
              primaryActionLabel: 'Call now',
              agentNumbers: ['(555) 901-1100', '(555) 901-2200', '(555) 901-3300'],
              defaultFromNumber: '(555) 901-1100'
            })}
            className="w-10 h-10 flex items-center justify-center bg-[#EEF2FF] border border-[#C7D2FE] rounded-[10px] text-radius-blue transition-all hover:bg-[#E0E7FF]"
          >
            <Phone className="w-5 h-5 fill-radius-blue text-radius-blue" />
          </button>

          <button className="w-10 h-10 flex items-center justify-center bg-[#EEF2FF] border border-[#C7D2FE] rounded-[10px] text-radius-blue transition-all hover:bg-[#E0E7FF]">
            <MessageCircle className="w-5 h-5" />
          </button>

          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreHorizontal className="w-5 h-5 text-gray-400 rotate-90" />
          </button>
        </div>
      </div>

      {/* Dropdowns Section */}
      <div className="px-8 py-4 flex gap-4">
        <button className="flex-1 flex items-center justify-between px-4 py-2.5 bg-green-50 border border-green-100 rounded-xl text-green-700 text-sm font-bold">
          <span>NEW CLIENT</span>
          <ChevronDown className="w-4 h-4" />
        </button>
        <button className="flex-1 flex items-center gap-3 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-700">
          <div className="w-6 h-6 rounded-full bg-gray-300" />
          <span className="flex-1 text-left">Monica Miller</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto px-8 pb-32">
        {/* Contact Grid */}
        <div className="grid grid-cols-4 gap-6 py-8 border-b border-gray-100">
          <div>
            <span className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Email</span>
            <span className="block text-sm font-bold text-gray-900 truncate">{client.email}</span>
          </div>
          <div>
            <span className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Phone</span>
            <button 
              onClick={() => openDialer({
                source: 'profile',
                clients: [client],
                title: 'Choose number to call',
                description: 'Pick one number to call.',
                primaryActionLabel: 'Call now',
                agentNumbers: ['(555) 901-1100', '(555) 901-2200', '(555) 901-3300'],
                defaultFromNumber: '(555) 901-1100'
              })}
              className="block text-sm font-bold text-radius-blue hover:underline"
            >
              {client.numbers[0]}
            </button>
          </div>
          <div>
            <span className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Added on</span>
            <span className="block text-sm font-bold text-gray-900">{client.addedDate}</span>
          </div>
          <div>
            <span className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Source</span>
            <span className="block text-sm font-bold text-gray-900">{client.source}</span>
          </div>
        </div>

        {/* AI Prospecting */}
        <div className="py-6 border-b border-gray-100 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900">AI Prospecting</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-radius-blue text-xs font-bold flex items-center gap-1 hover:underline">
               Edit
            </button>
            <div className="w-10 h-5 bg-gray-200 rounded-full relative cursor-pointer">
              <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
            </div>
          </div>
        </div>

        {/* Detail Sections */}
        {['Additional Details', 'Tags'].map(section => (
          <div key={section} className="py-6 border-b border-gray-100 flex justify-between items-center cursor-pointer hover:bg-gray-50/50 -mx-2 px-2 transition-colors">
            <span className="text-sm font-bold text-gray-900">{section}</span>
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </div>
        ))}

        <div className="py-6 border-b border-gray-100 flex justify-between items-center cursor-pointer hover:bg-gray-50/50 -mx-2 px-2 transition-colors">
          <span className="text-sm font-bold text-gray-900">Family Members</span>
          <div className="flex items-center gap-3">
            <Plus className="w-5 h-5 text-radius-blue border border-dashed border-radius-blue rounded-md p-0.5" />
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </div>
        </div>

        {/* Collaborators Section */}
        <div className="py-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-gray-900">Collaborators</h3>
              <span className="px-2 py-0.5 bg-radius-blue text-white text-[10px] font-bold rounded-full">2</span>
            </div>
            <div className="flex items-center gap-4">
               <Plus className="w-5 h-5 text-radius-blue border border-dashed border-radius-blue rounded-md p-0.5 cursor-pointer" />
               <ChevronDown className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="space-y-4">
            {[
              { name: 'Sarah Johnson', role: 'T.C.', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100' },
              { name: 'Robert Martinez', role: 'LENDER', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100' }
            ].map((collab, i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                    <img src={collab.photo} alt={collab.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900">{collab.name}</span>
                      <span className="px-2 py-0.5 bg-radius-blue/10 text-radius-blue text-[10px] font-bold rounded-md">{collab.role}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 text-radius-blue text-[10px] font-bold rounded-full hover:bg-gray-50">
                    <UserPlus className="w-3 h-3" /> CLIENT LEVEL ACCESS
                  </button>
                  <MoreHorizontal className="w-4 h-4 text-gray-300" />
                </div>
              </div>
            ))}
          </div>

          <button className="mt-4 flex items-center gap-2 text-radius-blue text-sm font-bold hover:underline">
            <Plus className="w-4 h-4" /> Collaborator
          </button>
        </div>

        {/* Buyer Representation Section */}
        <div className="py-8">
           <div className="flex justify-between items-center mb-4">
             <div className="flex items-center gap-2">
               <h3 className="text-sm font-bold text-gray-900">Buyer Representation</h3>
               <span className="px-2 py-0.5 bg-radius-blue text-white text-[10px] font-bold rounded-full">1</span>
             </div>
             <ChevronDown className="w-5 h-5 text-gray-400" />
           </div>
        </div>
      </div>

    </motion.div>
  );
};
