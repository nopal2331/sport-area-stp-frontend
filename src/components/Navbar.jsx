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
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect, useState } from "react";

const Navbar = ({
  logo = {
    url: "#top",
    src: "/images/logo.png",
    alt: "logo",
  },

  menu = [
    { title: "Home", url: "#home" },
    { title: "Fasilitas", url: "#fasilitas" },
    { title: "Jam Operasional", url: "#jam-operasional" },
    { title: "Kontak Kami", url: "#kontak-kami" },
  ],

  auth = {
    login: { title: "Masuk", url: "#" },
    register: { title: "Daftar", url: "#" },
  },
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeHash, setActiveHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setActiveHash(window.location.hash);
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

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

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const isExpired = Date.now() > payload.exp * 1000;

        if (isExpired) {
          localStorage.removeItem("token");
          return;
        }

        toast.warning(
          "Anda tidak bisa mengakses halaman ini. Silahkan keluar terlebih dahulu."
        );

        if (payload.role === "admin") {
          navigate("/admin");
        } else if (payload.role === "user") {
          navigate("/users");
        } else {
          localStorage.removeItem("token");
          toast.error("Role tidak dikenali. Silahkan masuk kembali.");
          navigate("/login");
        }
      } catch {
        localStorage.removeItem("token");
        toast.error("Token tidak valid. Silahkan masuk kembali.");
        navigate("/login");
      }
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
            {/* Logo */}
            <Link to={logo.url} className="flex items-center gap-2">
              <img src={logo.src} className="max-h-8" alt={logo.alt} />
              <span className="text-lg font-semibold tracking-tighter">
                {logo.title}
              </span>
            </Link>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) =>
                    renderMenuItem(item, location.pathname, activeHash)
                  )}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                navigate("/login");
              }}
            >
              {auth.login.title}
            </Button>
            <Button
              variant="default"
              onClick={() => {
                navigate("/register");
              }}
            >
              {auth.register.title}
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
              {/* Tombol Trigger (hamburger menu) */}
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="w-7 h-7" /> {/* Icon diperbesar */}
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto p-0">
                <SheetTitle className="sr-only">Navigasi Mobile</SheetTitle>
                <SheetDescription className="sr-only">
                  Menu navigasi untuk pengguna perangkat mobile
                </SheetDescription>
                {/* Tambahan ini */}
                {/* Tombol Close (X) di kanan atas */}
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
                      renderMobileMenuItem(item, setIsOpen, activeHash)
                    )}
                  </Accordion>
                  <div className="flex flex-col gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigate("/login");
                        setIsOpen(false);
                      }}
                    >
                      {auth.login.title}
                    </Button>
                    <Button
                      variant="default"
                      onClick={() => {
                        navigate("/register");
                        setIsOpen(false);
                      }}
                    >
                      {auth.register.title}
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

const renderMenuItem = (item, pathname, activeHash) => {
  const isActive = item.url === pathname || item.url === activeHash;

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        asChild
        className={`group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors ${
          isActive
            ? "bg-muted text-accent-foreground font-bold"
            : "hover:bg-muted hover:text-accent-foreground"
        }`}
      >
        {item.url.startsWith("#") ? (
          <Link to={item.url}>{item.title}</Link>
        ) : (
          <Link to={item.url}>{item.title}</Link>
        )}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item, setIsOpen) => {
  const handleClick = () => {
    if (item.url.startsWith("#")) {
      setIsOpen(false);
    }
  };

  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  if (item.url.startsWith("#")) {
    return (
      <Link
        key={item.title}
        to={item.url}
        className="text-md font-semibold"
        onClick={handleClick}
      >
        {item.title}
      </Link>
    );
  }

  return (
    <Link
      key={item.title}
      to={item.url}
      className="text-md font-semibold"
      onClick={() => setIsOpen(false)}
    >
      {item.title}
    </Link>
  );
};

const SubMenuLink = ({ item, isActive = false }) => {
  return (
    <Link
      to={item.url}
      className={`flex items-start gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none
        ${
          isActive
            ? "bg-muted text-accent-foreground font-bold"
            : "hover:bg-muted hover:text-accent-foreground"
        }
      `}
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

export { Navbar };
