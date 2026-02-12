interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export function PageHeader({ title, description, icon }: PageHeaderProps) {
  return (
    <div className="border-b border-gray-200 bg-white p-8">
      <div className="flex items-start gap-4">
        {icon && <div className="text-[#296374]">{icon}</div>}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {description && <p className="mt-2 text-gray-600">{description}</p>}
        </div>
      </div>
    </div>
  );
}
