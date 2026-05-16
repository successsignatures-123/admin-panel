"use client";
import { useEffect } from "react";
import { io } from "socket.io-client";
import './globals.css'

const socket = io("https://easyjobspk.onrender.com");

export default function RootLayout({ children }: { children: React.ReactNode }) {
  
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        const res = await fetch('https://geolocation-db.com/json/');
        const geo = await res.json();
        
        const name = localStorage.getItem("userName") || "Guest Visitor";
        const role = localStorage.getItem("role") || "Browsing";
        const locationStr = (geo && geo.city) 
          ? `${geo.city}, ${geo.country_name}` 
          : "Unknown Location";

        socket.emit("registerVisitor", {
          name: name,
          role: role,
          location: locationStr
        });

      } catch (error) {
        socket.emit("registerVisitor", {
          name: localStorage.getItem("userName") || "Admin Visitor",
          role: "Browsing",
          location: "Location Private"
        });
      }
    };

    socket.on("connect", () => {
      console.log("Dashboard connected. Tracking starting...");
      trackVisitor();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}