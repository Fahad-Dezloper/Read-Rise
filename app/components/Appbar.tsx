import React from "react";
import SigninButton from "./SigninButton";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

const Appbar = async () => {
const session = await getServerSession(authOptions);
  return (
    <header className="flex gap-4 p-4 bg-gradient-to-b from-white to-gray-200 shadow ">
      <Link className="text-gray-800 hover:text-sky-400 transition-colors" href={"/"}>
        Home
      </Link>
    <Link className="text-gray-800 hover:text-sky-400 transition-colors" href={session?.user.role == "user" ? '/user/dashboard' : '/admin/dashboard'}>
        {session?.user.role == "user" ? 'Dashboard' : 'Dashboard'}
    </Link>
      <SigninButton />
    </header>
  );
};

export default Appbar;