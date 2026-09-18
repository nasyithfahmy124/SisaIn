import React from "react";
import HeroDesktop from "./HeroDesktop";
import HeroMobile from "./HeroMobile";

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-white">
            <HeroDesktop />
            <HeroMobile />
        </section>
    );
}