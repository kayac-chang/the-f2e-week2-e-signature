import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import tailwindStylesheetUrl from "~/styles/tailwind.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwindStylesheetUrl },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href:
      "https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;700&display=optional",
  },
  {
    rel: "icon",
    type: "image/x-icon",
    href: require("~/assets/icons/logo.svg"),
  },
];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "快點簽 Fast-Sign | 好從容！您的電子簽署好夥伴",
  viewport: "width=device-width,initial-scale=1",
});

export async function loader() {
  return json({});
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="flex h-screen flex-col overflow-hidden bg-neutral-5 text-white">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
