
import { Flame } from 'lucide-react';

interface RitualButtonProps {
    onClick: () => void;
    label?: string;
}

const RitualButton: React.FC<RitualButtonProps> = ({ onClick, label = "Start Ritual" }) => {
    return (
        <div className="flex justify-center my-4">
            <button
                onClick={() => {
                    if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
                    onClick();
                }}
                className="btn-ritual group flex items-center gap-3 text-lg tracking-widest uppercase relative z-10 px-8 py-3 bg-ink-main text-journal-bg rounded-full hover:bg-crust transition-all shadow-sm focus:outline-none focus:ring-4 focus:ring-crust/20"
            >
                <span className="relative z-10 font-bold font-serif">{label}</span>
                <Flame className="w-5 h-5 text-amber-400 relative z-10 group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-300" />
            </button>
        </div>
    );
};

export default RitualButton;
