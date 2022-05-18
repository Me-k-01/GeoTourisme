import { FC, ReactNode } from "react";
interface IExpandProps {
    children: ReactNode;
    isOpen: boolean;
};

export const Expand: FC<IExpandProps> = ({ children, isOpen }) => {
    return (
        <div className={"expand" + (isOpen ? "" : " closed")}>
            {children}
        </div>
    );
}
