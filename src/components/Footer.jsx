export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-center px-4 py-6 text-xs text-slate-500 sm:px-6 lg:px-8">
        © {new Date().getFullYear()} TechStore · E-Commerce Practical Exercise
      </div>
    </footer>
  );
}
