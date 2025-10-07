import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      name: string;
      email: string;
      pic: string;
      roles: string[];
      organization: {
        id: string;
        name: string;
        leader: boolean;
      };
      application: {
        id: number;
        slug: string;
        name: string;
        description: string;
        active: boolean;
      };
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    username: string;
    name: string;
    email: string;
    pic: string;
    roles: string[];
    organization: {
      id: string;
      name: string;
      leader: boolean;
    };
    application: {
      id: number;
      slug: string;
      name: string;
      description: string;
      active: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    name: string;
    email: string;
    pic: string;
    roles: string[];
    organization: {
      id: string;
      name: string;
      leader: boolean;
    };
    application: {
      id: number;
      slug: string;
      name: string;
      description: string;
      active: boolean;
    };
  }
}
