import { Modal } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import bg from '../assets/img/theme.png';

type Props = {
    open: boolean;
    setOpen: (isOpen: boolean) => void;
    title: string;
    desc: string;
    submitText: string;
    submitType: string;
    linkTo?: string;
}

const SuccessModal = (props: Props) => {
    return (
        <Modal open={props?.open} footer={[]} closable={false} centered width={470}
            styles={{ 
                content: {background: `url(${bg})`, backgroundPosition: 'center', backgroundSize: 'cover'},
                header: {backgroundColor: 'transparent'},
                footer: {backgroundColor: 'transparent'}
            }}
        >
            <div className="flex flex-col items-center justify-center gap-6 px-5">
                <motion.div
                    animate={{
                        scale: [0, 2, 1, 1],
                    }}
                    className="pt-3"
                    transition={{
                        duration: 2,
                        ease: "easeInOut",
                        times: [0.5, 0.8, 0.5],
                    }}
                >
                    <CheckCircleOutlined className="text-6xl text-[#73d13d]" />
                </motion.div>
                <div className="flex flex-col items-center gap-2">
                    <h2 className="text-lg font-semibold">{props?.title}</h2>
                    <span className="text-medium text-center">{props?.desc}</span>
                </div>
                {props.submitType === "link" ?
                    <Link to={props.linkTo || ""} className="py-2 px-3 text-[15px] cursor-pointer hover:font-medium hover:text-green-600">{props.submitText}</Link>
                :
                    <span onClick={() => props?.setOpen(false)} className="py-2 px-3 text-[15px] rounded-md cursor-pointer hover:font-medium hover:text-green-600">{props?.submitText}</span>
                }
            </div>
        </Modal>
    )
}

export default SuccessModal