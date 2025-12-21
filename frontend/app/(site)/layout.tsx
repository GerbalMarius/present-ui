"use client";

import NavBar from "../ui/NavBar";

const SiteLayout = (
    { children }:Readonly<{children: React.ReactNode;}>
) => {
    return (
        <>
            <header>
                <NavBar
                    links={[
                        { label: "Desks", href: "/" },
                        { label: "Profile", href: "/profile/about" },
                    ]}
                    showButton={false}
                    brandName="Deski"
                    logoSrc="/img/logo.svg"
                />
            </header>

            {children}
        </>
    );
}
export default SiteLayout;
