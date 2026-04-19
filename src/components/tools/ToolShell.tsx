import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface ToolShellProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  disclaimer?: string;
  children: ReactNode;
  aside?: ReactNode;
}

const ToolShell = ({ eyebrow, title, subtitle, disclaimer, children, aside }: ToolShellProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-premium">
      <Navigation />
      <main className="flex-1 pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="max-w-3xl mx-auto mb-8 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to="/tools" className="hover:text-foreground transition-colors">Tools</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground">{title}</span>
          </nav>

          {/* Header */}
          <header className="max-w-3xl mx-auto mb-12 text-center">
            {eyebrow && (
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded-full bg-card border border-border text-xs font-medium tracking-wide uppercase text-muted-foreground shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {eyebrow}
              </div>
            )}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground leading-[1.05]">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-5 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {subtitle}
              </p>
            )}
            {disclaimer && (
              <p className="mt-6 text-xs text-muted-foreground/80 max-w-xl mx-auto">
                {disclaimer}
              </p>
            )}
          </header>

          {/* Content */}
          <div className={aside ? "max-w-6xl mx-auto grid lg:grid-cols-[1fr_320px] gap-8" : "max-w-3xl mx-auto"}>
            <div className="min-w-0">{children}</div>
            {aside && <aside className="space-y-6">{aside}</aside>}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ToolShell;
