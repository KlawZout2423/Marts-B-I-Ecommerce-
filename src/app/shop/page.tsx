import { Suspense } from "react";
import ShopClient from "./ShopClient";

export const dynamic = "force-dynamic";

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopClient />
    </Suspense>
  );
}
