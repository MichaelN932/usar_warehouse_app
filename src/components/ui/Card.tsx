import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  onClick?: () => void;
}

export function Card({ children, className = '', title, subtitle, actions, onClick }: CardProps) {
  return (
    <div className={`card ${className}`} onClick={onClick}>
      {(title || actions) && (
        <div className="flex justify-between items-start mb-4">
          <div>
            {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
          {actions && <div>{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: ReactNode;
  color?: 'default' | 'fire' | 'green' | 'yellow' | 'blue';
}

const colorStyles = {
  default: 'bg-gray-100 text-gray-600',
  fire: 'bg-fire-100 text-fire-600',
  green: 'bg-green-100 text-green-600',
  yellow: 'bg-yellow-100 text-yellow-600',
  blue: 'bg-blue-100 text-blue-600',
};

export function StatCard({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  icon,
  color = 'default',
}: StatCardProps) {
  return (
    <div className="card">
      <div className="flex items-center">
        {icon && (
          <div className={`p-3 rounded-lg ${colorStyles[color]} mr-4`}>
            {icon}
          </div>
        )}
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {trend && trendValue && (
              <span
                className={`ml-2 text-sm font-medium ${
                  trend === 'up'
                    ? 'text-green-600'
                    : trend === 'down'
                    ? 'text-red-600'
                    : 'text-gray-500'
                }`}
              >
                {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}
                {trendValue}
              </span>
            )}
          </div>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
