import { BlogThemeProvider, BlogThemeToggle } from "@/components/blog/BlogThemeToggle";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <BlogThemeProvider>
      {/* Fixed theme toggle — top right */}
      <div className="fixed top-20 right-6 md:right-12 z-50">
        <BlogThemeToggle />
      </div>
      {children}
    </BlogThemeProvider>
  );
}
