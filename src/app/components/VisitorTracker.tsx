"use client";
import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("https://easyjobspk.onrender.com");

export default function VisitorTracker() {
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        const res = await fetch('https://geolocation-db.com/json/');
        const geo = await res.json();
        
        const name = localStorage.getItem("userName") || "Admin Visitor";
        const role = localStorage.getItem("role") || "Browsing";
        
        const locationStr = (geo && geo.city) 
          ? `${geo.city}, ${geo.country_name}` 
          : "Location Unknown";
        socket.emit("registerVisitor", {
          name: name,
          role: role,
          location: locationStr
        });

      } catch (error) {
        socket.emit("registerVisitor", {
          name: "Admin Visitor",
          role: "Browsing",
          location: "Private Network"
        });
      }
    };

    socket.on("connect", () => {
      trackVisitor();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return null;
}