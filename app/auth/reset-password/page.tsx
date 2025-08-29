
import {Suspense } from "react";

import ResetPasswordContent from "@/auth/ResetPasswordContent";
export default function ResetPasswordPage(){ 
  return (
  <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent/>
    </Suspense>
  );
}
