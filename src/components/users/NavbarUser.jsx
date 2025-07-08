import { Menu, X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const NavbarUser = ({
  logo = {
    url: "/users",
    src: "/images/logo.png",
    alt: "logo",
  },

  menu = [
    { title: "Home", url: "/users" },
    { title: "Panduan", url: "/users/panduan" },
    {
      title: "Sewa Lapangan",
      items: [
        {
          title: "Basket",
          description: "Lapangan basket outdoor siap digunakan.",
          src: "/icons/basketball.svg",
          className: "w-5 h-5",
          url: "/users/sewa-lapangan-basket",
        },
        {
          title: "Futsal",
          description: "Lapangan futsal outdoor nyaman dan luas.",
          src: "/icons/soccer-ball.svg",
          className: "w-5 h-5",
          url: "/users/sewa-lapangan-futsal",
        },
      ],
    },
    { title: "Laporan", url: "/users/laporan" },
  ],

  auth = {
    logout: { title: "Keluar", url: "#" },
  },
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Auth check
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

      if (payload.role === "admin") {
        toast.error("Anda tidak memiliki akses ke halaman ini");
        navigate("/admin");
        return;
      }

      if (payload.role !== "user") {
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
    <section
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 py-4 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      } bg-white shadow`}
    >
      <div className="mx-auto w-full max-w-7xl px-4">
        {/* Desktop Menu */}
        <nav className="hidden justify-between md:flex">
          <div className="flex items-center gap-6">
            <Link to={logo.url} className="flex items-center gap-2">
              <img src={logo.src} className="max-h-8" alt={logo.alt} />
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
                  Menu navigasi untuk pengguna mobile
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

  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="left-0 bg-popover text-popover-foreground">
          <div className="w-[320px] flex flex-col gap-2 p-4">
            {item.items.map((subItem) => (
              <NavigationMenuLink asChild key={subItem.title}>
                <SubMenuLink
                  item={subItem}
                  isActive={pathname === subItem.url}
                />
              </NavigationMenuLink>
            ))}
          </div>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

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

const SubMenuLink = ({ item, isActive = false, onClick }) => {
  return (
    <Link
      to={item.url}
      onClick={onClick}
      className={`flex items-start gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none ${
        isActive
          ? "bg-muted text-accent-foreground font-bold"
          : "hover:bg-muted hover:text-accent-foreground"
      }`}
    >
      {item.src && (
        <img
          src={item.src}
          alt={`${item.title} icon`}
          className={item.className || "w-5 h-5"}
        />
      )}
      <div className="space-y-1">
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description && (
          <p className="text-sm text-muted-foreground">{item.description}</p>
        )}
      </div>
    </Link>
  );
};

export { NavbarUser };
