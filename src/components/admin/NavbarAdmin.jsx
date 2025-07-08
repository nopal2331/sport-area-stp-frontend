import { Menu, X } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const NavbarAdmin = ({
  logo = {
    url: "/admin",
    src: "/images/logo.png",
    alt: "logo",
  },

  menu = [
    { title: "Home", url: "/admin" },
    { title: "Pesan Masuk", url: "/admin/pesan" },
    { title: "Laporan", url: "/admin/laporan" },
  ],

  auth = {
    logout: { title: "Keluar", url: "#" },
  },
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Token tidak ditemukan");
      navigate("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const isExpired = Date.now() > payload.exp * 1000;

      if (isExpired) {
        toast.error("Token kadaluarsa");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (payload.role === "user") {
        toast.error("Anda tidak memiliki akses ke halaman ini");
        navigate("/users");
        return;
      }

      if (payload.role !== "admin") {
        toast.error("Akses tidak diizinkan");
        navigate("/login");
        return;
      }
    } catch {
      toast.error("Token tidak valid");
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <section className="py-4 shadow bg-white">
      <div className="mx-auto w-full max-w-7xl px-4">
        {/* Desktop Menu */}
        <nav className="hidden justify-between md:flex">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link to={logo.url} className="flex items-center gap-2">
              <img src={logo.src} className="max-h-8" alt={logo.alt} />
              <span className="text-lg font-semibold tracking-tighter">
                {logo.title}
              </span>
            </Link>
            <NavigationMenu>
              <NavigationMenuList>
                {menu.map((item) => renderMenuItem(item, location.pathname))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                localStorage.removeItem("token");
                toast.success("Anda berhasil keluar dari akun");
                navigate("/");
              }}
            >
              {auth.logout.title}
            </Button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block md:hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to={logo.url} className="flex items-center gap-2">
              <img src={logo.src} className="max-h-8" alt={logo.alt} />
            </Link>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="w-7 h-7" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto p-0">
                <SheetTitle className="sr-only">Navigasi Mobile</SheetTitle>
                <SheetDescription className="sr-only">
                  Menu navigasi untuk admin
                </SheetDescription>
                <div className="flex justify-end p-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="w-9 h-9 border border-input rounded-md hover:bg-muted"
                  >
                    <X className="w-12 h-12" />
                  </Button>
                </div>
                <div className="flex flex-col gap-6 px-4 pb-6">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menu.map((item) =>
                      renderMobileMenuItem(item, location.pathname, setIsOpen)
                    )}
                  </Accordion>
                  <div className="flex flex-col gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsOpen(false);
                        localStorage.removeItem("token");
                        toast.success("Anda berhasil keluar dari akun");
                        navigate("/");
                      }}
                    >
                      {auth.logout.title}
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item, pathname) => {
  const isActive = item.url === pathname;

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        asChild
        className={`group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors ${
          isActive
            ? "bg-muted text-accent-foreground font-bold"
            : "hover:bg-muted hover:text-accent-foreground"
        }`}
      >
        <Link to={item.url}>{item.title}</Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item, setIsOpen) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2 flex flex-col gap-2">
          {item.items.map((subItem) => (
            <SubMenuLink
              key={subItem.title}
              item={subItem}
              onClick={() => setIsOpen(false)}
            />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <Link
      key={item.title}
      to={item.url}
      onClick={() => setIsOpen(false)}
      className="text-md font-semibold"
    >
      {item.title}
    </Link>
  );
};

export { NavbarAdmin };
