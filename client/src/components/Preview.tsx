import { FC } from "react";
interface IPreviewProps {
    img: string;
    desc: string;
};

export const Preview: FC<IPreviewProps> = ({ img, desc }) => {
    return (<div className="preview">
        <img src={img} alt="" />
        <p>
            {desc}
        </p>
    </div>);
}
