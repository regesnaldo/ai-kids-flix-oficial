import { getAgentImage } from "@/lib/getAgentImage";

interface AgentAvatarProps {
  agentId: string;
  size?: "sm" | "md" | "lg" | "xl";
  showName?: boolean;
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-20 h-20",
  xl: "w-32 h-32",
};

const textSizes = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-lg",
  xl: "text-xl",
};

export function AgentAvatar({ agentId, size = "md", showName = false }: AgentAvatarProps) {
  const imageUrl = getAgentImage(agentId);
  const initials = agentId.slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`${sizeClasses[size]} rounded-full overflow-hidden bg-slate-700 flex items-center justify-center border-2 border-blue-500`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={agentId}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className={`${textSizes[size]} font-bold text-white`}>
            {initials}
          </span>
        )}
      </div>
      {showName && (
        <span className={`${textSizes[size]} font-medium text-slate-300`}>
          {agentId}
        </span>
      )}
    </div>
  );
}