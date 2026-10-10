import "./globals.css";
import ReduxProvider from "@/store/Provider";

export const metadata = {
  title: "PulseBoard | Your Personalized Content Hub",
  description:
    "Discover personalized news, recommendations, and trending content.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}