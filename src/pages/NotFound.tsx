import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect } from "react";


const NotFound = () => {
  useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
  return (
    <div className={`min-h-screen bg-[url('/src/assets/img/theme.png')] bg-cover bg-center`}>
      <Navbar />
      <section>
        <div className="container min-h-screen px-6 py-12 mx-auto lg:flex lg:items-center lg:gap-12">
          <div className="w-full lg:w-1/2">
            <p className="text-sm font-medium text-blue-500 ">Erreur 404</p>
            <h1 className="mt-3 text-2xl font-semibold text-gray-800">Page non trouvée</h1>
            <p className="mt-4 text-gray-500 ">la page que vous avez demandez est introuvable</p>

            <div className="flex items-center mt-6 gap-x-3">
              <button className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto hover:bg-gray-100  ">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:rotate-180">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                </svg>
                <Link to="/">Retour</Link>
              </button>

              <Link to="/" className="w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto hover:bg-blue-600">
                Accueil
              </Link>
            </div>

            <div className="mt-10 space-y-6">
              {/* Additional content */}
            </div>
          </div>

          <div className="relative w-full mt-8 lg:w-1/2 lg:mt-0">
            <img
              className="w-full lg:h-[32rem] h-80 md:h-96 rounded-lg object-cover"
              src="https://images.unsplash.com/photo-1597481499666-130f8eb2c9cd?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
            />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default NotFound;
