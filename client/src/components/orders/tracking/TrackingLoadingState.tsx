export default function TrackingLoadingState() {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-zinc-500 font-medium">Tracking your order...</p>
      </div>
    </div>
  );
}
