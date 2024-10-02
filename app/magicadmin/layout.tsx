import ClientLayout from "./Clientlayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://nexi-intra-magic-studio-canary.intra.nexigroup.com"
  ),
  title: {
    template: "%s | Magic Buttons Studio",
    default: "Magic Buttons studio",
  },
  openGraph: {
    title: "Magic Buttons",
    description: "The place to cook Magic Buttons.",
    images: [
      {
        url: "/studio/og",
        width: 1200,
        height: 600,

        alt: "Koksmat image",
      },
    ],
  },

  applicationName: "Magic Button Studio",
  referrer: "origin-when-cross-origin",
  keywords: ["no code", "low code", "power apps", "power automate"],
  creator: "Niels Gregers Johansen",
  publisher: "Niels Gregers Johansen",
  description: "The place to cook Magic Buttons.",
};
export default function Layout(props: { children: any }) {
  const { children } = props;

  return (
    <div className="h-full w-full">

      <ClientLayout>{children}</ClientLayout>
    </div>
  );
}
