import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { publicRequest } from '../makeRequest';
import { Breadcrumb, Button } from 'antd';
import SuccessModal from '../components/SuccessModal';
import { Helmet } from "react-helmet";
import { HomeOutlined } from '@ant-design/icons';

type Inputs = {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const initialInputsValue: Inputs = {
  name: "",
  email: "",
  subject: "",
  message: ""
}

const Contact = () => {

  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [inputs, setInputs] = useState<Inputs>(initialInputsValue);
  const [errors, setErrors] = useState<Partial<Inputs>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Inputs> = {};
    if (!inputs.name.trim()) {
      newErrors.name = "Nom, Prénom est requis";
    }

    if (!inputs.email.trim()) {
      newErrors.email = "Email est requis";
    } else if (!/\S+@\S+\.\S+/.test(inputs.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!inputs.subject.trim()) {
      newErrors.subject = "Object est requise";
    }

    if (!inputs.message.trim()) {
      newErrors.message = "Message est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if(validateForm()){
      setIsLoading(true);
      try {
        const res = await publicRequest.post('contacts', inputs);
        if(res.status === 201) {
          setInputs(initialInputsValue);
          setOpen(true);
        }
      } catch (error) {
        console.log(error);
      }finally{
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8">
      <Breadcrumb className="bg-[#fafafa40] p-2 rounded-full pl-5 mb-3 shadow-md">
        <Breadcrumb.Item href="/">
            <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item>Contact</Breadcrumb.Item>
      </Breadcrumb>
      <motion.section initial="hidden" animate="visible" variants={containerVariants} className="pt-12 pb-20">
        <Helmet>
          <title>Contactez-Nous | Thé Tip Top</title>
          <meta name="description" content="Contactez-Nous pour plus d'informations sur nos produits et services, ou pour toute autre demande." />
        </Helmet>
        <motion.h1
          variants={itemVariants}
          className="text-gray-800 text-center text-3xl font-extrabold sm:text-4xl"
        >
            Contact
        </motion.h1>
        <motion.div variants={itemVariants} className="lg:flex lg:items-center lg:-mx-6">
          <motion.div variants={itemVariants} className="lg:w-1/2 lg:mx-6">
            <h1 className="text-2xl font-semibold text-gray-800 capitalize lg:text-3xl mt-10 lg:mt-0">
              Contactez-Nous <br /> Pour Plus D'informations.
            </h1>
            <motion.div variants={itemVariants} className="mt-6 space-y-8 md:mt-8">
              <motion.p variants={itemVariants} className="flex items-start -mx-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 mx-2 text-blue-500 "
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-2 text-blue-500 " fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                </svg>
                <span className="mx-2 text-gray-700 truncate w-72 ">
                  18 rue Léon Frot, 75011 Paris
                </span>
              </motion.p>

              <motion.p variants={itemVariants} className="flex items-start -mx-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 mx-2 text-blue-500 "
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-2 text-blue-500 " fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                </svg>
                <span className="mx-2 text-gray-700 truncate w-72 ">01 35 58 69 82</span>
              </motion.p>

              <motion.p variants={itemVariants} className="flex items-start -mx-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 mx-2 text-blue-500 "
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-2 text-blue-500 " fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                </svg>
                <span className="mx-2 text-gray-700 truncate w-72 ">thetiptop@dsp5-archi-f23-15m-g4.fr</span>
              </motion.p>
            </motion.div>
          </motion.div>
          <motion.div variants={itemVariants} className="mt-8 lg:w-1/2 lg:mx-6">
            <motion.div
              variants={itemVariants}
              className="w-full px-8 py-10 mx-auto overflow-hidden rounded-lg shadow-2xl lg:max-w-xl shadow-gray-300/50"
            >
              <h1 className="text-lg font-medium text-gray-700">Que veux-tu demander?</h1>
              <motion.form variants={itemVariants} className="mt-6">
                <motion.div variants={itemVariants} className="flex-1">
                  <label className="block mb-2 text-sm font-medium text-gray-600">Nom, Prénom <span className='text-[#ff4d4f]'>*</span></label>
                  <input
                    name='name'
                    value={inputs.name}
                    type="text"
                    onChange={onChange}
                    className={`block w-full px-5 py-1 mt-2 text-gray-700 placeholder-gray-400 bg-white border ${(errors.name && errors.name !=="") ? 'border-red-500' : 'border-gray-200'} rounded-md outline-none`}
                    // className="block w-full px-5 py-1 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md focus:border-green-600 focus:ring-green-500 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                {(errors.name && errors.name !== "") && <p className="text-[#ff4d4f] text-xs mt-1">{errors.name}</p>}
                </motion.div>

                <motion.div variants={itemVariants} className="flex-1 mt-6">
                  <label className="block mb-2 text-sm font-medium text-gray-600">Email <span className='text-[#ff4d4f]'>*</span></label>
                  <input
                    name='email'
                    type="email"
                    value={inputs.email}
                    onChange={onChange}
                    className={`block w-full px-5 py-1 mt-2 text-gray-700 placeholder-gray-400 bg-white border ${(errors.email && errors.email !=="") ? 'border-red-500' : 'border-gray-200'} rounded-md outline-none`}
                  />
                {(errors.email && errors.email !== "") && <p className="text-[#ff4d4f] text-xs mt-1">{errors.email}</p>}
                </motion.div>

                <motion.div variants={itemVariants} className="flex-1 mt-6">
                  <label className="block mb-2 text-sm font-medium text-gray-600">Object <span className='text-[#ff4d4f]'>*</span></label>
                  <input
                    name='subject'
                    type="text"
                    value={inputs.subject}
                    onChange={onChange}
                    className={`block w-full px-5 py-1 mt-2 text-gray-700 placeholder-gray-400 bg-white border ${(errors.subject && errors.subject !=="") ? 'border-red-500' : 'border-gray-200'} rounded-md outline-none`}
                  />
                {(errors.subject && errors.subject !== "") && <p className="text-[#ff4d4f] text-xs mt-1">{errors.subject}</p>}
                </motion.div>

                <motion.div variants={itemVariants} className="w-full mt-6">
                  <label className="block mb-2 text-sm font-medium text-gray-600">Message <span className='text-[#ff4d4f]'>*</span></label>
                  <textarea
                    onChange={onChange}
                    value={inputs.message}
                    name='message'
                    className={`block w-full h-28 px-5 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md md:h-32 ${(errors.message && errors.message !=="") ? 'border-red-500' : 'border-gray-200'} outline-none`}
                  ></textarea>
                {(errors.message && errors.message !== "") && <p className="text-[#ff4d4f] text-xs mt-1">{errors.message}</p>}
                </motion.div>

                <motion.div variants={itemVariants} className="w-full mt-6">
                  <ReCAPTCHA
                    sitekey={import.meta.env.VITE_REACT_APP_RECAPTCHA}
                    onChange={(value) => setCaptchaValue(value)}
                  />
                </motion.div>

                <Button
                  disabled={!captchaValue}
                  loading={isLoading}
                  onClick={handleSubmit}
                  rootClassName='mt-5 w-full bg-green-700 hover:!bg-green-800 !text-white hover:!border-green-800 disabled:!text-[#00000040] disabled:!bg-[#d9d9d9] disabled:!border-[#00000040]'
                >
                  Envoyer
                </Button>
              </motion.form>
            </motion.div>
          </motion.div>
        </motion.div> 
        {open && <SuccessModal
          open={open} 
          setOpen={setOpen} 
          title="Votre message a été bien envoyé ! 🎉🥳" 
          desc="Nous avons reçu votre message avec succès. Notre équipe vous répondra sous peu. Merci pour votre patience." 
          submitText="Fermer"
          submitType="button"
        />}
      </motion.section>
    </div>
  );
};

export default Contact;
