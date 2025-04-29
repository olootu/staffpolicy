export interface ChildPro {
    children: React.ReactNode
  }
  export interface IUser {
    email: string;
    username: string;
    password: string;
    name: string;
    id: number,
    role: 'staff' | 'admin' | string;
  }

  export interface UserContextType {
    user: IUser | null;
    setUser: (user: IUser | null) => void;
  };