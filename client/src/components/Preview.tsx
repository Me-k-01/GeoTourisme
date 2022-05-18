import { FC } from "react";
interface IPreviewProps {
    img: string;
    desc: string;
    isOpen: boolean;
};

export const Preview: FC<IPreviewProps> = ({img, desc, isOpen}) => {
    return (
        <div className={"preview" + (isOpen? "" : " closed")} >
            
            <img src={img} alt="" /> 
            <p>
                {desc}
            </p>
        </div>
    );
}
