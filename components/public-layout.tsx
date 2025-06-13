export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="container mx-auto max-w-7xl px-6 py-8 flex-1">
      {children}
    </main>
  );
}
