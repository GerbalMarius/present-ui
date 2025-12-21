import type { Metadata } from "next";
import { Poppins, Roboto } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "./lib/ToastContext";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Deski",
  description: "Shared desk space reservations",
};

const RootLayout = (
  { children }
  : { 
  children: Readonly<React.ReactNode>
}) => {
  return (
    <html
      lang="en-US"
      className={`${roboto.variable} ${poppins.variable} antialiased sm:scroll-smooth`}
    >
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}

export default RootLayout;
