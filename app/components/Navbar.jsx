"use client"
import React from "react";
import { Navbar, NavbarBrand, NavbarMenuToggle, NavbarMenuItem, NavbarMenu, NavbarContent, NavbarItem, Link, Button } from "@nextui-org/react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
export default function App() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const { data: session, status } = useSession();

    const router = useRouter();
    const menuItems = [

    ];

    return (
        <Navbar
            isBordered
            isMenuOpen={isMenuOpen}
            onMenuOpenChange={setIsMenuOpen}
        >
            {session ?
                (<NavbarContent className="sm:hidden" justify="start">
                    <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
                </NavbarContent>)
                : ''}
            <NavbarContent className="sm:hidden pr-3" justify="center">
                <NavbarBrand>

                    <p className="font-bold text-inherit">ACME</p>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarBrand>
                    <p className="font-bold text-inherit">ACME</p>
                </NavbarBrand>
                <NavbarItem>
                    <Link color="foreground" href="#">
                        Features
                    </Link>
                </NavbarItem>
                <NavbarItem isActive>
                    <Link href="#" aria-current="page">
                        Customers
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color="foreground" href="#">
                        Integrations
                    </Link>
                </NavbarItem>
            </NavbarContent>


            {session ? '' : (<NavbarContent justify="end"><NavbarItem className="hidden lg:flex">
                <Link href="#">Login</Link>
            </NavbarItem>
                <NavbarItem>
                    <Button as={Link} color="warning" href="#" variant="flat">
                        Sign Up
                    </Button>
                </NavbarItem></NavbarContent>)}


            <NavbarMenu>
                {menuItems.map((item, index) => (
                    <NavbarMenuItem key={`${item}-${index}`}>
                        <Link
                            className="w-full"
                            color={
                                index === 2 ? "warning" : index === menuItems.length - 1 ? "danger" : "foreground"
                            }
                            href="#"
                            size="lg"
                        >
                            {item}
                        </Link>
                    </NavbarMenuItem>
                ))}
                <NavbarMenuItem>
                    <Link className="w-full" color="danger" onClick={() => signOut({ callbackUrl: "/" })}>
                        logout
                    </Link>
                </NavbarMenuItem>
            </NavbarMenu>
        </Navbar>
    );
}
