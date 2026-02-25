
import { Flame } from 'lucide-react';

interface RitualButtonProps {
    onClick: () => void;
}

const RitualButton: React.FC<RitualButtonProps> = ({ onClick }) => {
    return (
        <div className="flex justify-center my-12">
            <button
                onClick={onClick}
                className="btn-ritual group flex items-center gap-3 text-lg tracking-widest uppercase relative z-10"
            >
                <span className="relative z-10 font-medium">Start Ritual</span>
                <Flame className="w-5 h-5 text-neon-yellow relative z-10 group-hover:scale-110 transition-transform duration-300" />
            </button>
        </div>
    );
};

export default RitualButton;
