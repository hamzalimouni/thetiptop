import { Link } from 'react-router-dom';
import Logo from '../assets/img/logo.svg';
import { Button, DatePicker, Input, Select } from 'antd';
import { useState } from 'react';
import { publicRequest } from '../makeRequest';
import SuccessModal from '../components/SuccessModal';
import locale from 'antd/es/date-picker/locale/fr_FR';
import LoginImg from '../assets/img/loginImg.webp';

type Inputs = {
  firstname: string;
  lastname: string;
  email: string;
  gender: string;
  birth: string;
  password: string;
}

const initialInputsValue: Inputs = {
    firstname: "",
    lastname: "",
    email: "",
    gender: "",
    birth: "",
    password: "",
}

const Register = () => {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inputs, setInputs] = useState<Inputs>(initialInputsValue);
  const [open, setOpen] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<Inputs>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Inputs> = {};
    if (!inputs.firstname.trim()) {
      newErrors.firstname = "Nom est requis";
    }

    if (!inputs.lastname.trim()) {
      newErrors.lastname = "Prénom est requis";
    }

    if (!inputs.email.trim()) {
      newErrors.email = "Email est requis";
    } else if (!/\S+@\S+\.\S+/.test(inputs.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!inputs.gender) {
      newErrors.gender = "Genre est requis";
    }

    if (!inputs.birth) {
      newErrors.birth = "Date de naissance est requise";
    }

    if (!inputs.password.trim()) {
      newErrors.password = "Mot de passe est requis";
    } else if (inputs.password.length < 8) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+/.test(inputs.password)) {
      newErrors.password = "Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setInputs((prevInputs) => ({...prevInputs, [name]: value}));
  }

  const handleSubmit = async(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const res = await publicRequest.post(`auth/register`, inputs);
        if (res.status === 201) {
            setInputs(initialInputsValue);
            setOpen(true);
        }
      } catch (error: any) {
        if(error.response?.status === 409){
          setErrors((prevErrors) => ({...prevErrors, email: "Email déjà existe"}))
        }
        else{
          console.log(error);
        }
      } finally{
        setIsLoading(false);
      }
    }
  }

    return (
      <div className={`min-h-screen bg-[url('/src/assets/img/theme.png')] bg-cover bg-center flex items-center justify-center`}>
        <div className="flex w-full max-w-sm mx-auto overflow-hidden rounded-lg shadow-lg  lg:max-w-4xl">
          <div
              className="hidden bg-cover lg:block lg:w-1/2"
              style={{
              backgroundImage:
                `url(${LoginImg})`,
              }}
          ></div>
          <div className="w-full px-6 py-8 md:px-8 lg:w-1/2">
              <div className="flex justify-center mx-auto">
                <img
                    className="w-28"
                    src={Logo}
                    alt="logo"
                />
              </div>
              <div className="mt-3 flex gap-5">
                <div>
                  <label
                  className="block mb-1 text-sm font-medium text-gray-600 "
                  htmlFor="firstname"
                  >
                      Nom
                  </label>
                  <Input id='firstname' name='firstname' onChange={handleChange} value={inputs.firstname} status={(errors.firstname && errors.firstname !== "") ? "error" : ""} className='hover:border-green-700 focus:border-green-700 !shadow-none' />
                  {(errors.firstname && errors.firstname !== "") && <p className="text-[#ff4d4f] text-xs mt-1">{errors.firstname}</p>}
                </div>
                <div>
                  <label
                  className="block mb-1 text-sm font-medium text-gray-600 "
                  htmlFor="lastname"
                  >
                      Prénom
                  </label>
                  <Input id='lastname' name='lastname' onChange={handleChange} value={inputs.lastname} status={(errors.lastname && errors.lastname !== "") ? "error" : ""} className='hover:border-green-700 focus:border-green-700 !shadow-none' />
                  {(errors.lastname && errors.lastname !== "") && <p className="text-[#ff4d4f] text-xs mt-1">{errors.lastname}</p>}
                </div>
              </div>
              <div className="mt-3">
                <label
                    className="block mb-1 text-sm font-medium text-gray-600 "
                    htmlFor="email"
                >
                    Email
                </label>
                <Input id='email' name='email' onChange={handleChange} value={inputs.email} status={(errors.email && errors.email !== "") ? "error" : ""} className='hover:border-green-700 focus:border-green-700 !shadow-none' />
                {(errors.email && errors.email !== "") && <p className="text-[#ff4d4f] text-xs mt-1">{errors.email}</p>}
              </div>
              <div className="mt-3 flex gap-5">
                <div className='flex-1'>
                  <label
                  className="block mb-1 text-sm font-medium text-gray-600 "
                  htmlFor="gender"
                  >
                      Genre
                  </label>
                  <Select 
                    className='w-full hover:border-green-700 focus:border-green-700 !shadow-none' 
                    id='gender' 
                    onChange={(value) => setInputs((prevInputs) => ({...prevInputs, gender: value}))} 
                    status={(errors.gender && errors.gender !== "") ? "error" : ""} 
                  >
                    <Select.Option key={"MALE"}>Homme</Select.Option>
                    <Select.Option key={"FEMALE"}>Femme</Select.Option>
                    <Select.Option key={"OTHER"}>Other</Select.Option>
                  </Select>
                  {(errors.gender && errors.gender !== "") && <p className="text-[#ff4d4f] text-xs mt-1">{errors.gender}</p>}
                </div>
                <div className='flex-1'>
                  <label
                  className="block mb-1 text-sm font-medium text-gray-600 "
                  htmlFor="birth"
                  >
                      Date de naissance
                  </label>
                    <DatePicker 
                      id='birth' 
                      className='w-full hover:border-green-700 focus:border-green-700 !shadow-none' 
                      locale={locale} 
                      onChange={(_, dateString: string | string[]) => setInputs((prevInputs) => ({ ...prevInputs, birth: typeof dateString === "string" ? dateString : ""}))}
                      status={(errors.birth && errors.birth !== "") ? "error" : ""} 
                    />
                    {(errors.birth && errors.birth !== "") && <p className="text-[#ff4d4f] text-xs mt-1">{errors.birth}</p>}
                </div>
              </div>
              <div className="mt-3">
                  <div className="flex justify-between">
                      <label
                      className="block mb-1 text-sm font-medium text-gray-600"
                      htmlFor="password"
                      >
                      Mot de passe
                      </label>
                  </div>
                  <Input.Password id='password' name='password' onChange={handleChange} status={(errors.password && errors.password !== "") ? "error" : ""} className='hover:border-green-700 focus:border-green-700 !shadow-none' />
                  {(errors.password && errors.password !== "") && <p className="text-[#ff4d4f] text-xs mt-1">{errors.password}</p>}
              </div>
              <div className="mt-6">
                <Button
                  loading={isLoading}
                  onClick={handleSubmit}
                  className="w-full text-sm font-medium tracking-wide !text-white transition-colors duration-300 transform bg-green-700 hover:!bg-green-800 hover:!border-green-800 !outline-none"
                >
                  S'inscrire
                </Button>
              </div>

            <div className="flex items-center justify-between mt-4">
              <span className="w-1/5 border-b md:w-1/4"></span>
              <Link
                  to="/login"
                  className="text-xs text-gray-500 uppercase  hover:underline"
              >
                  ou Connectez-vous
              </Link>
              <span className="w-1/5 border-b md:w-1/4"></span>
            </div>
          </div>
        </div>
        {open && <SuccessModal
          open={open} 
          setOpen={setOpen} 
          title="Inscription réussie! 🎉🥳" 
          desc="Félicitations ! Vous êtes maintenant inscrit avec succès. Nous sommes ravis de vous accueillir." 
          submitText="Se Connecter"
          submitType="link"
          linkTo="/login"
        />}
      </div>
    );
};

export default Register;
