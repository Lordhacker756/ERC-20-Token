import Footer from "@/components/globals/Footer";
import ImageTrail from "@/lib/blocks/animations/ImageTrail/ImageTrail";
import Aurora from "@/lib/blocks/backgrounds/Aurora/Aurora";
import BlurText from "@/lib/blocks/text-animations/BlurText/BlurText";
import CircularText from "@/lib/blocks/text-animations/CircularText/CircularText";
import GlitchText from "@/lib/blocks/text-animations/GlitchText/GlitchText";
import ScrollReveal from "@/lib/blocks/text-animations/ScrollReveal/ScrollReveal";
import ScrollVelocity from "@/lib/blocks/text-animations/ScrollVelocity/ScrollVelocity";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen w-screen relative pt-15">
      {/* Background layer */}
      <div className="absolute inset-0">
        <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
          blend={1.0}
          amplitude={1.0}
          speed={0.5}
        />
      </div>
      {/* Content layer */}
      <div className="relative z-10 h-full mt-10 mb-20 w-full flex flex-col items-center justify-center overflow-hidden">
        <CircularText text="TSUNDERE*COIN*ERC-20*" onHover="goBonkers" />
        <BlurText
          text="ERC-20 Token Made By Weeb For the Weebs🎎"
          delay={150}
          animateBy="words"
          direction="top"
          className="text-xl w-[90%] sm:w-full flex justify-center font-bold mt-5 sm:text-3xl md:text-4xl lg:text-[3rem] text-center"
        />
        <div
          className="w-full h-[300px] relative overflow-hidden cursor-none mt-8"
          style={{
            minHeight: "300px",
          }}
        >
          {/* Hint images that are visible by default */}
          <div className="absolute inset-0 flex items-center justify-center opacity-50 pointer-events-none">
            <div className="flex gap-4">
              <img
                src="https://picsum.photos/id/287/150/150"
                alt="Hint"
                className="w-[120px] h-[120px] rounded-lg shadow-lg animate-float"
                style={{ animationDelay: "0s" }}
              />
              <img
                src="https://picsum.photos/id/1001/150/150"
                alt="Hint"
                className="w-[100px] h-[100px] rounded-lg shadow-lg animate-float"
                style={{ animationDelay: "0.5s" }}
              />
              <img
                src="https://picsum.photos/id/1025/150/150"
                alt="Hint"
                className="w-[90px] h-[90px] rounded-lg shadow-lg animate-float"
                style={{ animationDelay: "0.8s" }}
              />
            </div>
          </div>

          {/* Original ImageTrail component */}
          <ImageTrail
            items={[
              "https://picsum.photos/id/287/300/300",
              "https://picsum.photos/id/1001/300/300",
              "https://picsum.photos/id/1025/300/300",
              "https://picsum.photos/id/1026/300/300",
              "https://picsum.photos/id/1027/300/300",
              "https://picsum.photos/id/1028/300/300",
              "https://picsum.photos/id/1029/300/300",
              "https://picsum.photos/id/1030/300/300",
            ]}
            variant={1}
          />
        </div>
      </div>
      <ScrollVelocity
        texts={[
          "B-Baka! It's not like I want your investment or anything...",
          "Tsundere Coin to the Moon! ┗(^o^)┛",
          "UwU... What's this? A new token?",
          "Senpai, notice my market cap!",
          "Nani?! Such tokenomics!",
          "Yamete kudasai... paper hands!",
        ]}
        velocity={10}
        className="custom-scroll-text"
      />
      {/* ScrollReveal component */}
      <div className="mt-50 w-[90%] min-h-[450px] sm:w-[70%] md:w-[80%] lg:w-[90%] mx-auto py-5">
        <GlitchText speed={1} enableShadows={true} enableOnHover={true}>
          About
        </GlitchText>
        <ScrollReveal
          baseOpacity={0}
          enableBlur={true}
          baseRotation={5}
          blurStrength={10}
          containerClassName="mb-10"
        >
          TsundereCoin (TSN) is a secure, feature-rich ERC-20 token with
          advanced security, pausable operations, role-based access, and a
          faucet mechanism. Built for flexibility and robustness, it's as
          powerful as it is elegant.
        </ScrollReveal>
        <div className="mt-10 mb-30">
          <button className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full opacity-75 group-hover:opacity-100 animate-spin-slow blur-sm"></div>
            <Link href="/coin">
              <div className="relative px-7 py-2 sm:px-7 sm:py-4 bg-black rounded-full leading-none flex items-center">
                <span className=" px-1 py-2 text-lg font-bold">
                  Claim Your Tsundere...
                </span>
                <span className="ml-1 text-pink-400 group-hover:text-white transition-colors">
                  →
                </span>
              </div>
            </Link>
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
