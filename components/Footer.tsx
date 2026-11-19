import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-[#3c3d38] text-[#dedad4] mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Logo size={40} color="#86a6a2" />
            <div>
              <p className="font-heading text-[#86a6a2] text-base">
                SeaTribe Skipper Academy
              </p>
              <p className="text-xs text-[#86a6a2] mt-0.5">
                Professional Delivery Training
              </p>
            </div>
          </div>
          <div className="text-sm text-[#86a6a2] text-center sm:text-right">
            <p>&copy; 2026 SeaTribe Skipper Academy</p>
            <p className="mt-1">Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
