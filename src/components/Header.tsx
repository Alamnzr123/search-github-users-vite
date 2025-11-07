export default function Header() {
  return (
    <header className="w-full bg-sky-600 text-white py-4">
      <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">GitHub User Search</h1>
        <nav className="text-sm opacity-90">
          <a href="#search" className="mr-4 hover:underline">Search</a>
          <a href="#about" className="hover:underline">About</a>
        </nav>
      </div>
    </header>
  );
}
