import { Card } from "primereact/card";

export default function Footer() {
  return (
    <footer style={{ width: "100%", position: "fixed", bottom: 0, left: 0, zIndex: 50, height: '70px' }}>
      <Card className="!rounded-none !shadow-none " style={{ margin: 0 }}>
        <div className="flex items-center justify-between text-sm ">
          <span>&copy; {new Date().getFullYear()} TMS. All rights reserved.</span>
          <span>Powered by PrimeReact</span>
        </div>
      </Card>
    </footer>
  );
}
