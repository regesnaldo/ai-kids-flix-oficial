import { BlogThemeProvider, BlogThemeToggle } from "@/components/blog/BlogThemeToggle";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <BlogThemeProvider>
      <BlogThemeToggle />
      {children}
    </BlogThemeProvider>
  );
}
