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
    href: "https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;700&family=Noto+Serif+TC:wght@300;500;700&display=swap",
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
    <html lang="zh-TW" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="flex h-full flex-col">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
