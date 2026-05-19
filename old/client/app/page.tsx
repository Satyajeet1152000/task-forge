// import { auth, signOut } from "@/auth/auth";
// import { redirect } from "next/navigation";

import { redirect } from "next/navigation";

// export default async function Dashboard() {
export default function Dashboard() {
    redirect("/dashboard");
    // const session = await auth();

    // return (
    //     <div>
    //         {JSON.stringify(session)}
    //         <form
    //             action={async (formData) => {
    //                 "use server";
    //                 await signOut({ redirectTo: "/login" });
    //             }}
    //         >
    //             <button type="submit">Sign out</button>
    //         </form>
    //     </div>
    // );
}
