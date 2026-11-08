import { Metadata } from "next";
import { Download, Bike, ShieldCheck, MapPin, Clock, DollarSign, Smartphone, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Become a Delivery Agent | Cravon Driver App",
  description: "Download the Cravon Driver APK for Android. Deliver food, earn flexible income, and choose your own hours.",
};

export default function BecomeDeliveryAgentPage() {
  const displayFont = "'Baloo 2', 'Poppins', 'Segoe UI', sans-serif";

  const benefits = [
    {
      icon: <Clock className="w-6 h-6 text-[#FF7A30]" />,
      title: "Flexible Hours",
      desc: "Be your own boss. Log in whenever you want to work, take breaks anytime, and set your own daily goals.",
    },
    {
      icon: <DollarSign className="w-6 h-6 text-green-500" />,
      title: "Reliable Earnings",
      desc: "Earn per completed delivery with transparent fare calculations and instant earnings tracking in your driver dashboard.",
    },
    {
      icon: <MapPin className="w-6 h-6 text-blue-500" />,
      title: "City-Centric Matching",
      desc: "Operate across 12 major cities including Patna, Delhi, Mumbai, and Bengaluru with localized restaurant orders.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-purple-500" />,
      title: "Live GPS & In-App Navigation",
      desc: "Integrated one-tap maps from restaurant pickup to customer doorstep for fast and smooth drop-offs.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Download the APK",
      desc: "Click the download button below to download the official cravon-driver.apk directly to your Android device.",
    },
    {
      number: "02",
      title: "Enable 'Unknown Sources'",
      desc: "If prompted by Android, go to Settings and allow installation from your browser or file manager.",
    },
    {
      number: "03",
      title: "Register & Start Delivering",
      desc: "Open Cravon Driver, enter your name, vehicle details, select your city, and start accepting delivery requests!",
    },
  ];

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-gray-900 selection:bg-[#FF7A30]/20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#F1E1D6] bg-linear-to-b from-[#FFF5EE] via-white to-[#FAF7F2]">
        <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100/80 border border-orange-200 text-[#FF7A30] text-xs sm:text-sm font-bold uppercase tracking-wider mb-6">
            <Bike className="w-4 h-4" />
            <span>Official Delivery Partner Portal</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight mb-6" style={{ fontFamily: displayFont }}>
            Become a Delivery Agent with <span className="text-transparent bg-clip-text bg-linear-to-r from-[#FF3D57] to-[#FF7A30]">Cravon</span>
          </h1>

          <p className="text-base sm:text-xl text-gray-600 max-w-2xl leading-relaxed mb-10">Earn competitive payouts, choose your own hours, and deliver food across your city. Download the Cravon Driver APK for Android and hit the road today.</p>

          {/* Primary Download Button */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <a href="/cravon-driver.apk" download="cravon-driver.apk" className="w-full sm:w-auto flex items-center justify-center gap-3 bg-linear-to-r from-[#FF3D57] to-[#FF7A30] hover:from-[#E22B45] hover:to-[#E06020] text-white px-8 py-4 rounded-2xl font-bold text-base sm:text-lg shadow-xl shadow-orange-500/20 active:scale-95 transition-all cursor-pointer">
              <Download className="w-5 h-5 animate-bounce" />
              <span>Download Driver APK</span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-md font-mono">v1.0.0</span>
            </a>

            <Link href="/" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-6 py-4 rounded-2xl font-bold text-sm sm:text-base transition-colors shadow-xs">
              Back to Home
            </Link>
          </div>

          {/* Metadata pill */}
          <div className="flex items-center gap-4 mt-6 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-gray-400" />
              Android 7.0+ Compatible
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              Direct APK Download (~190 KB)
            </span>
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3" style={{ fontFamily: displayFont }}>
            Why Deliver with Cravon?
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">Everything you need to deliver orders efficiently, earn sustainably, and stay in control of your daily schedule.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center mb-5">{benefit.icon}</div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{benefit.title}</h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How to Install Guide */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-12">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold text-[#FF7A30] uppercase tracking-wider">Fast &amp; Simple Setup</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1" style={{ fontFamily: displayFont }}>
              How to Install Cravon Driver APK
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-start relative">
                <span className="text-4xl font-black text-orange-200 mb-3" style={{ fontFamily: displayFont }}>
                  {step.number}
                </span>
                <h3 className="text-base font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Download CTA Card */}
          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6 bg-orange-50/50 p-6 rounded-2xl">
            <div>
              <h4 className="font-bold text-gray-900 text-base">Ready to get started?</h4>
              <p className="text-xs text-gray-500 mt-0.5">Download the latest release and start earning today.</p>
            </div>
            <a href="/cravon-driver.apk" download="cravon-driver.apk" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-black text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer">
              <Download className="w-4 h-4 text-[#FF7A30]" />
              <span>Download cravon-driver.apk</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
