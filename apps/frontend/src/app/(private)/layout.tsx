import { Header } from "@/components/Header";
import { SideNavBar } from "@/components/SideNavBar";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="flex h-screen flex-col bg-background">
      <Header />
      <div className="flex flex-1 border">
        <SideNavBar />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
