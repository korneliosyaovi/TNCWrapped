export default function DesktopBlocker() {
  return (
    <div className="h-screen w-full bg-linear-to-br from-purple-900 via-black to-blue-900 flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <div className="mb-8">
          <svg
            className="w-24 h-24 mx-auto text-purple-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">
          Mobile Only
        </h1>
        
        <p className="text-gray-300 mb-6 leading-relaxed">
          This experience is designed exclusively for mobile devices.
          Please open this link on your smartphone to continue.
        </p>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
          <p className="text-sm text-gray-400">
            Open this URL to your mobile device to continue.
          </p>
        </div>
      </div>
    </div>
  );
}