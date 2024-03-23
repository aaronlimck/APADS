export default function AdminAppraisalsBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="mx-auto flex w-full flex-grow">{children}</div>;
}
