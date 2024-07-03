import { memo } from "react"
import one from "../assets/img/hero_one.png"


const Landing = () => {
    return (
        <div className="relative h-[90vh] flex items-center justify-center">
            <div className="absolute inset-0 z-0">
                <img className="w-full h-full object-cover" src={one} alt="Hero image" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-75"></div>
            </div>
            <div className="z-10 relative text-center h-full flex flex-col items-center justify-center max-w-[1000px] mx-auto">
                <h1 className="text-5xl font-[quicksand] font-bold text-white">Participez dès maintenant pour gagner des prix fantastiques !</h1>
                <a href="/roulette" className="bg-white py-2 px-3 rounded-md inline-block mt-4">Participer</a>
                <h2 className="text-sm font-[quicksand] text-white mt-4">En prime, vous serez automatiquement inscrit pour avoir la chance de remporter un an entier de thé d'une valeur de 360€</h2>
            </div>
        </div>
    )
}

export default memo(Landing)