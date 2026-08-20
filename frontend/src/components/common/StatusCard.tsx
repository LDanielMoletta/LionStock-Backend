import { ComponentType } from 'react';

interface StatusCardProps {
  title: string;
  value: string | number;
  icon?: ComponentType<{ className?: string }>;
  accent: string;
}

const StatusCard = ({ title, value, icon: Icon, accent }: StatusCardProps) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
        </div>
        <div className={`rounded-2xl p-3 ${accent}`}>
          {Icon ? <Icon className="h-5 w-5 text-white" /> : null}
        </div>
      </div>
    </div>
  );
};

export default StatusCard;