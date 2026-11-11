import "./globals.css";
import { cookies } from "next/headers";
import { Hind_Siliguri } from "next/font/google";
import Providers from "./providers";

const font = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "বাজার দর – BazarDor",
  description: "প্রতিদিনের বাজারদর এক জায়গায়",
};

export default async function RootLayout({ children }) {
  const theme = (await cookies()).get("theme")?.value;

  return (
    <html lang="bn" className={theme === "dark" ? "dark" : ""} suppressHydrationWarning>
      <body className={font.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}