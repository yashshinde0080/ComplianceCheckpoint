import { Button } from "@/components/ui/button";
import { Shield, Menu } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
            <Shield className="h-5 w-5 text-blue-600" />
          </div>
          <span className="text-lg font-semibold text-slate-900">ComplianceCheckpoint</span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Features
          </a>
          <a href="#faq" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            FAQ
          </a>
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
            Sign in
          </Button>
          <Button size="sm" className="gap-2">
            <Shield className="h-4 w-4" />
            Start readiness
          </Button>
          
          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <nav className="container flex flex-col gap-4 py-4">
            <a 
              href="#features" 
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="#faq" 
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </a>
            <Button variant="outline" size="sm" className="w-full">
              Sign in
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
