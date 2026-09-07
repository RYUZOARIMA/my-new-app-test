import { Suspense } from "react";
import AdminLoginForm from "@/components/AdminLoginForm";

export const metadata = {
  title: "管理画面ログイン | 士道 SHIDO Gallery Paris",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-6 py-12">
      <div>
        <p className="text-[11px] font-medium tracking-[0.25em] text-[color:var(--color-red)]">
          ADMIN
        </p>
        <h1 className="mt-1 font-serif text-xl text-[color:var(--color-indigo-deep)]">
          管理画面ログイン
        </h1>
      </div>
      <Suspense>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
