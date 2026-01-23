const Footer = () => {
  return (
    <footer className="border-t border-border py-8 bg-muted/30">
      <div className="container">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
              <span className="text-xs font-bold text-primary-foreground">CC</span>
            </div>
            <span className="text-sm font-medium text-foreground">ComplianceCheckpoint</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Security</a>
          </div>

          <p className="text-sm text-muted-foreground">
            © 2024 ComplianceCheckpoint
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
